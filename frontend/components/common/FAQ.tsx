import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    title: "Who can apply to the incubation program?",
    description: "Our program is open to early-stage startups and aspiring entrepreneurs with innovative ideas across any industry. Whether you have a concept, an MVP, or a small team already in place, we welcome applications from founders at all stages of their journey."
  },
  {
    title: "What does the incubation program include?",
    description: "Accepted startups gain access to fully-equipped co-working office space, seed funding opportunities, one-on-one mentorship from industry experts, business development workshops, legal and financial advisory support, and invitations to exclusive pitch competitions."
  },
  {
    title: "How long does the incubation program last?",
    description: "Our flagship incubation program runs for 6 months, with the possibility of extension based on your startup's progress and needs. During this period, you'll receive structured support through clearly defined milestones."
  },
  {
    title: "How does the funding process work?",
    description: "We provide initial seed funding to accepted startups and connect them with our network of angel investors and venture capital partners. Startups that demonstrate strong traction during the program are also eligible to pitch at our quarterly investor demo days."
  },
  {
    title: "How do I apply to join the program?",
    description: "You can apply by filling out our online application form through the contact section of this website. Our team will review your submission and reach out within 2 weeks to schedule an interview. Cohorts are accepted on a rolling basis throughout the year."
  }
]

export default function FAQ() {
  return (
    <div className="lg:grid lg:grid-cols-12 pb-20 pt-30">
      <div className="lg:col-start-2 lg:col-span-10 flex flex-col gap-4">

        {/* Header */}
        <p className="text-sm font-semibold tracking-widest text-green-500 uppercase self-center">
          faq
        </p>
        <h2 className="text-4xl font-semibold text-gray-900 tracking-wider text-center uppercase self-center">
          frequently asked questions
        </h2>

        {/* Each item is its own accordion card */}
        <div className="flex flex-col gap-4 mt-17 max-w-2xl w-full mx-auto">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {faqs.map((item) => (
              <AccordionItem
                key={item.title}
                value={item.title}
                className="border border-gray-200 rounded-lg px-6 shadow-sm bg-white data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="hover:cursor-pointer hover:no-underline text-left font-normal text-gray-900 py-5 text-md tracking-wide font-semibold data-[state=open]:text-green-500">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 pb-5">
                  {item.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </div>
  )
}