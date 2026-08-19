"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type SpaceTransitionProps = {
  isActive?: boolean;
  onComplete?: () => void;
};

export default function SpaceTransition({
  isActive = false,
  onComplete,
}: SpaceTransitionProps) {
  const [stage, setStage] = useState<
    "alert" | "opening" | "tunnel" | "destination" | "final"
  >("alert");

  useEffect(() => {
    if (!isActive) {
      setStage("alert");
      return;
    }

    const timers = [
      setTimeout(() => setStage("opening"), 1300),
      setTimeout(() => setStage("tunnel"), 2900),
      setTimeout(() => setStage("destination"), 5200),
      setTimeout(() => setStage("final"), 6900),
      setTimeout(() => onComplete?.(), 8200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* ========================================================= */}
          {/* RED NUCLEAR AURA                                         */}
          {/* ========================================================= */}

          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            animate={{
              opacity:
                stage === "alert"
                  ? [0.25, 0.65, 0.3, 0.75]
                  : stage === "opening"
                    ? 0.45
                    : 0.08,
            }}
            transition={{
              duration: 0.45,
              repeat: stage === "alert" ? Infinity : 0,
            }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,0,0,0.15), rgba(255,0,0,0.45), transparent 70%)",
              boxShadow: "inset 0 0 180px rgba(255,0,0,0.55)",
            }}
          />

          {/* RED LIGHT FLASH */}

          {stage === "alert" && (
            <motion.div
              className="absolute inset-0 z-30 bg-red-600/10"
              animate={{ opacity: [0, 0.35, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
            />
          )}

          {/* ========================================================= */}
          {/* BUNKER ENVIRONMENT                                       */}
          {/* ========================================================= */}

          <div className="absolute inset-0 bg-[#050505]">

            {/* Rock / bunker darkness */}

            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, #202020 0%, #090909 45%, #000 100%)",
              }}
            />

            {/* Side metal walls */}

            <div className="absolute left-0 top-0 h-full w-[12%] bg-gradient-to-r from-black via-[#171717] to-[#050505]" />

            <div className="absolute right-0 top-0 h-full w-[12%] bg-gradient-to-l from-black via-[#171717] to-[#050505]" />

            {/* ===================================================== */}
            {/* GATE                                                   */}
            {/* ===================================================== */}

            <AnimatePresence>
              {(stage === "alert" || stage === "opening") && (
                <motion.div
                  className="absolute left-1/2 top-1/2 z-40 w-[94%] max-w-[1250px] -translate-x-1/2 -translate-y-1/2"
                  initial={{ y: 0 }}
                  animate={{
                    y: stage === "opening" ? "-115%" : 0,
                  }}
                  transition={{
                    duration: 1.45,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  {/* Gate frame */}

                  <div className="relative overflow-hidden border-[10px] border-[#242424] bg-[#111] shadow-[0_0_100px_rgba(255,0,0,0.4)]">

                    {/* Outer frame */}

                    <div className="absolute inset-0 border-4 border-[#3d3d3d]" />

                    {/* Top industrial beam */}

                    <div className="absolute left-0 right-0 top-0 h-10 bg-gradient-to-b from-[#454545] via-[#1c1c1c] to-[#080808]" />

                    {/* Gate */}

                    <div
                      className="relative h-[62vh] min-h-[420px]"
                      style={{
                        background:
                          "linear-gradient(90deg, #151515 0%, #343434 8%, #171717 18%, #303030 50%, #171717 82%, #343434 92%, #151515 100%)",
                      }}
                    >

                      {/* Vertical panels */}

                      {[0, 1, 2, 3, 4, 5].map((panel) => (
                        <div
                          key={panel}
                          className="absolute bottom-0 top-0 w-px bg-[#555]/60"
                          style={{
                            left: `${(panel + 1) * 14.28}%`,
                          }}
                        />
                      ))}

                      {/* Horizontal reinforcement */}

                      <div className="absolute left-0 right-0 top-[28%] h-5 bg-[#101010] shadow-inner" />

                      <div className="absolute bottom-[22%] left-0 right-0 h-6 bg-[#0b0b0b]" />

                      {/* Center warning */}

                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">

                        <p className="text-sm font-bold tracking-[0.6em] text-gray-400">
                          INNOVATEX
                        </p>

                        <h1 className="mt-3 text-5xl font-black tracking-[0.15em] text-gray-200 md:text-8xl">
                          GATE 07
                        </h1>

                        <motion.p
                          className="mt-5 font-mono text-sm font-bold tracking-[0.35em] text-red-500 md:text-base"
                          animate={{
                            opacity: [0.35, 1, 0.35],
                          }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                          }}
                        >
                          ⚠ ACCESS RESTRICTED ⚠
                        </motion.p>
                      </div>

                      {/* Hazard stripe */}

                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[repeating-linear-gradient(135deg,#171717_0px,#171717_22px,#c17a16_22px,#c17a16_42px)]" />

                    </div>

                    {/* Red warning lights */}

                    <WarningLight className="left-8 top-16" />

                    <WarningLight className="right-8 top-16" />

                    <WarningLight className="left-8 bottom-16" />

                    <WarningLight className="right-8 bottom-16" />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===================================================== */}
            {/* TUNNEL                                                  */}
            {/* ===================================================== */}

            {(stage === "tunnel" ||
              stage === "destination" ||
              stage === "final") && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: stage === "tunnel" ? 1 : 0.65,
                  scale: stage === "tunnel" ? 1 : 1.2,
                }}
                transition={{ duration: 1 }}
              >
                {/* Tunnel */}

                <div
                  className="absolute inset-0"
                  style={{
                    perspective: "700px",
                    background:
                      "radial-gradient(ellipse at center, #111 0%, #050505 55%, #000 100%)",
                  }}
                >

                  {/* Tunnel walls */}

                  <motion.div
                    className="absolute inset-[-40%]"
                    animate={{
                      scale:
                        stage === "tunnel"
                          ? [1, 2.2]
                          : stage === "destination"
                            ? 2.4
                            : 1.3,
                    }}
                    transition={{
                      duration: 2.4,
                      ease: "easeIn",
                    }}
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, transparent 0px, transparent 90px, rgba(255,0,0,0.15) 95px, transparent 105px), repeating-linear-gradient(0deg, transparent 0px, transparent 100px, rgba(120,120,120,0.12) 105px, transparent 112px)",
                    }}
                  />

                  {/* Tunnel center */}

                  <div className="absolute left-1/2 top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)]" />

                  {/* Speed lines */}

                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2 h-[2px] origin-left bg-red-500/60"
                      style={{
                        width: `${120 + i * 35}px`,
                        transform: `rotate(${i * 20}deg)`,
                      }}
                      animate={{
                        scaleX: [0.2, 4],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 0.7 + i * 0.025,
                        repeat: Infinity,
                        delay: i * 0.035,
                      }}
                    />
                  ))}

                  {/* Tunnel lights */}

                  <div className="absolute inset-x-0 top-[25%] h-1 bg-red-600/50 shadow-[0_0_25px_rgba(255,0,0,0.8)]" />

                  <div className="absolute inset-x-0 bottom-[25%] h-1 bg-red-600/50 shadow-[0_0_25px_rgba(255,0,0,0.8)]" />

                </div>
              </motion.div>
            )}

            {/* ===================================================== */}
            {/* DESTINATION REACHED                                    */}
            {/* ===================================================== */}

            {stage === "destination" && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="border border-red-500/50 bg-black/70 px-10 py-8 text-center shadow-[0_0_80px_rgba(255,0,0,0.3)] backdrop-blur-xl md:px-20">

                  <motion.p
                    className="font-mono text-xs tracking-[0.5em] text-red-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    ARRIVAL CONFIRMED
                  </motion.p>

                  <h2 className="mt-4 text-4xl font-black tracking-[0.08em] text-white md:text-7xl">
                    DESTINATION
                    <br />
                    <span className="text-red-500">REACHED</span>
                  </h2>

                </div>
              </motion.div>
            )}

            {/* ===================================================== */}
            {/* FINAL GATE                                              */}
            {/* ===================================================== */}

            {stage === "final" && (
              <motion.div
                className="absolute inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >

                {/* Destination room */}

                <div className="absolute inset-0 bg-[#06121a]">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.18),transparent_55%)]" />

                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/50 shadow-[0_0_80px_rgba(0,200,255,0.3)]" />

                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/80 bg-cyan-400/10 shadow-[0_0_50px_rgba(0,200,255,0.7)]" />

                </div>

                {/* Final bunker gate */}

                <motion.div
                  className="absolute left-0 right-0 top-0 z-20 h-[58%] border-b-8 border-[#343434] bg-gradient-to-b from-[#303030] via-[#151515] to-[#080808]"
                  initial={{ y: 0 }}
                  animate={{ y: "-105%" }}
                  transition={{
                    duration: 1.4,
                    delay: 0.4,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-[repeating-linear-gradient(135deg,#171717_0px,#171717_22px,#c17a16_22px,#c17a16_42px)]" />
                </motion.div>

                {/* Destination label */}

                <motion.div
                  className="absolute inset-0 z-10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="text-center">

                    <p className="font-mono text-sm tracking-[0.5em] text-cyan-400">
                      ACCESS GRANTED
                    </p>

                    <h2 className="mt-4 text-5xl font-black text-white md:text-8xl">
                      EXPLORE
                      <span className="text-cyan-400"> UNIVERSE</span>
                    </h2>

                  </div>
                </motion.div>

              </motion.div>
            )}
          </div>

          {/* ========================================================= */}
          {/* HUD                                                       */}
          {/* ========================================================= */}

          <div className="pointer-events-none absolute left-6 top-6 z-[100] font-mono text-xs tracking-[0.3em] text-white/60">
            INNOVATEX // TRANSIT SYSTEM
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-[100] font-mono text-xs text-red-500/70">
            {stage === "alert" && "⚠ BUNKER SYSTEM ARMED"}
            {stage === "opening" && "GATE OPENING"}
            {stage === "tunnel" && "HIGH-SPEED TRANSIT"}
            {stage === "destination" && "ARRIVAL CONFIRMED"}
            {stage === "final" && "ACCESS GRANTED"}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WarningLight({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute h-5 w-5 rounded-full bg-red-500 ${className}`}
      animate={{
        opacity: [0.3, 1, 0.3],
        boxShadow: [
          "0 0 5px rgba(255,0,0,0.4)",
          "0 0 30px rgba(255,0,0,1)",
          "0 0 5px rgba(255,0,0,0.4)",
        ],
      }}
      transition={{
        duration: 0.7,
        repeat: Infinity,
      }}
    />
  );
}