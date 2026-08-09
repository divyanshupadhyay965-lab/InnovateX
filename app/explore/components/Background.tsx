"use client";

import { motion } from "framer-motion";

const stars = Array.from({ length: 120 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 61) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.35 + ((i * 17) % 65) / 100,
  duration: 2 + (i % 4),
  delay: (i % 8) * 0.2,
}));

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.12),transparent_55%)]" />

      {/* Stars */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}