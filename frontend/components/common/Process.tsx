import Image from "next/image"
import icon1 from "@/public/icons/discovery.png"
import icon2 from "@/public/icons/planning.png"
import icon3 from "@/public/icons/execution.png"
import icon4 from "@/public/icons/launch.png"
import { StaticImageData } from "next/image"

function ProcessItem({ index, name, description, icon }: { index: number; name: string; description: string; icon: StaticImageData }) {
  return (
    <div className="flex flex-col flex-wrap items-center text-center">
      <p className="text-5xl text-slate-200 font-bold mb-3">0{index + 1}</p>
      <div style={{background: 'linear-gradient(to bottom right, #7ac64d 30%, #31de79)'}} className="w-25 h-25 rounded-full flex justify-center items-center p-5">
        <Image src={icon} alt={name} className="w-10 h-10 object-contain brightness-0 invert" />
      </div>
      <p className="font-semibold text-lg tracking-wide my-5">{name}</p>
      <p className="text-gray-500 tracking-wide w-full max-w-sm">{description}</p>
    </div>
  );
}

function Line() {
  return <div style={{background: 'linear-gradient(to bottom right, #31de79 20%, #fff)'}} className="hidden lg:block h-[2px] w-8 lg:w-16 bg-green-400 flex-shrink-0 mt-24" />;
}

export default function Process() {
  const processItems = [
    {
      name: "Apply",
      description: "Submit your startup idea through our application form. Our team reviews every submission and shortlists founders with the most potential.",
    },
    {
      name: "Get Selected",
      description: "Shortlisted applicants are invited for an interview and pitch session. Successful founders are officially welcomed into our incubation cohort.",
    },
    {
      name: "Build & Grow",
      description: "Access our co-working office space, connect with expert mentors, attend workshops, and receive seed funding to develop your startup.",
    },
    {
      name: "Launch & Scale",
      description: "Pitch at our demo days, compete in startup competitions, and get connected to investors ready to take your startup to the next level.",
    },
  ];
  const icons = [icon1, icon2, icon3, icon4];

  return (
    <div className="lg:grid lg:grid-cols-12 pb-20 pt-30">
      <div className="lg:col-start-2 lg:col-span-10 flex flex-col gap-4">

        {/* Header */}
        <p className="text-sm font-semibold tracking-widest text-green-500 uppercase self-center">
          our process
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-wide text-center uppercase self-center">
          your journey with us
        </h2>

        {/* Items + Lines */}
        <div className="grid grid-cols-1 gap-10 md:gap-0 md:grid-cols-4 place-items-center md:place-items-start w-full mt-25">
          {processItems.map((item, index) => (
            <div key={item.name} className="flex items-center sm:items-start">
              <ProcessItem index={index} name={item.name} description={item.description} icon={icons[index]} />
              {index < processItems.length - 1 && <Line />}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}