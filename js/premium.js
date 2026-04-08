/**
 * Herrmann Dachkonzepte - Premium Enhancements
 * Lenis Smooth Scroll + GSAP ScrollTrigger
 */

(function () {
    'use strict';

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ===== Lenis Smooth Scroll =====
    if (typeof Lenis !== 'undefined') {
        var lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            smoothWheel: true
        });

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Let GSAP ticker drive Lenis (single RAF loop)
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(function (time) {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback: own RAF loop only if no GSAP
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    // ===== GSAP ScrollTrigger Animations =====
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Parallax (video or image)
        var heroBgMedia = document.querySelector('.hero-bg video') || document.querySelector('.hero-bg img');
        if (heroBgMedia) {
            gsap.to(heroBgMedia, {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        // CTA Parallax
        document.querySelectorAll('.cta-bg img').forEach(function (img) {
            gsap.to(img, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.cta'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Section headers, badges, gallery items, service cards, partner features,
        // and team cards are all handled by the CSS reveal system (data-reveal).
        // GSAP must not animate opacity on elements with data-reveal, as inline
        // styles override the CSS .revealed class and keep elements invisible.

        // Stat counters
        document.querySelectorAll('.stat-number').forEach(function (stat) {
            gsap.from(stat, {
                innerText: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    once: true
                }
            });
        });
    }

    // ===== Button Spotlight Effect =====
    document.querySelectorAll('.btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            btn.style.setProperty('--mouse-x', x + '%');
            btn.style.setProperty('--mouse-y', y + '%');
        });
    });

    // ===== Lazy Image Fade In =====
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function () {
                img.classList.add('loaded');
            });
        }
    });

})();
