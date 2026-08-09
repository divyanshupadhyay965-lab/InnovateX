"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { careerDatabase } from "../data/careerDatabase";
import { careerImages, categoryImages } from "../data/careerImages";

const categories = [
  "All",
  "Technology",
  "Engineering",
  "Medical",
  "Business",
  "Science",
  "Research",
  "Creative",
  "Government",
  "Space",
];

export default function CareerGalaxy() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [showAll, setShowAll] = useState(false);

 const filteredCareers = useMemo(() => {

  const searchText = search.toLowerCase().trim();

  const results = careerDatabase.filter((career: any) => {

    const matchesSearch =
      career.title?.toLowerCase().includes(searchText) ||

      career.category?.toLowerCase().includes(searchText) ||

      career.skills?.some((skill:string) =>
        skill.toLowerCase().includes(searchText)
      );


    const matchesCategory =
      category === "All" ||
      career.category === category;


    return matchesSearch && matchesCategory;

  });


  // remove duplicate careers
  return Array.from(
    new Map(
      results.map((career:any)=>[
        career.title,
        career
      ])
    ).values()
  );


}, [search, category]); 
  return (
    <section className="relative px-6 py-24">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center text-6xl font-black"
      >
        Career Galaxy 🌌
      </motion.h2>

      <p className="mt-5 text-center text-gray-400">
        Search hundreds of careers and discover your future.
      </p>

      <div className="max-w-4xl mx-auto mt-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search careers..."
          className="w-full rounded-full border border-cyan-400/20 bg-white/10 px-6 py-4 text-white outline-none"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-5 py-2 transition ${
              category === item
                ? "bg-cyan-500 text-white"
                : "bg-white/10 border border-white/20"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-400">
        Showing <span className="text-cyan-400">{filteredCareers.length}</span> careers
      </p>

      <div className="grid gap-8 mt-14 md:grid-cols-2 xl:grid-cols-3"></div>
      {(showAll ? filteredCareers : filteredCareers.slice(0,3)).map((career:any)=>(

  <motion.div

    key={career.id}

    initial={{
      opacity:0,
      y:30
    }}

    whileInView={{
      opacity:1,
      y:0
    }}

    whileHover={{
      scale:1.04,
      y:-8
    }}

    transition={{
      duration:0.3
    }}

    onClick={() => setSelectedCareer(career)}

    className="
    cursor-pointer
    overflow-hidden
    rounded-3xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-xl
    hover:border-cyan-400/40
    "
  >

    {/* IMAGE */}

    <div className="
    relative
    h-56
    overflow-hidden
    ">

      <img
src={
 careerImages[career.title] ||
 career.image ||
 categoryImages[career.category] ||
 `https://source.unsplash.com/800x600/?${encodeURIComponent(career.title)}`
}
        alt={career.title}

        className="
        w-full
        h-full
        object-cover
        "
      />


      <div className="
      absolute
      inset-0
      bg-gradient-to-t
      from-black/80
      to-transparent
      "/>


      <div className="
      absolute
      bottom-5
      left-5
      ">

        <h3 className="
        text-2xl
        font-black
        ">

          {career.title}

        </h3>


        <p className="
        text-cyan-300
        text-sm
        ">

          {career.category}

        </p>


      </div>


    </div>


    {/* DETAILS */}

    <div className="p-6">


      <p className="
      text-gray-400
      text-sm
      line-clamp-3
      ">

        {career.description}

      </p>


      {/* FUTURE SCORE */}

      <div className="mt-6">


        <div className="
        flex
        justify-between
        text-sm
        ">

          <span>
            Future Score
          </span>


          <span className="
          text-cyan-400
          font-bold
          ">

            {career.futureScore}/10

          </span>


        </div>



        <div className="
        mt-2
        h-2
        rounded-full
        bg-white/10
        overflow-hidden
        ">


          <div

            className="
            h-full
            bg-gradient-to-r
            from-cyan-400
            to-purple-600
            "

            style={{
              width:`${career.futureScore * 10}%`
            }}

          />


        </div>


      </div>



      {/* STATS */}

      <div className="
      grid
      grid-cols-2
      gap-4
      mt-6
      ">


        <div className="
        rounded-xl
        bg-black/20
        p-4
        ">

          <p className="
          text-xs
          text-gray-400
          ">
            Demand
          </p>


          <p className="
          font-bold
          mt-1
          ">

            {career.demand}

          </p>


        </div>



        <div className="
        rounded-xl
        bg-black/20
        p-4
        ">

          <p className="
          text-xs
          text-gray-400
          ">

            Difficulty

          </p>


          <p className="
          font-bold
          mt-1
          ">

            {career.difficulty}

          </p>


        </div>


      </div>



      <button

      className="
      mt-6
      w-full
      rounded-full
      bg-gradient-to-r
      from-cyan-500
      to-purple-600
      py-3
      font-bold
      "

      >

        Explore Career →

      </button>


    </div>


  </motion.div>


))}
{filteredCareers.length > 3 && (

<div className="mt-12 text-center">

<button

onClick={()=>setShowAll(!showAll)}

className="
rounded-full
bg-gradient-to-r
from-cyan-500
to-purple-600
px-8
py-3
font-bold
transition
hover:scale-105
"

>

{
showAll
?
"Show Less ↑"
:
"Explore More Careers →"
}

</button>

</div>

)}
{/* ================= MODAL ================= */}

<AnimatePresence>

{selectedCareer && (

<motion.div

initial={{
opacity:0
}}

animate={{
opacity:1
}}

exit={{
opacity:0
}}

onClick={()=>setSelectedCareer(null)}

className="
fixed
inset-0
z-50
bg-black/80
backdrop-blur-sm
flex
items-center
justify-center
p-6
"

>


<motion.div

initial={{
scale:0.85,
opacity:0
}}

animate={{
scale:1,
opacity:1
}}

exit={{
scale:0.85,
opacity:0
}}

onClick={(e)=>e.stopPropagation()}

className="
w-full
max-w-4xl
max-h-[90vh]
overflow-y-auto
rounded-3xl
bg-[#071426]
border
border-cyan-400/20
p-8
"

>


{/* HEADER */}

<div className="
flex
justify-between
items-center
">


<div>

<h2 className="
text-4xl
font-black
">

{selectedCareer.title}

</h2>


<p className="
mt-2
text-cyan-300
">

{selectedCareer.category}

</p>


</div>


<button

onClick={()=>setSelectedCareer(null)}

className="
text-4xl
"

>

×

</button>


</div>



<p className="
mt-8
text-gray-300
leading-7
">

{selectedCareer.description}

</p>



{/* SCORE CARDS */}


<div className="
grid
md:grid-cols-3
gap-5
mt-10
">


<div className="
rounded-2xl
bg-cyan-500/10
p-5
">

<p className="text-gray-400">
Future Score
</p>

<h3 className="
text-3xl
font-black
text-cyan-400
">

{selectedCareer.futureScore}/10

</h3>

</div>



<div className="
rounded-2xl
bg-purple-500/10
p-5
">

<p className="text-gray-400">
Demand
</p>

<h3 className="
text-2xl
font-bold
">

{selectedCareer.demand}

</h3>

</div>



<div className="
rounded-2xl
bg-white/5
p-5
">

<p className="text-gray-400">
Difficulty
</p>

<h3 className="
text-2xl
font-bold
">

{selectedCareer.difficulty}

</h3>

</div>


</div>




{/* SKILLS */}


<h3 className="
mt-12
text-3xl
font-bold
">

Skills Required 🚀

</h3>


<div className="
flex
flex-wrap
gap-3
mt-5
">


{selectedCareer.skills?.map((skill:string)=>(

<span

key={skill}

className="
rounded-full
bg-cyan-500/20
px-5
py-2
"

>

{skill}

</span>


))}


</div>




{/* ROADMAP */}


<h3 className="
mt-12
text-3xl
font-bold
">

Learning Roadmap 🛣️

</h3>


<div className="
mt-5
space-y-4
">


{selectedCareer.roadmap?.map(

(step:string,index:number)=>(


<div

key={step}

className="
rounded-2xl
bg-white/5
border
border-white/10
p-5
"

>


<p className="
font-bold
text-cyan-400
">

Step {index+1}

</p>


<p className="
mt-2
text-gray-300
">

{step}

</p>


</div>


)


)}


</div>
{/* EXTRA INFORMATION */}

<div className="
grid
md:grid-cols-2
gap-6
mt-12
">


<div className="
rounded-2xl
bg-white/5
border
border-white/10
p-6
">

<h3 className="
text-2xl
font-bold
text-cyan-300
">

🌍 Best Countries

</h3>


<p className="
mt-4
text-gray-300
">

USA • Canada • Germany • Japan • Singapore • UK

</p>


</div>



<div className="
rounded-2xl
bg-white/5
border
border-white/10
p-6
">

<h3 className="
text-2xl
font-bold
text-purple-300
">

🏢 Top Companies

</h3>


<p className="
mt-4
text-gray-300
">

Google • Microsoft • NVIDIA • SpaceX • Tesla • Apple

</p>


</div>


</div>



<div className="
mt-8
rounded-3xl
bg-gradient-to-r
from-cyan-500/20
to-purple-500/20
border
border-white/10
p-6
">


<h3 className="
text-2xl
font-bold
">

🎓 Recommended Universities

</h3>


<p className="
mt-4
text-gray-300
">

MIT • Stanford • IIT Bombay • IIT Delhi • Carnegie Mellon

</p>


</div>



</motion.div>

</motion.div>

)}

</AnimatePresence>


</section>

);

}