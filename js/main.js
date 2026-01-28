/**
 * Herrmann Dachkonzepte - Main JavaScript
 * Professional Website Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll);

    // ===== Mobile Navigation Toggle =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Back to Top Button =====
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== Simple Animation on Scroll (AOS-like) =====
    const animatedElements = document.querySelectorAll('[data-aos]');

    function checkAnimation() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                const delay = element.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, delay);
            }
        });
    }

    // Initial check
    checkAnimation();

    // Check on scroll
    window.addEventListener('scroll', checkAnimation);

    // ===== Form Validation =====
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form fields
            const name = this.querySelector('input[name="name"]');
            const email = this.querySelector('input[name="email"]');
            const phone = this.querySelector('input[name="phone"]');
            const message = this.querySelector('textarea[name="message"]');
            const privacy = this.querySelector('input[name="privacy"]');

            let isValid = true;
            let errors = [];

            // Validate name
            if (!name || name.value.trim() === '') {
                isValid = false;
                errors.push('Bitte geben Sie Ihren Namen ein.');
                if (name) name.style.borderColor = '#dc3545';
            } else {
                if (name) name.style.borderColor = '';
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.value)) {
                isValid = false;
                errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                if (email) email.style.borderColor = '#dc3545';
            } else {
                if (email) email.style.borderColor = '';
            }

            // Validate message
            if (!message || message.value.trim() === '') {
                isValid = false;
                errors.push('Bitte geben Sie eine Nachricht ein.');
                if (message) message.style.borderColor = '#dc3545';
            } else {
                if (message) message.style.borderColor = '';
            }

            // Validate privacy checkbox
            if (!privacy || !privacy.checked) {
                isValid = false;
                errors.push('Bitte akzeptieren Sie die Datenschutzbestimmungen.');
            }

            if (isValid) {
                // Show success message (in real implementation, this would submit the form)
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.</p>
                `;
                successMessage.style.cssText = `
                    background: #d4edda;
                    color: #155724;
                    padding: 1.5rem;
                    border-radius: 8px;
                    text-align: center;
                    margin-top: 1rem;
                `;
                successMessage.querySelector('i').style.cssText = `
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    display: block;
                `;

                contactForm.reset();
                contactForm.appendChild(successMessage);

                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } else {
                // Show error messages
                alert(errors.join('\n'));
            }
        });
    }

    // ===== Phone Number Click Tracking (for analytics) =====
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone call clicks (can be integrated with analytics)
            console.log('Phone click tracked');
        });
    });

    // ===== Lazy Loading Images =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== Current Year in Footer =====
    const yearSpan = document.querySelector('.footer-bottom .year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===== Active Navigation Link =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ===== Service Cards Hover Effect =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===== WhatsApp Button Animation =====
    const whatsappBtn = document.querySelector('.whatsapp-btn');

    if (whatsappBtn) {
        // Pulse animation every 10 seconds
        setInterval(() => {
            whatsappBtn.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                whatsappBtn.style.animation = '';
            }, 500);
        }, 10000);
    }

    // ===== Add Pulse Animation CSS =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);

    // ===== Counter Animation (for stats if present) =====
    const counters = document.querySelectorAll('[data-counter]');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ===== Parallax Effect for Hero (subtle) =====
    const hero = document.querySelector('.hero');

    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = `${rate}px`;
        });
    }

    console.log('Herrmann Dachkonzepte Website Loaded Successfully');
});
