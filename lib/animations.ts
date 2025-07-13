// Animation utilities for SnapGrade using GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade in animation from bottom
export const fadeInUp = (element: string | Element, options = {}) => {
  const defaults = {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.2,
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    element,
    { opacity: 0, y: settings.y },
    {
      opacity: 1,
      y: 0,
      duration: settings.duration,
      ease: settings.ease,
      stagger: settings.stagger,
    }
  );
};

// Scale in animation
export const scaleIn = (element: string | Element, options = {}) => {
  const defaults = {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "back.out(1.7)",
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    element,
    { scale: settings.scale, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: settings.duration,
      ease: settings.ease,
    }
  );
};

// Slide in from left
export const slideInLeft = (element: string | Element, options = {}) => {
  const defaults = {
    x: -100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    element,
    { x: settings.x, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: settings.duration,
      ease: settings.ease,
    }
  );
};

// Slide in from right
export const slideInRight = (element: string | Element, options = {}) => {
  const defaults = {
    x: 100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    element,
    { x: settings.x, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: settings.duration,
      ease: settings.ease,
    }
  );
};

// Stagger animation for multiple elements
export const staggerAnimation = (
  elements: string | Element[],
  options = {}
) => {
  const defaults = {
    opacity: 0,
    y: 40,
    duration: 0.6,
    stagger: 0.15,
    ease: "power2.out",
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    elements,
    { opacity: 0, y: settings.y },
    {
      opacity: 1,
      y: 0,
      duration: settings.duration,
      stagger: settings.stagger,
      ease: settings.ease,
    }
  );
};

// Scroll-triggered animation
export const scrollAnimation = (element: string | Element, options = {}) => {
  const defaults = {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: "power3.out",
    trigger: element,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    element,
    { opacity: 0, y: settings.y },
    {
      opacity: 1,
      y: 0,
      duration: settings.duration,
      ease: settings.ease,
      scrollTrigger: {
        trigger: settings.trigger,
        start: settings.start,
        end: settings.end,
        toggleActions: settings.toggleActions,
      },
    }
  );
};

// Page transition animation
export const pageTransition = () => {
  const tl = gsap.timeline();

  tl.to(".page-transition", {
    scaleY: 1,
    duration: 0.5,
    ease: "power2.inOut",
    transformOrigin: "bottom",
  }).to(".page-transition", {
    scaleY: 0,
    duration: 0.5,
    ease: "power2.inOut",
    transformOrigin: "top",
    delay: 0.1,
  });

  return tl;
};

// Button hover animation
export const buttonHover = (button: string | Element) => {
  const element =
    typeof button === "string" ? document.querySelector(button) : button;

  if (!element) return;

  element.addEventListener("mouseenter", () => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });
};

// Card hover animation
export const cardHover = (cards: string | Element[]) => {
  const elements =
    typeof cards === "string" ? document.querySelectorAll(cards) : cards;

  elements.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
};

// Loading animation
export const loadingAnimation = (element: string | Element) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: "none",
    repeat: -1,
  });
};

// Success animation
export const successAnimation = (element: string | Element) => {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 1.2,
    duration: 0.2,
    ease: "power2.out",
  }).to(element, {
    scale: 1,
    duration: 0.3,
    ease: "bounce.out",
  });

  return tl;
};

// Error shake animation
export const errorShake = (element: string | Element) => {
  return gsap.to(element, {
    x: "10px",
    duration: 0.1,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 5,
  });
};

// Floating animation for elements
export const floatingAnimation = (element: string | Element, options = {}) => {
  const defaults = {
    y: -10,
    duration: 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1,
  };

  const settings = { ...defaults, ...options };

  return gsap.to(element, {
    y: settings.y,
    duration: settings.duration,
    ease: settings.ease,
    yoyo: settings.yoyo,
    repeat: settings.repeat,
  });
};

// Text reveal animation
export const textReveal = (element: string | Element, options = {}) => {
  const defaults = {
    duration: 1,
    ease: "power2.out",
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(
    element,
    {
      clipPath: "inset(0 100% 0 0)",
    },
    {
      clipPath: "inset(0 0% 0 0)",
      duration: settings.duration,
      ease: settings.ease,
    }
  );
};
