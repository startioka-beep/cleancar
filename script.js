
// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => { span.style.transform = 'none'; span.style.opacity = '1'; });
        });
    });
}

// ====================================
// Package Cards - Auto-detect Center/Featured Card
// ====================================
(function() {
    const packageCards = document.querySelectorAll('.package-card');
    
    if (packageCards.length >= 3) {
        const centerCard = packageCards[1]; // البطاقة الوسطى (index 1)
        centerCard.classList.add('card--featured');
    }
})();

// ====================================
// Optional: 3D Tilt Effect with Mouse Follow
// ====================================
(function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip on mobile or if reduced motion is preferred
    if (prefersReducedMotion || window.innerWidth < 768) {
        return;
    }
    
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            card.style.transition = 'transform 100ms ease-out';
        });
        
        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = card.getBoundingClientRect();
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            
            // Calculate mouse position relative to card center
            const mouseX = e.clientX - rect.left - cardWidth / 2;
            const mouseY = e.clientY - rect.top - cardHeight / 2;
            
            // Calculate rotation (max ±5 degrees for subtle effect)
            const rotateY = (mouseX / cardWidth) * 5;
            const rotateX = -(mouseY / cardHeight) * 5;
            
            // Apply 3D transform with perspective
            card.style.transform = `
                translateY(-6px) 
                scale(1.04) 
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            card.style.transition = 'transform 280ms cubic-bezier(0.22, 0.9, 0.1, 1)';
            card.style.transform = '';
        });
    });
})();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }
    });
});

// Stats Counter Animation
const observerOptions = { threshold: 0.5, rootMargin: '0px' };

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    if (stat.hasAttribute('data-target')) {
        statsObserver.observe(stat);
    }
});

// Card Stagger Animation
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .package-card, .review-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// ====================================
// Premium Intro Animation - Clean Car
// Duration: 2.5s total | Plays once per session
// Timeline:
// 0.0s - 0.6s: Golden sweep line expands
// 0.3s - 0.8s: Text "CLEAN CAR" reveals
// 0.8s - 1.6s: Metallic shine effect
// 1.6s - 2.1s: Move to navbar position
// 2.1s - 2.5s: Fade out overlay
// ====================================
(function() {
    // Check if user has already seen intro in this session
    const hasSeenIntro = sessionStorage.getItem('cleanCarIntroSeen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip intro if already seen this session or user prefers reduced motion
    if (hasSeenIntro || prefersReducedMotion) {
        const introOverlay = document.getElementById('introOverlay');
        if (introOverlay) {
            introOverlay.classList.add('complete');
        }
        document.body.classList.remove('intro-active');
        return;
    }
    
    // Add intro-active class to body
    document.body.classList.add('intro-active');
    
    // Get elements
    const introOverlay = document.getElementById('introOverlay');
    const introSweep = document.getElementById('introSweep');
    const introText = document.getElementById('introText');
    
    if (!introOverlay || !introSweep || !introText) {
        document.body.classList.remove('intro-active');
        return;
    }
    
    // Animation sequence with precise timing
    const runAnimation = async () => {
        // Step 1: Start sweep line expansion (0s - 0.6s)
        await wait(50);
        introSweep.classList.add('animate');
        
        // Step 2: Reveal text (0.3s)
        await wait(250);
        introText.classList.add('reveal');
        
        // Step 3: Add shine effect (0.8s)
        await wait(500);
        introText.classList.remove('reveal');
        introText.classList.add('shine');
        
        // Step 4: Move to navbar (1.6s)
        await wait(800);
        introText.classList.remove('shine');
        introText.classList.add('move-to-nav');
        
        // Step 5: Fade out overlay (2.1s)
        await wait(500);
        introOverlay.classList.add('hidden');
        document.body.classList.remove('intro-active');
        
        // Step 6: Remove overlay completely (2.5s)
        await wait(400);
        introOverlay.classList.add('complete');
        
        // Mark intro as seen for this session
        sessionStorage.setItem('cleanCarIntroSeen', 'true');
    };
    
    // Helper function for delays
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Start animation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAnimation);
    } else {
        runAnimation();
    }
})();

console.log('%c🚗 Clean Car - Premium Detailing ', 'background: #FFD400; color: #111217; font-size: 16px; font-weight: bold; padding: 10px;');
    