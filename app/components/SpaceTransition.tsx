"use client";

import { motion } from "framer-motion";

export default function SpaceTransition() {

  return (
    <motion.div
      initial={{
        scale:0,
        opacity:0
      }}

      animate={{
        scale:8,
        opacity:1
      }}

      transition={{
        duration:1,
        ease:"easeIn"
      }}

      className="
      fixed
      inset-0
      z-[999]
      pointer-events-none
      bg-white
      rounded-full
      "
    >

      <div className="
      absolute
      inset-0
      bg-gradient-to-r
      from-cyan-400
      via-purple-500
      to-black
      " />

    </motion.div>
  );
}