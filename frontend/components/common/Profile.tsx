import Image, { StaticImageData } from "next/image"
import imageprofile from "@/public/images/project-1.png"
import { BsInstagram, BsTwitter } from "react-icons/bs"
import { FaFacebookF } from "react-icons/fa"
import { LiaLinkedinIn } from "react-icons/lia"
export default function Profile({imagesrc, role, name}: {imagesrc: string | StaticImageData, role: string, name: string}) {
    return <div className="flex flex-col gap-5 items-center ">
        <div className="w-40 h-40 rounded-full overflow-hidden relative">
            <Image src={imagesrc} alt="..." fill className="object-top object-cover" />
        </div>
        <div className="flex flex-col gap-2">
            <p className="capitalized text-2xl tracking-wide">{name}</p>
            <p className="uppercase text-green-500 tracking-wider font-light">{role}</p>
        </div>
        <p className="flex gap-2 mb-5">
            <BsTwitter size={18} />
            <FaFacebookF size={18} />
            <LiaLinkedinIn size={18} />
            <BsInstagram size={18} />
        </p>
    </div>
}