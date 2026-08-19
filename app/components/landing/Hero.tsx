"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const [warping, setWarping] = useState(false);

  function enterExplore() {
    setWarping(true);

    setTimeout(() => {
      router.push("/explore");
    }, 8200);
  }

  const stars = [...Array(80)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }));

  const particles = [...Array(35)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    duration: Math.random() * 12 + 8,
  }));

  const shootingStars = [...Array(8)].map((_, i) => ({
    id: i,
    top: Math.random() * 45,
    delay: i * 2.8,
  }));

  return (
    <section
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-[#020617]
      text-white
      flex
      items-center
      justify-center
      "
    >
      {/* ====================================================== */}
      {/* EXISTING BACKGROUND                                    */}
      {/* ====================================================== */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-b
        from-[#020617]
        via-[#081326]
        to-black
        "
      />

      {/* Aurora */}

      <motion.div
        className="
        absolute
        -top-40
        left-1/2
        -translate-x-1/2
        w-[900px]
        h-[900px]
        rounded-full
        blur-[180px]
        bg-cyan-500/15
        "
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="
        absolute
        bottom-[-300px]
        left-[-200px]
        w-[700px]
        h-[700px]
        rounded-full
        blur-[180px]
        bg-purple-700/20
        "
        animate={{
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* Stars */}

      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              delay: star.delay,
              duration: star.duration * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}

      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="
            absolute
            w-1
            h-1
            rounded-full
            bg-cyan-300
            opacity-60
            "
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              x: [0, particle.x, 0],
              y: [0, particle.y, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              top: `${star.top}%`,
              left: "-20%",
            }}
            animate={{
              x: ["0vw", "140vw"],
              y: ["0vh", "40vh"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatDelay: 8,
              delay: star.delay,
              ease: "easeOut",
            }}
          >
            <div
              className="
              w-36
              h-[2px]
              bg-gradient-to-r
              from-white
              via-cyan-300
              to-transparent
              rotate-[25deg]
              "
            />
          </motion.div>
        ))}
      </div>

      {/* Existing Purple Glow */}

      <motion.div
        className="
        absolute
        w-[500px]
        h-[500px]
        bg-purple-600
        rounded-full
        blur-[150px]
        opacity-40
        "
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      {/* Planet Atmosphere */}

      <motion.div
        className="
        absolute
        bottom-[-180px]
        right-[-180px]
        w-[560px]
        h-[560px]
        rounded-full
        bg-cyan-400/10
        blur-2xl
        "
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      {/* Main Planet */}

      <motion.div
        className="
        absolute
        bottom-[-120px]
        right-[-120px]
        w-[400px]
        h-[400px]
        rounded-full
        overflow-hidden
        shadow-[0_0_120px_rgba(59,130,246,0.45)]
        "
        animate={{
          rotate: 360,
          y: [0, -12, 0],
        }}
        transition={{
          rotate: {
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div
          className="
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-300
          via-blue-600
          to-purple-900
          "
        />

        <div
          className="
          absolute
          inset-0
          opacity-30
          bg-[radial-gradient(circle_at_30%_30%,white,transparent_30%),radial-gradient(circle_at_70%_60%,#22d3ee,transparent_25%),radial-gradient(circle_at_50%_80%,#ffffff,transparent_20%)]
          "
        />

        <motion.div
          className="
          absolute
          -left-24
          top-0
          w-40
          h-full
          bg-white/20
          blur-xl
          "
          animate={{
            x: [-100, 500],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Small Floating Planet */}

      <motion.div
        className="
        absolute
        top-24
        right-32
        w-20
        h-20
        rounded-full
        bg-gradient-to-br
        from-pink-400
        to-purple-700
        shadow-[0_0_40px_rgba(192,132,252,.5)]
        "
        animate={{
          y: [0, -20, 0],
          rotate: 360,
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      {/* ====================================================== */}
      {/* CONTENT                                                */}
      {/* ====================================================== */}

      <div
        className="
        relative
        z-20
        text-center
        px-6
        max-w-5xl
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span
            className="
            inline-flex
            items-center
            gap-2
            px-5
            py-2
            rounded-full
            border
            border-cyan-400/30
            bg-cyan-400/10
            backdrop-blur-xl
            text-cyan-300
            text-sm
            "
          >
            🚀 Welcome to InnovateX
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="
          mt-8
          text-6xl
          md:text-8xl
          font-black
          leading-tight
          tracking-tight
          "
        >
          Explore The Future

          <br />

          <span
            className="
            bg-gradient-to-r
            from-cyan-300
            via-blue-400
            via-purple-500
            to-pink-500
            bg-clip-text
            text-transparent
            "
          >
            Beyond Imagination
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="
          mt-8
          text-gray-300
          text-lg
          md:text-xl
          max-w-3xl
          mx-auto
          leading-8
          "
        >
          InnovateX is where ambitious students discover cutting-edge
          technology, explore STEM careers, build groundbreaking projects,
          and shape tomorrow through innovation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="
          mt-12
          flex
          flex-wrap
          justify-center
          gap-6
          "
        >
          <motion.button
            onClick={enterExplore}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 45px rgba(34,211,238,.6)",
            }}
            whileTap={{ scale: 0.95 }}
            className="
            px-10
            py-4
            rounded-full
            font-bold
            text-lg
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-purple-600
            "
          >
            Explore Universe 🚀
          </motion.button>

          <motion.button
            onClick={() => router.push("/sign-in")}
            whileHover={{
              scale: 1.05,
              borderColor: "#22d3ee",
            }}
            className="
            px-10
            py-4
            rounded-full
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            font-semibold
            "
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>

      {/* ====================================================== */}
      {/* SCROLL INDICATOR                                       */}
      {/* ====================================================== */}

      <motion.div
        className="
        absolute
        bottom-10
        left-1/2
        -translate-x-1/2
        z-20
        "
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      >
        <div
          className="
          w-7
          h-12
          rounded-full
          border-2
          border-white/40
          flex
          justify-center
          "
        >
          <motion.div
            className="
            w-2
            h-2
            mt-2
            rounded-full
            bg-cyan-400
            "
            animate={{
              y: [0, 18, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
          />
        </div>
      </motion.div>
{/* ================= SMOOTH HYPERSPACE WARP ================= */}

<AnimatePresence>
  {warping && (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Deep space glow */}

      <motion.div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/20
          blur-[150px]
        "
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{
          scale: [0.3, 1, 3],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Purple glow */}

      <motion.div
        className="
          absolute
          left-1/2
          top-1/2
          h-[400px]
          w-[400px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-600/20
          blur-[140px]
        "
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{
          scale: [0.2, 1.2, 4],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 1.8,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Smooth zooming stars */}

      <div className="absolute inset-0">
        {[...Array(160)].map((_, i) => {
          const angle = Math.random() * 360;
          const length = Math.random() * 180 + 60;
          const delay = Math.random() * 0.7;

          return (
            <motion.div
              key={i}
              className="
                absolute
                left-1/2
                top-1/2
                origin-left
                rounded-full
                bg-gradient-to-r
                from-white
                via-cyan-200
                to-transparent
              "
              style={{
                width: `${length}px`,
                height: `${Math.random() * 2 + 1}px`,
                rotate: `${angle}deg`,
              }}
              initial={{
                x: 0,
                scaleX: 0,
                opacity: 0,
              }}
              animate={{
                x: [0, 100, 1400],
                scaleX: [0, 0.5, 3],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 1.5 + Math.random() * 0.4,
                delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </div>

      {/* Expanding energy rings */}

      {[0, 0.18, 0.36].map((delay) => (
        <motion.div
          key={delay}
          className="
            absolute
            left-1/2
            top-1/2
            h-24
            w-24
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-cyan-300/70
          "
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 8, 25],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 1.7,
            delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Destination text */}

      <motion.div
        className="
          absolute
          inset-0
          z-10
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.8, 0.8, 1, 1.05, 1.1],
        }}
        transition={{
          duration: 1.8,
          delay: 0.3,
          times: [0, 0.35, 0.55, 0.8, 1],
        }}
      >
        <p className="text-xs font-bold tracking-[0.7em] text-cyan-300 md:text-sm">
          INNOVATEX NAVIGATION SYSTEM
        </p>

        <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-7xl">
          DESTINATION
        </h2>

        <motion.p
          className="mt-3 text-xl font-bold tracking-[0.45em] text-cyan-400 md:text-3xl"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
        >
          REACHED
        </motion.p>
      </motion.div>

      {/* Final flash */}

      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0, 0.8, 0],
        }}
        transition={{
          duration: 0.45,
          delay: 1.55,
        }}
      />
    </motion.div>
  )}
</AnimatePresence>
</section>
  );
} 
