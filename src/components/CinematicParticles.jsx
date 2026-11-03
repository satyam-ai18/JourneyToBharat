import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Cinematic Floating Particles & Sacred Ambient Glow
 * Lightweight, hardware-accelerated background motion for hero and luxury banners.
 */
export default function CinematicParticles({
  count = 20,
  showMandala = true,
  className = ""
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 3 + 2, // 2px - 5px
      duration: Math.random() * 12 + 10, // 10s - 22s
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.25
    }));
  }, [count]);

  return (
    <div
      className={`ty-cinematic-particles-layer ${className}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1
      }}
    >
      {/* Ambient Radial Golden Glow Orbs */}
      <div
        className="ty-ambient-glow-orb orb-primary"
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0) 70%)",
          filter: "blur(60px)",
          borderRadius: "50%",
          animation: "tyAmbientFloat 16s ease-in-out infinite alternate"
        }}
      />
      <div
        className="ty-ambient-glow-orb orb-secondary"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "560px",
          height: "560px",
          background: "radial-gradient(circle, rgba(224, 90, 43, 0.12) 0%, rgba(212, 175, 55, 0) 70%)",
          filter: "blur(70px)",
          borderRadius: "50%",
          animation: "tyAmbientFloat 20s ease-in-out infinite alternate-reverse"
        }}
      />

      {/* Sacred Rotating Mandala Motif in the corner (Ultra-low opacity, elegant depth) */}
      {showMandala && (
        <div
          className="ty-sacred-mandala-bg"
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "500px",
            height: "500px",
            opacity: 0.05,
            animation: "tyMandalaSpin 120s linear infinite"
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" stroke="#d4af37" strokeWidth="0.8">
            <circle cx="100" cy="100" r="90" strokeDasharray="2 3" />
            <circle cx="100" cy="100" r="75" />
            <circle cx="100" cy="100" r="60" strokeDasharray="4 2" />
            <circle cx="100" cy="100" r="45" />
            <circle cx="100" cy="100" r="30" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 100 + 45 * Math.cos(angle);
              const y1 = 100 + 45 * Math.sin(angle);
              const x2 = 100 + 90 * Math.cos(angle);
              const y2 = 100 + 90 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            {Array.from({ length: 8 }).map((_, i) => {
              const rot = i * 45;
              return (
                <polygon
                  key={i}
                  points="100,25 110,65 100,75 90,65"
                  transform={`rotate(${rot} 100 100)`}
                  stroke="#d4af37"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Floating Starlight / Divine Dust Particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="ty-floating-sparkle"
          initial={{
            opacity: 0,
            scale: 0.5,
            x: `${p.x}vw`,
            y: `${p.y}vh`
          }}
          animate={{
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.2],
            scale: [0.8, 1.25, 0.8],
            y: [`${p.y}vh`, `${(p.y - 12 + 100) % 100}vh`, `${(p.y - 24 + 100) % 100}vh`],
            x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 1.5 : -1.5)}vw`, `${p.x}vw`]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: p.id % 3 === 0 ? "#fff3cf" : "#d4af37",
            boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(212, 175, 55, 0.45)`,
            willChange: "transform, opacity"
          }}
        />
      ))}
    </div>
  );
}

