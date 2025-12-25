# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
Walkthrough - NES BEYOND
A premium, browser-based NES emulator with a modern retro-cyber aesthetic.

GitHub Repository: retro-EMU

Features Accomplished
Core Emulation: Powered by jsnes for accurate NES hardware simulation.
Premium UI: Sleek dark mode with glassmorphism and vibrant gradients.
CRT Effect: Custom CSS-based scanlines and screen curvature for an authentic retro feel.
Audio Support: Integrated Web Audio API for real-time sound output.
Frame Rate Synchronization: Prevents "fast-forwarding" on high-refresh-rate monitors by capping play speed at 60 FPS.
Save/Load States: Save your progress to localStorage and resume play anytime.
Speed Controls: Control play speed with Slow-Motion (0.5x) and Fast-Forward (2x, 3x) modes.
Dynamic ROM Loading: Drag-and-drop or file select support for .nes files.
Responsive Design: Works on various screen sizes with optimized layouts.
Technical Details
Emulator Engine
The engine uses a requestAnimationFrame loop to synchronize with the browser's refresh rate, rendering the NES's 256x240 buffer to a pixelated canvas.

Audio Processor
The audio uses a ScriptProcessorNode (with future-proofing via circular buffering) to stream samples from the jsnes APU to your speakers.

Controls
Key	NES Button
W/A/S/D	D-Pad
J	Button A
K	Button B
ENTER	Start
SHIFT	Select
Visual Style
The design focuses on a "Cyber-Retro" theme, using:

Fonts: 'Orbitron' for headers, 'Press Start 2P' for retro accents.
Colors: Neon Pink (#ff0055) and Cyber Blue (#00d2ff).
Effects: Scanlines, glassmorphism, and subtle text glows.
