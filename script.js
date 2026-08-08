// ===========================
// Portfolio - Main JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Wait for Spline iframe to load before showing content
    const loader = document.getElementById('loader');
    const portfolio = document.getElementById('portfolio');
    const splineIframe = document.getElementById('spline-iframe');

    function showPage() {
        if (loader) loader.classList.add('hidden');
        if (portfolio) {
            portfolio.style.opacity = '1';
            portfolio.style.transition = 'opacity 0.8s ease';
        }
        initScrollReveal();
        initNavigation();
        initMobileMenu();
        initCounterAnimation();
        initTiltEffect();
    }

    if (splineIframe) {
        splineIframe.addEventListener('load', () => {
            // Give Spline a moment to render
            setTimeout(showPage, 800);
        });
        // Fallback if iframe takes too long
        setTimeout(showPage, 6000);
    } else {
        showPage();
    }
});

// ===========================
// Dark Moving Mesh Background
// ===========================
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, particles;
    const particleCount = 80;
    const maxDist = 120;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw and move particles
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(180, 180, 180, 0.3)';
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// ===========================
// Scroll Reveal Animation
// ===========================
function initScrollReveal() {
    const container = document.querySelector('.scroll-container');
    const items = document.querySelectorAll('.bento__item');

    const observerOptions = {
        root: container,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger children within the section
                const section = entry.target.closest('.scroll-section');
                if (section) {
                    const sectionItems = section.querySelectorAll('.bento__item');
                    sectionItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 120);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    items.forEach(item => observer.observe(item));

    // Also trigger first section immediately
    setTimeout(() => {
        const firstSection = document.querySelector('.scroll-section');
        if (firstSection) {
            firstSection.querySelectorAll('.bento__item').forEach((item, i) => {
                setTimeout(() => item.classList.add('visible'), i * 120);
            });
        }
    }, 300);
}

// ===========================
// Navigation Scroll Effect
// ===========================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const container = document.querySelector('.scroll-container');

    if (container) {
        container.addEventListener('scroll', () => {
            if (container.scrollTop > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        }, { passive: true });
    }

    // Scroll for nav links (no smooth, instant)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target && container) {
                target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        });
    });
}

// ===========================
// Mobile Menu
// ===========================
function initMobileMenu() {
    const menuBtn = document.querySelector('.nav__menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__links a');
    const scrollContainer = document.querySelector('.scroll-container');

    if (!menuBtn || !mobileMenu) return;

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const isActive = menuBtn.classList.contains('active');
        
        if (isActive) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            if (scrollContainer) scrollContainer.style.overflow = '';
        } else {
            menuBtn.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (scrollContainer) scrollContainer.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        if (scrollContainer) scrollContainer.style.overflow = '';
    }

    menuBtn.addEventListener('click', toggleMenu);
    menuBtn.addEventListener('touchend', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
        link.addEventListener('touchend', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ===========================
// Counter Animation
// ===========================
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat__number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/^([\d.]+)/);

    if (!match) return;

    const targetNum = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const startTime = performance.now();
    const isDecimal = text.includes('.');

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = targetNum * eased;

        if (isDecimal) {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = text;
        }
    }

    requestAnimationFrame(update);
}

// ===========================
// Subtle Tilt Effect on Cards
// ===========================
function initTiltEffect() {
    const cards = document.querySelectorAll('.bento__item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -1.5;
            const rotateY = ((x - centerX) / centerX) * 1.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===========================
// Typing Effect for Code Block
// ===========================
(function initTypingEffect() {
    const codeBlock = document.querySelector('.code-block__content code');
    if (!codeBlock) return;

    const originalHTML = codeBlock.innerHTML;
    const text = codeBlock.textContent;
    codeBlock.textContent = '';
    codeBlock.style.visibility = 'visible';

    let charIndex = 0;
    const speed = 20;

    function type() {
        if (charIndex < text.length) {
            codeBlock.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, speed);
        } else {
            codeBlock.innerHTML = originalHTML;
        }
    }

    setTimeout(type, 800);
})();

// ===========================
// Keep Spline Background Animating
// ===========================
(function keepSplineAlive() {
    const splineIframe = document.querySelector('.spline-bg iframe');
    if (!splineIframe) return;

    // Periodically post a message to keep the iframe render loop active
    setInterval(() => {
        try {
            splineIframe.contentWindow.postMessage({ type: 'keepAlive' }, '*');
        } catch (e) {
            // cross-origin, ignore
        }
    }, 2000);

    // Prevent iframe from stealing scroll events
    splineIframe.addEventListener('load', () => {
        splineIframe.style.pointerEvents = 'none';
    });
})();
