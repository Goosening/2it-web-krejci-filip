// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
const heroTimeline = gsap.timeline();

heroTimeline.to('.hero-title', {
    duration: 1.5,
    opacity: 1,
    y: 0,
    ease: "power4.out"
})
.to('.hero-subtitle', {
    duration: 1,
    opacity: 1,
    y: 0,
    ease: "power3.out"
}, "-=1")
.from('.hero-img', {
    duration: 2,
    scale: 1.1,
    opacity: 0,
    ease: "power2.out"
}, "-=1.5");

// Parallax Hero Effect
gsap.to('.hero-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    yPercent: 30,
    ease: "none"
});

// About Section Animations
gsap.from('.about-section .text-block', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
});

gsap.from('.spin-seal', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        scrub: 1
    },
    rotation: 360,
    duration: 1
});

// Timeline Animations
const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach((item, index) => {
    // Determine direction based on class (simple check)
    const direction = item.classList.contains('left') ? -50 : 50;
    
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: "play none none reverse"
        },
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// Legacy Cards Animation
gsap.from('.card', {
    scrollTrigger: {
        trigger: '.legacy-section',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // Stagger effect for cards
    ease: "back.out(1.7)"
});

console.log("Napoleon Web initialized. Vive l'Empereur!");
