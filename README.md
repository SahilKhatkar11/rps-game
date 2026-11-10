# 🎮 Rock Paper Scissors Engine

[![Deploy to GitHub Pages](https://github.com/SahilKhatkar11/rps-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/SahilKhatkar11/rps-game/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

> An adaptive Rock Paper Scissors web game powered by client-side Python algorithmic strategies, real-time statistics tracking, synthesized retro audio effects, and an iOS-style liquid glass interface.

---

## ✨ Features

- 🧠 **Adaptive AI Strategies**:
  - **Markov Chain**: 2nd-order transition matrix tracking human pattern recognition and predictive countering.
  - **Win-Stay Lose-Shift**: Behavioral game theory strategy modeling real-world psychology.
  - **Frequency Counter**: Tracks human choice frequency bias and exploits overused moves.
  - **Nash Equilibrium (Pure Random)**: Cryptographically uniform randomization.
- 🔬 **Live Algorithm Logic Panel**: View real-time Python decision traces, transition matrices, and algorithm explanations right inside the game.
- 🪟 **iOS Liquid Glass Interface**: Translucent frosted glass containers with multi-tier backdrop blur, specular light rims, and smooth micro-interactions.
- 📱 **Zero-Scroll Single-Page Design**: Viewport-adaptive layout engineered to fit seamlessly on any display size (mobile, tablet, desktop) without page scrolling.
- 🔊 **Built-in Web Audio Synthesizer**: Sound effects (countdown ticks, selections, victory fanfares, and tie beeps) synthesized in real time via the Web Audio API—no external audio files required.
- 📊 **Match & Series Tracking**: Customizable series goals (First to 3, 5, 10, or Endless), win streaks, match champion cards, and clearable history logs.
- 🚀 **GitHub Pages Static Ready**: Pre-configured with relative asset paths (`base: './'`) and automated GitHub Actions workflow to prevent white-screen 404 errors.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern component-driven UI architecture |
| **TypeScript** | Type-safe state, configuration, and algorithm models |
| **Vite 6** | Ultra-fast build tool and development server |
| **Tailwind CSS 4** | Utility-first styling with custom glassmorphism and animations |
| **Web Audio API** | Real-time procedural sound synthesis |
| **Canvas Confetti** | Dynamic celebratory particle effects |
| **Lucide React** | Minimalist UI iconography |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SahilKhatkar11/rps-game.git
   cd rps-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port displayed in your terminal) in your browser.

---

## 📦 Building for Production

Compile the project into a static web bundle:

```bash
npm run build
```

This compiles optimized static assets into the `dist/` directory and creates `dist/404.html` to support direct SPA routing on static hosts.

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. On GitHub, navigate to your repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every time you push to the `main` or `master` branch, GitHub Actions will automatically build and publish your game.

### Method 2: Manual CLI Deployment

You can deploy directly to the `gh-pages` branch using the included script:

```bash
npm run deploy
```

---

## 🛡️ White-Screen Prevention on GitHub Pages

When deploying single-page applications to GitHub Pages, a blank white screen commonly occurs due to incorrect asset paths. This repository prevents this using:

1. **Relative Base Path (`base: './'`)**: Configured in `vite.config.ts` so scripts and stylesheets resolve relative to the repository sub-path (`./assets/...`) rather than domain root (`/assets/...`).
2. **Dark Theme Inline Styling**: `index.html` includes inline `#0b1120` background color so no white flash occurs during initial bundle hydration.
3. **Automated `404.html` Generation**: Copies `index.html` to `404.html` at build time so sub-paths and direct reloads never trigger GitHub Pages 404 error screens.
4. **Resilient GitHub Actions Workflow**: The workflow installs dependencies reliably even if `package-lock.json` is missing or being regenerated.

---

## 👨‍💻 Author

Crafted with Passion by **[Sahil Khatkar](https://github.com/SahilKhatkar11)**

---

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).
