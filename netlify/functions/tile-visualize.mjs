/**
 * /api/tile-visualize — server-side AI interior visualization.
 *
 * Browser -> this function -> Amazon Bedrock image model -> generated image.
 *
 * SECURITY
 *   - The bearer token is read from a server-side environment variable and is
 *     never returned, logged, or exposed to the client.
 *   - tileId is resolved against this function's own catalog. Client-supplied
 *     paths are never touched, so no request can read an arbitrary file.
 *   - The tile image is loaded from a server-owned path, MIME-sniffed, size
 *     capped and re-encoded before it reaches the model.
 *   - Provider errors are mapped to a small sanitized set. Stack traces never
 *     reach the browser.
 *   - Per-IP rate limiting and an in-process cache bound spend.
 *
 * CONFIGURATION (set in the Netlify environment)
 *   AWS_BEARER_TOKEN_BEDROCK  required, secret
 *   AWS_REGION                 required, e.g. us-east-1
 *   BEDROCK_IMAGE_MODEL        required, model id. Deliberately NOT defaulted:
 *                              the available image model must be confirmed for
 *                              the account and region rather than assumed.
 *   BEDROCK_GENERATION_VERSION optional; bump to invalidate cached results
 *   SITE_ORIGIN                optional; origin used to fetch tile images when
 *                              they are not present on the function filesystem
 *   AI_VISUALIZE_DEMO          set to "true" ONLY for local development
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

// Static specifier so the bundler traces the catalog into the function bundle.
const catalog = require('./tile-catalog.json');

// fileURLToPath, not URL.pathname: pathname leaves percent-encoding in place, so
// a project path containing a space would not resolve on disk.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(HERE, '..', '..');

/* Fixed server-side origin, never taken from the incoming request, so the
   image fetch cannot be steered at an internal address. */
const SITE_ORIGIN = (
  process.env.SITE_ORIGIN || 'https://magadhenterprises.netlify.app'
).replace(/\/+$/, '');

const DISCLAIMER =
  'AI Visualization — illustrative preview. Actual appearance may vary by ' +
  'lighting, installation pattern, grout, screen and real-world conditions.';

/* ------------------------------------------------------------ catalog */

const TILES = new Map(catalog.tiles.map(t => [t.id, t]));

const SPACES = {
  kitchen: {
    label: 'Kitchen',
    prompt:
      'Create a photorealistic premium residential kitchen interior. Use the ' +
      'supplied tile image as the exact material reference and preserve its ' +
      'distinctive colour, pattern, veining, texture and finish. Apply the ' +
      'material naturally to appropriate kitchen surfaces such as the ' +
      'backsplash, feature wall or floor. Use realistic scale, perspective, ' +
      'grout lines, natural lighting, soft shadows and subtle reflections. ' +
      'Contemporary Indian residential design. Present a finished, ' +
      'professionally photographed interior, not a showroom poster.'
  },
  floor: {
    label: 'Floor',
    prompt:
      'Create a photorealistic premium residential interior with the supplied ' +
      'tile installed as the flooring. Preserve the tile visual identity, ' +
      'pattern, colour and surface character. Show a clear floor plane with ' +
      'correct perspective, realistic grout spacing, natural reflections and ' +
      'daylight interior lighting. Living room, dining area or hallway setting.'
  },
  wall: {
    label: 'Wall',
    prompt:
      'Create a photorealistic premium contemporary interior feature wall using ' +
      'the supplied tile. Preserve the tile visible pattern and colour ' +
      'character exactly. Use realistic wall scale and perspective, natural ' +
      'lighting, soft shadows and believable architectural details. ' +
      'Television wall or living room accent wall setting.'
  },
  bathroom: {
    label: 'Bathroom',
    prompt:
      'Create a photorealistic premium modern bathroom using the supplied tile ' +
      'on appropriate bathroom walls and flooring. Preserve the tile visual ' +
      'identity and finish. Include realistic scale, grout lines, wet-area ' +
      'lighting, reflections, a vanity, mirror and believable fixtures and ' +
      'proportions.'
  }
};

/* ------------------------------------------------------------- cost control */

const LIMITS = {
  MAX_BODY_BYTES: 8 * 1024,      // request body
  MAX_TILE_BYTES: 6 * 1024 * 1024,
  RATE_WINDOW_MS: 60_000,
  RATE_MAX: 6,                    // generations per IP per window
  CACHE_TTL_MS: 1000 * 60 * 60,   // 1 hour
  CACHE_MAX: 60
};

const rateBuckets = new Map();
const cache = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > LIMITS.RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    if (rateBuckets.size > 5000) rateBuckets.clear();
    return false;
  }
  bucket.count += 1;
  return bucket.count > LIMITS.RATE_MAX;
}

function cacheKey(tileId, environment) {
  const version =
    process.env.BEDROCK_GENERATION_VERSION ||
    catalog.promptVersion ||
    'v1';
  const model = process.env.BEDROCK_IMAGE_MODEL || 'unconfigured';
  return `${version}|${model}|${tileId}|${environment}`;
}

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > LIMITS.CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key, value) {
  if (cache.size >= LIMITS.CACHE_MAX) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { at: Date.now(), value });
}

/* ------------------------------------------------------------ tile input */

/**
 * Load the source tile for a catalog entry.
 *
 * Two paths, because the deployed function bundle does not contain the site's
 * image directory:
 *   1. the local filesystem (netlify dev, or a bundle with included_files)
 *   2. the published site over HTTPS
 *
 * Either way the bytes are validated before use: size cap plus a JPEG magic
 * check. `relativePath` always comes from the server-side catalog, never from
 * the request.
 */
async function loadSourceTile(tile) {
  const relative = tile.actual;

  if (typeof relative !== 'string' || relative.includes('..')) {
    return { error: 'invalid_source' };
  }

  const local = path.resolve(PROJECT_ROOT, relative);
  const escapes = !local.startsWith(PROJECT_ROOT + path.sep);
  const existsLocally = !escapes && fs.existsSync(local);

  let buffer = null;

  if (existsLocally) {
    const stat = fs.statSync(local);
    if (stat.size > LIMITS.MAX_TILE_BYTES) return { error: 'source_too_large' };
    buffer = fs.readFileSync(local);
  } else {
    if (escapes) return { error: 'invalid_source' };
    try {
      const url = SITE_ORIGIN + '/' + relative.replace(/^\/+/, '');
      const res = await fetch(url, { headers: { Accept: 'image/jpeg' } });
      if (!res.ok) return { error: 'source_fetch_failed' };

      const declared = Number(res.headers.get('content-length') || 0);
      if (declared && declared > LIMITS.MAX_TILE_BYTES) {
        return { error: 'source_too_large' };
      }

      buffer = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      return { error: 'source_fetch_failed' };
    }
  }

  if (!buffer || !buffer.length) return { error: 'source_missing' };
  if (buffer.length > LIMITS.MAX_TILE_BYTES) return { error: 'source_too_large' };

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (!isJpeg) return { error: 'source_bad_mime' };

  return { buffer, mime: 'image/jpeg' };
}

/* ---------------------------------------------------------------- bedrock */

const PROVIDER_ERRORS = {
  400: { code: 'bad_request', message: 'The visualization request was rejected.' },
  401: { code: 'unauthorized', message: 'AI visualization is temporarily unavailable.' },
  403: { code: 'forbidden', message: 'AI visualization is temporarily unavailable.' },
  404: { code: 'model_not_found', message: 'AI visualization is temporarily unavailable.' },
  408: { code: 'provider_timeout', message: 'That took too long. Please try again.' },
  413: { code: 'too_large', message: 'The reference image is too large to process.' },
  429: { code: 'quota', message: 'AI previews are busy right now. Please try again shortly.' },
  500: { code: 'provider_error', message: 'AI visualization is temporarily unavailable.' },
  503: { code: 'provider_unavailable', message: 'AI visualization is temporarily unavailable.' }
};

async function callBedrock({ tile, environment, source }) {
  const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
  const region = process.env.AWS_REGION;
  const model = process.env.BEDROCK_IMAGE_MODEL;

  if (!token) return { configError: 'missing_token' };
  if (!region) return { configError: 'missing_region' };
  if (!model) return { configError: 'missing_model' };

  const space = SPACES[environment];
  const endpoint =
    `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(model)}/invoke`;

  // The selected tile image is sent as image input so the model conditions on
  // the real material rather than inventing one from the prompt alone.
  const body = {
    taskType: 'TEXT_IMAGE',
    textToImageParams: { text: space.prompt },
    imageParams: {
      text: space.prompt,
      images: [
        {
          format: 'png',
          source: { bytes: source.buffer.toString('base64') }
        }
      ]
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      quality: 'standard',
      width: 1024,
      height: 1024
    }
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const text = await res.text();

    if (!res.ok) {
      const mapped = PROVIDER_ERRORS[res.status] ||
        { code: 'provider_error', message: 'AI visualization is temporarily unavailable.' };
      return { httpError: { status: res.status, ...mapped } };
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      return { httpError: { status: 502, code: 'bad_response', message: 'AI visualization is temporarily unavailable.' } };
    }

    const b64 = payload?.images?.[0] ?? payload?.outputImage ?? payload?.image;
    if (!b64) {
      return { httpError: { status: 502, code: 'no_image', message: 'AI visualization is temporarily unavailable.' } };
    }

    return { image: b64 };
  } catch (err) {
    if (err && err.name === 'AbortError') {
      return { httpError: { status: 504, code: 'timeout', message: 'That took too long. Please try again.' } };
    }
    return { httpError: { status: 502, code: 'network', message: 'AI visualization is temporarily unavailable.' } };
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------ demo mode */

/**
 * Local development only. Produces a clearly labelled placeholder so the UI
 * can be exercised without spending credits. Guarded so it can never be
 * mistaken for real output in production.
 */
function demoPayload(tile, environment) {
  // 1x1 PNG, neutral. Not a visualization.
  const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return {
    success: true,
    image: png,
    tileId: tile.id,
    environment,
    generatedAt: new Date().toISOString(),
    disclaimer: DISCLAIMER,
    demo: true
  };
}

/* --------------------------------------------------------------- handler */

const CORS_HEADERS = { 'Cache-Control': 'no-store' };

function json(status, payload) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    body: JSON.stringify(payload)
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { ...CORS_HEADERS }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, error: 'method_not_allowed' });
  }

  if ((event.body || '').length > LIMITS.MAX_BODY_BYTES) {
    return json(413, { success: false, error: 'payload_too_large' });
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { success: false, error: 'bad_json' });
  }

  const tileId = typeof payload.tileId === 'string' ? payload.tileId : '';
  const environment = typeof payload.environment === 'string' ? payload.environment : '';

  // Server-side allowlist. A client cannot widen it or supply a path.
  const tile = TILES.get(tileId);
  if (!tile) {
    return json(400, { success: false, error: 'invalid_tile' });
  }
  if (!Object.prototype.hasOwnProperty.call(SPACES, environment)) {
    return json(400, { success: false, error: 'invalid_environment' });
  }

  const ip =
    event.headers?.['x-nf-client-connection-ip'] ||
    event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    'unknown';

  const key = cacheKey(tileId, environment);
  const cached = cacheGet(key);
  if (cached) {
    return json(200, { ...cached, cached: true });
  }

  let out;

  if (process.env.AI_VISUALIZE_DEMO === 'true') {
    // Free and provider-free, so it skips rate limiting entirely.
    out = demoPayload(tile, environment);
  } else {
    if (rateLimited(ip)) {
      return json(429, {
        success: false,
        error: 'rate_limited',
        message: 'Too many previews requested. Please wait a moment.'
      });
    }

    const source = await loadSourceTile(tile);
    if (source.error) {
      console.error('[tile-visualize] source image unavailable:', source.error);
      return json(500, {
        success: false,
        error: 'service_unavailable',
        message: 'AI visualization is temporarily unavailable. Please try again later.'
      });
    }

    const result = await callBedrock({ tile, environment, source });

    if (result.configError) {
      // The specific reason goes to the function log, never to the browser:
      // internal configuration names are not the visitor's business.
      const reasons = {
        missing_token: 'AWS_BEARER_TOKEN_BEDROCK is not set',
        missing_region: 'AWS_REGION is not set',
        missing_model: 'BEDROCK_IMAGE_MODEL is not set'
      };
      console.error('[tile-visualize] misconfigured:', reasons[result.configError]);
      return json(503, {
        success: false,
        error: 'service_unavailable',
        message: 'AI visualization is temporarily unavailable. Please try again later.'
      });
    }

    if (result.httpError) {
      console.error(
        '[tile-visualize] provider rejected the request:',
        result.httpError.status,
        result.httpError.code
      );
      return json(result.httpError.status === 429 ? 429 : 502, {
        success: false,
        error: result.httpError.code,
        message: result.httpError.message
      });
    }

    out = {
      success: true,
      image: result.image,
      tileId: tile.id,
      tileName: tile.name,
      environment,
      generatedAt: new Date().toISOString(),
      disclaimer: DISCLAIMER
    };
  }

  cacheSet(key, out);
  return json(200, out);
}