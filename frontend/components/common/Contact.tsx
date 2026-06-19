"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import icon1 from "@/public/icons/address.png"
import icon2 from "@/public/icons/contact.png"
import icon3 from "@/public/icons/email_address.png"
import icon4 from "@/public/icons/website.png"

const contacts = [
    {
        name: "our location",
        icon: icon1,
        detail: ["Incubation Center,", "Bahir Dar, Ethiopia"]
    },
    {
        name: "call us",
        icon: icon2,
        detail: ["+251 911 234 567"]
    },
    {
        name: "email us",
        icon: icon3,
        detail: ["hello@incubation.com"]
    },
    {
        name: "website",
        icon: icon4,
        detail: ["www.incubation.com"]
    }
]

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        startupName: "",
        message: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { placeholder, value } = e.target;
        
        const fieldMap: Record<string, keyof typeof formData> = {
            "Your Name": "name",
            "Your Email": "email",
            "Startup Name or Inquiry Type": "startupName",
            "Tell us about your startup idea or how we can help you...": "message"
        };
        
        const field = fieldMap[placeholder];
        if (field) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        
        const subject = `Incubation Inquiry from ${formData.name}`;
        const body = `
Name: ${formData.name}
Email: ${formData.email}
Startup/Inquiry: ${formData.startupName}

Message:
${formData.message}

---
Sent from Incubation Contact Form
        `.trim();
        
        const mailtoLink = `mailto:hello@incubation.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(formData.email)}`;
        
        window.location.href = mailtoLink;
        
        // Reset form
        setFormData({
            name: "",
            email: "",
            startupName: "",
            message: ""
        });
    };

    return <div className="grid grid-cols-12 pb-20 pt-30 bg-gray-50">
        <div className="col-start-2 col-span-10 flex flex-col gap-4">

            {/* Header */}
            <p className="text-sm font-semibold tracking-widest text-green-500 uppercase self-center">
                get in touch
            </p>
            <h2 className="text-4xl max-w-xl md:text-4xl font-semibold text-gray-900 tracking-wider text-center uppercase self-center">
                contact us
            </h2>
            <p className="text-gray-500 font-light text-center text-sm tracking-wide leading-relaxed px-4 my-5 self-center">
                Have a startup idea or want to learn more about our programs? We'd love to hear from you — reach out and let's build something great together.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 text-white">
                {contacts.map(item => (
                    <div key={item.name} style={{ background: 'linear-gradient(to bottom right, #7ac64d, #31de79)' }} className="flex flex-col gap-7 justify-start items-center py-8">
                        <div className="w-25 h-25 rounded-full flex justify-center items-center bg-green-400/30">
                            <Image src={item.icon} alt={item.name} width={25} height={25} className="object-contain brightness-0 invert" />
                        </div>
                        <p className="uppercase text-white tracking-wide font-medium">{item.name}</p>
                        <div className="text-center">
                            {item.detail.length > 1 ?
                                <>
                                    <p className="tracking-wide text-sm">{item.detail[0]}</p>
                                    <p className="tracking-wide text-sm">{item.detail[1]}</p>
                                </> :
                                <p className="tracking-wide text-sm">{item.detail[0]}</p>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {/* Send message form */}
            <div className="grid sm:grid-cols-2 rounded-2xl overflow-hidden shadow-lg border border-gray-100">

                {/* Map */}
                <div className="bg-gray-200 min-h-64 sm:min-h-full flex items-center justify-center text-gray-400 text-sm tracking-wide">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.3976430181244!2d37.3840422!3d11.5929149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2zMTHCsDM1JzMyLjUiTiAzN8KwMjMnMDIuNSJF!5e0!3m2!1sen!2set!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full min-h-64" />
                </div>

                {/* Form */}
                <div className="bg-slate-100 flex flex-col gap-4 p-8">
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                        <Input
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="px-3 py-7 bg-white border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg py-5 text-sm placeholder:text-gray-600 tracking-wide"
                        />
                        <Input
                            placeholder="Your Email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="px-3 py-7 bg-white border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg py-5 text-sm placeholder:text-gray-600 tracking-wide"
                        />
                        <Input
                            placeholder="Startup Name or Inquiry Type"
                            value={formData.startupName}
                            onChange={handleInputChange}
                            className="px-3 py-7 bg-white border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg py-5 text-sm placeholder:text-gray-600 tracking-wide"
                        />
                        <Textarea
                            placeholder="Tell us about your startup idea or how we can help you..."
                            value={formData.message}
                            onChange={handleInputChange}
                            className="px-3 min-h-42 border-gray-300 bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg text-sm placeholder:text-gray-600 tracking-wide resize-none leading-relaxed"
                        />
                        <Button 
                            type="submit"
                            style={{ background: 'linear-gradient(to right, #7ac64d, #31de79)' }} 
                            className="self-start px-12 py-7 text-md rounded-full"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
}
