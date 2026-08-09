"use client";

import { motion } from "framer-motion";

import Background from "./components/Background";
import Navbar from "./components/Navbar";
import ExploreUniverse from "./components/ExploreUniverse";


export default function ExplorePage() {

  return (

    <main
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-[#020617]
      text-white
      "
    >


      {/* Space Background */}

      <Background />



      {/* Navbar */}

      <Navbar />





      {/* Main Content */}

      <motion.div

        initial={{
          opacity:0,
          y:50,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        transition={{
          duration:1,
        }}

        className="
        relative
        z-10
        pt-28
        "

      >




        {/* Explore Intro */}

        <section

          className="
          flex
          min-h-[55vh]
          items-center
          justify-center
          px-6
          text-center
          "

        >

          <div>


            <motion.h1

              initial={{
                opacity:0,
                scale:0.8,
              }}

              animate={{
                opacity:1,
                scale:1,
              }}

              transition={{
                duration:1,
              }}

              className="
              text-5xl
              md:text-8xl
              font-black
              "

            >

              Welcome To The

              <br/>


              <span

                className="
                bg-gradient-to-r
                from-cyan-300
                via-blue-500
                to-purple-600
                bg-clip-text
                text-transparent
                "

              >

                InnovateX Universe 🌌

              </span>


            </motion.h1>




            <p

              className="
              mt-8
              mx-auto
              max-w-3xl
              text-lg
              text-gray-300
              "

            >

              Discover futuristic careers, solve global challenges,
              and get guidance from artificial intelligence.

            </p>


          </div>


        </section>






        {/* Everything Together */}

        <ExploreUniverse />






        <div className="h-32" />



      </motion.div>



    </main>

  );

}