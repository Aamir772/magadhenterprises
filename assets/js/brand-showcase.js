/**
 * Brand Showcase — cinematic carousel for tile brands and building solutions.
 * Auto-rotation, pause on hover, touch swipe, keyboard navigation, reduced motion.
 */
(function () {
  'use strict';

  function initCarousel(carouselId, interval) {
    var carousel = document.getElementById(carouselId);
    if (!carousel) return;

    var track = carousel.querySelector('.brand-carousel__track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.brand-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.brand-carousel__dot'));
    var prevBtn = carousel.querySelector('.brand-carousel__prev');
    var nextBtn = carousel.querySelector('.brand-carousel__next');

    if (!slides.length) return;

    var current = 0;
    var timer = null;
    var isPaused = false;
    var touchStartX = 0;
    var touchEndX = 0;

    function goTo(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      current = index;

      // Update slides
      slides.forEach(function (slide, i) {
        if (i === current) {
          slide.classList.add('is-active');
          slide.removeAttribute('aria-hidden');
        } else {
          slide.classList.remove('is-active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      // Update dots
      dots.forEach(function (dot, i) {
        if (i === current) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.setAttribute('aria-selected', 'false');
        }
      });

      // Move track
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function startTimer() {
      if (timer) clearInterval(timer);
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;
      timer = setInterval(function () {
        if (!isPaused) next();
      }, interval || 4500);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Controls
    if (prevBtn) prevBtn.addEventListener('click', function () {
      isPaused = true;
      prev();
      setTimeout(function () { isPaused = false; startTimer(); }, 100);
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      isPaused = true;
      next();
      setTimeout(function () { isPaused = false; startTimer(); }, 100);
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(idx)) {
          isPaused = true;
          goTo(idx);
          setTimeout(function () { isPaused = false; startTimer(); }, 100);
        }
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', function () { isPaused = true; });
    carousel.addEventListener('mouseleave', function () { isPaused = false; });

    // Pause on focus
    carousel.addEventListener('focusin', function () { isPaused = true; });
    carousel.addEventListener('focusout', function () { isPaused = false; });

    // Keyboard navigation
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); startTimer(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); startTimer(); }
    });

    // Touch swipe
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
        startTimer();
      }
    }, { passive: true });

    // Reduced motion: show all slides stacked
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      slides.forEach(function (slide) {
        slide.classList.add('is-active');
        slide.removeAttribute('aria-hidden');
      });
      track.style.transform = 'none';
      track.classList.add('js-initialized');
      return;
    }

    // Initialize
    track.classList.add('js-initialized');
    goTo(0);
    startTimer();
  }

  function init() {
    initCarousel('tile-brands-carousel', 4500);
    initCarousel('home-tile-brands-carousel', 4500);
    initCarousel('home-building-carousel', 4500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
