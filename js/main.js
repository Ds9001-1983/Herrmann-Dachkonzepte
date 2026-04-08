/**
 * Herrmann Dachkonzepte - Main JavaScript
 * Modern & Dynamic Website Interactions
 */

(function () {
    'use strict';

    // ===== Scroll Progress Bar =====
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ===== Combined Scroll Handler =====
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateScrollProgress();
                handleHeaderScroll();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ===== Mobile Navigation =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isActive = navMenu.classList.contains('active');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = isActive ? '' : 'hidden';
        });

        // Close menu on non-dropdown link click
        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function (e) {
                // Don't close if it's a dropdown toggle
                var parent = this.parentElement;
                if (parent && parent.classList.contains('nav-dropdown')) {
                    // On mobile, toggle the dropdown
                    if (window.innerWidth < 992) {
                        e.preventDefault();
                        parent.classList.toggle('open');
                        return;
                    }
                }
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close dropdown on sub-link click (mobile)
        navMenu.querySelectorAll('.dropdown-menu .nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== Active Navigation Link =====
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (href !== 'kontakt.html#termin') {
            link.classList.remove('active');
        }
    });

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ===== Back to Top Button =====
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Scroll Reveal Animation System =====
    const revealElements = document.querySelectorAll('[data-reveal]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealElements.length > 0 && !prefersReducedMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);

                    if (delay > 0) {
                        setTimeout(function () {
                            el.classList.add('revealed');
                        }, delay);
                    } else {
                        el.classList.add('revealed');
                    }

                    revealObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else if (prefersReducedMotion) {
        // Show everything immediately if user prefers reduced motion
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // ===== Hero Entrance Animation =====
    var hero = document.querySelector('.hero');

    if (hero && !prefersReducedMotion) {
        var heroElements = [
            { sel: '.hero-badge', delay: 200 },
            { sel: '.hero-title', delay: 400 },
            { sel: '.hero-subtitle', delay: 600 },
            { sel: '.hero-buttons', delay: 800 },
            { sel: '.hero-trust', delay: 1000 },
            { sel: '.hero-scroll', delay: 1200 }
        ];

        heroElements.forEach(function (item) {
            var el = hero.querySelector(item.sel);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';

                setTimeout(function () {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, item.delay);
            }
        });
    }

    // ===== Lightbox Gallery =====
    var galleryImages = [];
    var currentImageIndex = 0;

    // Create lightbox if it doesn't exist
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.id = 'lightbox';
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = '<button class="lightbox-close" aria-label="Schließen">&times;</button>' +
            '<button class="lightbox-prev" aria-label="Vorheriges Bild"><i class="fas fa-chevron-left"></i></button>' +
            '<button class="lightbox-next" aria-label="Nächstes Bild"><i class="fas fa-chevron-right"></i></button>' +
            '<div class="lightbox-content"><img src="" alt=""></div>' +
            '<div class="lightbox-counter"></div>';
        document.body.appendChild(lightbox);
    }

    var lightboxImg = lightbox.querySelector('.lightbox-content img');
    var lightboxCounter = lightbox.querySelector('.lightbox-counter');
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var lightboxPrev = lightbox.querySelector('.lightbox-prev');
    var lightboxNext = lightbox.querySelector('.lightbox-next');

    // Collect gallery images from .project-item and .gallery-item
    document.querySelectorAll('.project-item, .gallery-item').forEach(function (item) {
        var img = item.querySelector('img');
        if (img) {
            galleryImages.push({
                src: img.src,
                alt: img.alt,
                element: item
            });

            item.style.cursor = 'pointer';
            item.addEventListener('click', function (e) {
                e.preventDefault();
                var idx = galleryImages.findIndex(function (g) { return g.element === item; });
                openLightboxAt(idx >= 0 ? idx : 0);
            });
        }
    });

    // Global openLightbox function for onclick attributes
    window.openLightbox = function (element) {
        if (!element) return;
        var img = element.querySelector ? element.querySelector('img') : null;
        if (!img) return;
        var idx = galleryImages.findIndex(function (g) { return g.src === img.src; });
        if (idx >= 0) {
            openLightboxAt(idx);
        }
    };

    function openLightboxAt(index) {
        if (!lightbox || galleryImages.length === 0) return;
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        // Only restore scroll if nav is not open
        if (!navMenu || !navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    function updateLightboxImage() {
        if (!lightboxImg) return;
        var current = galleryImages[currentImageIndex];
        lightboxImg.src = current.src;
        lightboxImg.alt = current.alt;
        if (lightboxCounter) {
            lightboxCounter.textContent = (currentImageIndex + 1) + ' / ' + galleryImages.length;
        }
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }, { passive: true });

    // ===== Contact Form Validation =====
    var contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = this.querySelector('input[name="name"]');
            var email = this.querySelector('input[name="email"]');
            var message = this.querySelector('textarea[name="message"]');
            var privacy = this.querySelector('input[name="privacy"]');
            var isValid = true;

            // Remove previous error states
            this.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });
            this.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });

            function showError(field, msg) {
                if (!field) return;
                field.classList.add('error');
                var errorEl = document.createElement('span');
                errorEl.className = 'form-error';
                errorEl.textContent = msg;
                errorEl.style.color = 'var(--color-accent)';
                errorEl.style.fontSize = '0.85rem';
                errorEl.style.marginTop = '0.25rem';
                errorEl.style.display = 'block';
                field.parentNode.appendChild(errorEl);
            }

            // Validate name
            if (!name || name.value.trim() === '') {
                isValid = false;
                showError(name, 'Bitte geben Sie Ihren Namen ein.');
            }

            // Validate email
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.value)) {
                isValid = false;
                showError(email, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            }

            // Validate message
            if (!message || message.value.trim() === '') {
                isValid = false;
                showError(message, 'Bitte geben Sie eine Nachricht ein.');
            }

            // Validate privacy
            if (!privacy || !privacy.checked) {
                isValid = false;
                var privacyLabel = privacy ? privacy.closest('.form-check') : null;
                if (privacyLabel) {
                    privacyLabel.style.color = 'var(--color-accent)';
                    setTimeout(function () { privacyLabel.style.color = ''; }, 3000);
                }
            }

            if (isValid) {
                var btn = this.querySelector('button[type="submit"]');
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Nachricht gesendet!';
                    btn.disabled = true;
                    btn.style.background = '#16a34a';
                }

                var form = this;

                setTimeout(function () {
                    form.reset();
                    if (btn) {
                        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Nachricht senden';
                        btn.disabled = false;
                        btn.style.background = '';
                    }
                }, 4000);
            }
        });
    }

    // ===== WhatsApp Button Pulse =====
    var whatsappBtn = document.querySelector('.whatsapp-btn');

    if (whatsappBtn) {
        setInterval(function () {
            whatsappBtn.classList.add('pulse');
            setTimeout(function () {
                whatsappBtn.classList.remove('pulse');
            }, 600);
        }, 8000);
    }

    // ===== Cookie Consent Banner =====
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');

    function setCookieConsent(value) {
        localStorage.setItem('cookieConsent', value);
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        }
    }

    function checkCookieConsent() {
        var consent = localStorage.getItem('cookieConsent');
        if (!consent && cookieBanner) {
            setTimeout(function () {
                cookieBanner.classList.add('visible');
                cookieBanner.setAttribute('aria-hidden', 'false');
            }, 1000);
        }
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', function () {
            setCookieConsent('all');
        });
    }

    if (cookieReject) {
        cookieReject.addEventListener('click', function () {
            setCookieConsent('essential');
        });
    }

    checkCookieConsent();

    // ===== Dropdown Aria Toggle =====
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('[aria-expanded]');
        if (toggle) {
            dropdown.addEventListener('mouseenter', function () {
                toggle.setAttribute('aria-expanded', 'true');
            });
            dropdown.addEventListener('mouseleave', function () {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ===== Accessibility Widget =====
    var a11yToggle = document.getElementById('a11yToggle');
    var a11yPanel = document.getElementById('a11yPanel');
    var a11yClose = document.getElementById('a11yClose');
    var html = document.documentElement;

    // Load saved settings
    function a11yLoadSettings() {
        var fontSize = localStorage.getItem('a11y-font-size');
        if (fontSize) html.style.fontSize = fontSize;

        if (localStorage.getItem('a11y-high-contrast') === 'true') {
            html.classList.add('a11y-high-contrast');
            var btn = document.getElementById('a11yContrast');
            if (btn) btn.setAttribute('aria-pressed', 'true');
        }
        if (localStorage.getItem('a11y-underline-links') === 'true') {
            html.classList.add('a11y-underline-links');
            var btn = document.getElementById('a11yLinks');
            if (btn) btn.setAttribute('aria-pressed', 'true');
        }
        if (localStorage.getItem('a11y-reduce-motion') === 'true') {
            html.classList.add('a11y-reduce-motion');
            var btn = document.getElementById('a11yMotion');
            if (btn) btn.setAttribute('aria-pressed', 'true');
        }
    }

    a11yLoadSettings();

    if (a11yToggle && a11yPanel) {
        a11yToggle.addEventListener('click', function () {
            var isOpen = a11yPanel.classList.toggle('open');
            a11yToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            a11yPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        });

        if (a11yClose) {
            a11yClose.addEventListener('click', function () {
                a11yPanel.classList.remove('open');
                a11yToggle.setAttribute('aria-expanded', 'false');
                a11yPanel.setAttribute('aria-hidden', 'true');
            });
        }

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.a11y-widget')) {
                a11yPanel.classList.remove('open');
                a11yToggle.setAttribute('aria-expanded', 'false');
                a11yPanel.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Font size controls
    var currentFontSize = parseFloat(getComputedStyle(html).fontSize) || 16;

    var fontIncrease = document.getElementById('a11yFontIncrease');
    var fontDecrease = document.getElementById('a11yFontDecrease');
    var fontReset = document.getElementById('a11yFontReset');

    if (fontIncrease) {
        fontIncrease.addEventListener('click', function () {
            if (currentFontSize < 22) {
                currentFontSize += 1;
                html.style.fontSize = currentFontSize + 'px';
                localStorage.setItem('a11y-font-size', currentFontSize + 'px');
            }
        });
    }
    if (fontDecrease) {
        fontDecrease.addEventListener('click', function () {
            if (currentFontSize > 12) {
                currentFontSize -= 1;
                html.style.fontSize = currentFontSize + 'px';
                localStorage.setItem('a11y-font-size', currentFontSize + 'px');
            }
        });
    }
    if (fontReset) {
        fontReset.addEventListener('click', function () {
            currentFontSize = 16;
            html.style.fontSize = '16px';
            localStorage.removeItem('a11y-font-size');
        });
    }

    // Toggle buttons
    function a11yToggleOption(btnId, className, storageKey) {
        var btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', function () {
            var isActive = html.classList.toggle(className);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            localStorage.setItem(storageKey, isActive ? 'true' : 'false');
        });
    }

    a11yToggleOption('a11yContrast', 'a11y-high-contrast', 'a11y-high-contrast');
    a11yToggleOption('a11yLinks', 'a11y-underline-links', 'a11y-underline-links');
    a11yToggleOption('a11yMotion', 'a11y-reduce-motion', 'a11y-reduce-motion');

    // Reset all
    var resetAll = document.getElementById('a11yResetAll');
    if (resetAll) {
        resetAll.addEventListener('click', function () {
            currentFontSize = 16;
            html.style.fontSize = '16px';
            html.classList.remove('a11y-high-contrast', 'a11y-underline-links', 'a11y-reduce-motion');
            localStorage.removeItem('a11y-font-size');
            localStorage.removeItem('a11y-high-contrast');
            localStorage.removeItem('a11y-underline-links');
            localStorage.removeItem('a11y-reduce-motion');

            ['a11yContrast', 'a11yLinks', 'a11yMotion'].forEach(function (id) {
                var btn = document.getElementById(id);
                if (btn) btn.setAttribute('aria-pressed', 'false');
            });
        });
    }

    // ===== Initial calls =====
    handleHeaderScroll();
    updateScrollProgress();
    updateBackToTop();

})();
