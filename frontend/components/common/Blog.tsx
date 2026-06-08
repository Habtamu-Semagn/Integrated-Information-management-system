import Image from "next/image";
import pcImage1 from "@/public/images/blog_1.jpg"
import pcImage2 from "@/public/images/blog_2.jpg"
import pcImage3 from "@/public/images/blog_3.jpg"
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, Rocket, Trophy } from "lucide-react";

export default function Blog() {
    return <div className="md:grid md:grid-cols-12 pt-30 bg-gray-50">
        <div className="md:col-start-2 md:col-span-10 flex flex-col gap-4">

            {/* Header */}
            <p className="text-sm font-semibold tracking-widest text-green-500 uppercase self-center">
                Insights & Stories
            </p>
            <h2 className="text-4xl max-w-xl md:text-4xl font-semibold text-gray-900 tracking-wider text-center uppercase self-center">
                from our hub
            </h2>
            <p className="text-gray-500 font-light text-center leading-relaxed px-4 my-5 self-center">
                Stay informed with the latest startup trends, founder success stories, and updates from our incubation programs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 place-items-center md:place-items-start gap-20 md:gap-5 my-20">

                {/* Card 1 */}
                <div className="flex flex-col w-full max-w-md mx-auto">
                    <div className="relative w-full h-64 md:h-52 lg:h-64">
                        <Image src={pcImage1} alt="blog-funding-image" fill className="object-cover" />
                        <div style={{ background: 'linear-gradient(to bottom right, #7ac64d 20%, #31de79)' }} className="absolute top-0 left-0 flex gap-2 py-3 px-7 text-white">
                            <p className="flex justify-center items-center text-5xl font-semibold">08</p>
                            <p className="flex flex-col">
                                <span>2025</span>
                                <span>June</span>
                            </p>
                        </div>
                    </div>
                    <p className="font-medium text-lg tracking-wide leading-relaxed my-3">How Our Startups Secured $2M in Seed Funding This Year</p>
                    <p className="text-gray-500 text-sm tracking-wide leading-relaxed">Discover the strategies and milestones that helped our incubated startups attract top investors and close major funding rounds.</p>
                    <div className="flex justify-between items-center mt-7">
                        <Button style={{ background: 'linear-gradient(to bottom right, #7ac64d 20%, #31de79)' }} className="p-2 md:p-5 rounded-full tracking-wide text-xs lg:text-sm">Read More <ChevronRight size={24} strokeWidth={3} /></Button>
                        <p className="flex items-center gap-1 text-gray-500 text-sm tracking-wide">Admin <Lightbulb className="w-3 h-3 lg:w-5 lg:h-5" /> 5</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="flex flex-col w-full max-w-md mx-auto">
                    <div className="relative w-full h-64 md:h-52 lg:h-64">
                        <Image src={pcImage2} alt="blog-office-image" fill className="object-cover" />
                        <div style={{ background: 'linear-gradient(to bottom right, #7ac64d 20%, #31de79)' }} className="absolute top-0 left-0 flex gap-2 py-3 px-7 text-white">
                            <p className="flex justify-center items-center text-5xl font-semibold">21</p>
                            <p className="flex flex-col">
                                <span>2025</span>
                                <span>May</span>
                            </p>
                        </div>
                    </div>
                    <p className="font-medium text-lg tracking-wide leading-relaxed my-3">Inside Our Co-Working Space: Where Great Ideas Come to Life</p>
                    <p className="text-gray-500 text-sm tracking-wide leading-relaxed">Take a look at how our collaborative office environment is designed to spark innovation and foster meaningful connections between founders.</p>
                    <div className="flex justify-between items-center mt-7">
                        <Button style={{ background: 'linear-gradient(to bottom right, #7ac64d 20%, #31de79)' }} className="p-2 md:p-5 rounded-full tracking-wide text-xs lg:text-sm">Read More <ChevronRight size={24} strokeWidth={3} /></Button>
                        <p className="flex items-center gap-1 text-gray-500 text-sm tracking-wide">Admin <Rocket className="w-3 h-3 lg:w-5 lg:h-5" /> 8</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="flex flex-col w-full max-w-md mx-auto">
                    <div className="relative w-full h-64 md:h-52 lg:h-64">
                        <Image src={pcImage3} alt="blog-competition-image" fill className="object-cover" />
                        <div style={{ background: 'linear-gradient(to bottom right, #7ac64d 20%, #31de79)' }} className="absolute top-0 left-0 flex gap-2 py-3 px-7 text-white">
                            <p className="flex justify-center items-center text-5xl font-semibold">03</p>
                            <p className="flex flex-col">
                                <span>2025</span>
                                <span>May</span>
                            </p>
                        </div>
                    </div>
                    <p className="font-medium text-lg tracking-wide leading-relaxed my-3">Pitch Day Recap: Meet the Winners of Our Spring Competition</p>
                    <p className="text-gray-500 text-sm tracking-wide leading-relaxed">Relive the excitement of our latest pitch competition, where 12 startups competed for funding, mentorship prizes, and a spot in our flagship program.</p>
                    <div className="flex justify-between items-center mt-7">
                        <Button style={{ background: 'linear-gradient(to bottom right, #7ac64d 20%, #31de79)' }} className="p-2 md:p-5 rounded-full tracking-wide text-xs lg:text-sm">Read More <ChevronRight size={24} strokeWidth={3} /></Button>
                        <p className="flex items-center gap-1 text-gray-500 text-sm tracking-wide">Admin <Trophy className="w-3 h-3 lg:w-5 lg:h-5" /> 12</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
}