import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { CONTACT } from '../../constants';

const { lat, lng } = CONTACT.coordinates;

// Initial rotation so Pakistan sits near the front on load (degrees → radians).
const INITIAL_PHI = (lng * Math.PI) / 180;
// Vertical tilt that brings the showroom's latitude toward the centre.
const INITIAL_THETA = 0.42;

const AUTO_SPEED = 0.0032; // gentle, calming drift per frame
const DAMPING = 0.09; // smoothing for rotation + drag

/**
 * Dotted, draggable globe (cobe) — the modern luxury/startup look.
 * Brand-tinted: dark sphere, reddish landmass dots, and a glowing red
 * marker at the showroom. Auto-rotates, supports drag, and resumes on release.
 */
export default function CobeGlobe() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Rotation state (current + target) for smooth, damped motion.
  const phi = useRef(INITIAL_PHI);
  const theta = useRef(INITIAL_THETA);
  const targetPhi = useRef(INITIAL_PHI);
  const targetTheta = useRef(INITIAL_THETA);

  // Drag tracking.
  const interacting = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, phi: 0, theta: 0 });
  const sizeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Keep the globe a crisp square sized to the smaller container dimension,
    // and size the canvas display box explicitly (avoids layout collapse).
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      const s = Math.max(1, Math.min(width * 0.92, height * 0.92, 480));
      sizeRef.current = s;
      canvas.style.width = `${s}px`;
      canvas.style.height = `${s}px`;
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);

    const globe = createGlobe(canvas, {
      // cobe multiplies by devicePixelRatio internally — pass logical pixels.
      devicePixelRatio: dpr,
      width: sizeRef.current,
      height: sizeRef.current,
      phi: INITIAL_PHI,
      theta: INITIAL_THETA,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 8,
      mapBaseBrightness: 0.04, // keep the "ocean" from going fully black
      baseColor: [0.55, 0.2, 0.24], // muted brand-red sphere
      markerColor: [1, 0.22, 0.28], // Car Japan red marker
      glowColor: [0.42, 0.16, 0.2], // subtle warm halo
      markerElevation: 0, // sit flush on the surface (no floating offset)
      markers: [{ location: [lat, lng], size: 0.04 }],
    });

    // cobe v2 has no internal loop — we drive rotation, damping and resizing
    // ourselves and redraw every frame via globe.update().
    let raf = 0;
    const render = () => {
      // Auto-rotate only while the user isn't dragging.
      if (!interacting.current) {
        targetPhi.current += AUTO_SPEED;
      }
      // Damped easing toward targets for buttery motion.
      phi.current += (targetPhi.current - phi.current) * DAMPING;
      theta.current += (targetTheta.current - theta.current) * DAMPING;

      globe.update({
        phi: phi.current,
        theta: theta.current,
        width: sizeRef.current,
        height: sizeRef.current,
      });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // cobe inserts a relative wrapper div around the canvas — center the
    // canvas inside it so the globe stays in the middle of the section.
    const wrap = canvas.parentElement;
    if (wrap) {
      wrap.style.display = 'grid';
      wrap.style.placeItems = 'center';
    }

    // Cinematic fade-in once the first frames have rendered.
    const fadeTimer = setTimeout(() => setVisible(true), 120);

    // ── Drag interaction ──
    const onPointerDown = (e) => {
      interacting.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        phi: targetPhi.current,
        theta: targetTheta.current,
      };
      canvas.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!interacting.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      targetPhi.current = dragStart.current.phi - dx * 0.005;
      targetTheta.current = Math.max(
        -0.6,
        Math.min(0.9, dragStart.current.theta + dy * 0.005)
      );
    };
    const onPointerUp = () => {
      interacting.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      globe.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 grid place-items-center">
      <canvas
        ref={canvasRef}
        className="cursor-grab touch-none select-none"
        // NOTE: width/height are managed imperatively in `measure()`.
        // Keep them out of this style object so React re-renders (e.g. the
        // fade-in) don't reset the canvas size back to its default.
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.1s ease',
        }}
      />
    </div>
  );
}
