# 🌌 Platform Pause Screen

<p align="center">
  <img src="https://img.shields.io/badge/Branding-Synaptix%20Technologies-c8bfa8?style=for-the-badge&logoWidth=40" alt="Branding: Synaptix Technologies">
  <img src="https://img.shields.io/badge/Built%20By-Gurnoor%20Singh-c8bfa8?style=for-the-badge&logoWidth=40" alt="Built By: Gurnoor Singh">
  <img src="https://img.shields.io/badge/Aesthetic-Cinematic%20Dark-131316?style=for-the-badge" alt="Aesthetic: Cinematic Dark">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-6ee7b7?style=for-the-badge" alt="Status: Production Ready">
</p>

---

<p align="center">
  <strong>"A custom-built, immersive pause screen for our learning platform. Developed for internal use to display elegant ambient animations and system status updates during session breaks. Product by Synaptix Technologies, built by Gurnoor Singh."</strong>
</p>

---

This repository houses **two distinct versions** of the platform pause screen, built to adapt to different scenarios—ranging from premium, high-fidelity immersive learning sessions to quick, lightweight emergencies.

---

## 🎭 Dual-Core Configurations

You can deploy either of the two templates depending on your platform status and needs:

```carousel
### 💎 Premium Cinematic Edition (`index.html`)

A high-fidelity, deeply atmospheric interface built for planned downtimes and active class pauses.

*   **Custom Particle Canvas:** Interactive canvas running at a fluid 60fps, rendering ambient floating node particles and drifting radial glow orbs.
*   **IntersectionObserver Transitions:** Precise staggered scroll-reveals mapped to a custom cubic easing matrix.
*   **Interpolated Cursor Glow:** Organic, fluid cursor follow trail using linear interpolation (LERP) physics to avoid layout dragging.
*   **Zero Dependencies:** Crafted purely in vanilla HTML5, CSS3 Custom Properties, and ES6+ JavaScript.

<!-- slide -->

### ⚡ Lightweight Static Edition (`simple.html`)

A single-file Tailwind CSS interface engineered for emergencies, maintenance breaks, or instant server-offline status.

*   **Atomic CSS Utility:** Built on Tailwind CSS and configured with custom keyframe animations.
*   **Animated Ambient Blobs:** Moving, blurred background gradients using absolute mix-blending filters.
*   **Feather Icon Integration:** Dynamic, lightweight SVG rendering via the Feather Icon API.
*   **Interactive Breath Tool:** Includes an organic visual feedback button that triggers floating bubble micro-particles on click.
```

---

## 🛠️ Architecture & Under the Hood

### 1. 🌌 LERP-Enhanced Cursor Physics (`script.js`)
To prevent input lag and provide a tactile, organic weight to interactive elements, cursor calculations use linear interpolation:
```javascript
function lerp(a, b, t) { 
  return a + (b - a) * t; 
}
cx = lerp(cx, mx, 0.1); // 10% smoothing factor
cy = lerp(cy, my, 0.1);
```

### 2. 🎈 Floating Particle Burst Simulation (`simple.html`)
The emergency layout provides an interactive mental reset tool, dynamically instantiating absolute-positioned elements, styling them with dynamic hex color choices, and animating their trajectories with custom CSS keyframes before cleanup:
```javascript
particle.animate([
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
    { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
], {
    duration: 1000 + Math.random() * 1000,
    easing: 'cubic-bezier(0, .9, .57, 1)'
});
```

---

## 📂 Codebase Map

```text
├── index.html       # 💎 Premium Cinematic Edition (Primary entry point)
├── style.css        # Premium typography variables, custom layouts & ease transitions
├── script.js        # Cinematic Canvas loop, reveal matrix & cursor glow tracker
├── simple.html      # ⚡ Lightweight Static Edition (Tailwind CSS, Single-file deployment)
├── LICENSE          # Official MIT License file
└── README.md        # This master documentation file
```

---

## 🚀 Setup & Deployment

Both editions are static and require no compilation, server setups, or build layers. You can run them using any static web server:

### Option A: Serve locally using Python
```bash
python -m http.server 8000
```
*   To view the Cinematic version, go to: `http://localhost:8000/index.html`
*   To view the Emergency version, go to: `http://localhost:8000/simple.html`

### Option B: Serve locally using Node.js
```bash
npx serve .
```

---

## 💎 Production Credits & Licensing

*   **Corporate Branding:** [Synaptix Technologies](https://github.com/synaptix-technologies)
*   **Engineering Lead:** [Gurnoor Singh](https://gurnoorsingh.in)
*   **Licensing:** Open-source licensed under the [MIT License](LICENSE).
