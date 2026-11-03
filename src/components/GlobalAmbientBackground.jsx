import React, { useMemo } from "react";

/**
 * Global Living Ambient Background
 * Lightweight, hardware-accelerated animated particles & spiritual aura
 * that flows across the entire website background without impacting performance.
 */
export default function GlobalAmbientBackground() {
  const particles = useMemo(() => {
    // 36 celestial stardust particles with gentle float & sway
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (i * 13 + 5) % 98, // distributed 0% - 98% width
      y: (i * 19 + 7) % 96, // distributed 0% - 96% height
      size: (i % 5) + 2, // 2px to 6px
      duration: 12 + (i % 8) * 3, // 12s to 33s
      delay: (i % 6) * 1.2,
      opacity: 0.22 + ((i % 5) * 0.08),
      color: i % 3 === 0 ? "#ffd978" : i % 3 === 1 ? "#d4af37" : "#ffb049"
    }));
  }, []);

  return (
    <div
      className="ty-global-ambient-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0
      }}
    >
      {/* Slow-Drifting Sacred Golden Aura Orbs */}
      <div
        className="ty-bg-aura-orb ty-aura-top-left"
        style={{
          position: "absolute",
          top: "-12%",
          left: "-8%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(15, 38, 29, 0) 70%)",
          filter: "blur(90px)",
          borderRadius: "50%",
          animation: "tyAmbientFloat 24s ease-in-out infinite alternate",
          willChange: "transform, opacity"
        }}
      />
      <div
        className="ty-bg-aura-orb ty-aura-bottom-right"
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(224, 110, 43, 0.09) 0%, rgba(212, 175, 55, 0) 70%)",
          filter: "blur(100px)",
          borderRadius: "50%",
          animation: "tyAmbientFloat 28s ease-in-out infinite alternate-reverse",
          willChange: "transform, opacity"
        }}
      />
      <div
        className="ty-bg-aura-orb ty-aura-center"
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "750px",
          height: "750px",
          background: "radial-gradient(circle, rgba(5, 150, 105, 0.06) 0%, rgba(9, 23, 18, 0) 70%)",
          filter: "blur(110px)",
          borderRadius: "50%",
          animation: "tyAmbientFloat 34s ease-in-out infinite alternate",
          willChange: "transform, opacity"
        }}
      />
      <div
        className="ty-bg-aura-orb ty-aura-top-right"
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, rgba(7, 20, 15, 0) 70%)",
          filter: "blur(85px)",
          borderRadius: "50%",
          animation: "tyAmbientFloat 30s ease-in-out infinite alternate-reverse",
          willChange: "transform, opacity"
        }}
      />

      {/* Rotating Sacred Mandala Watermark (Deep Cosmic Layer) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "900px",
          height: "900px",
          transform: "translate(-50%, -50%)",
          backgroundImage: "radial-gradient(circle, rgba(212, 175, 55, 0.035) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.7,
          borderRadius: "50%",
          animation: "tyMandalaSpin 180s linear infinite",
          pointerEvents: "none"
        }}
      />

      {/* Living Celestial Stardust Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="ty-global-bg-particle"
          style={{
            position: "absolute",
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(212, 175, 55, ${p.opacity})`,
            opacity: p.opacity,
            animation: `tyParticleFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            willChange: "transform, opacity"
          }}
        />
      ))}
    </div>
  );
}
