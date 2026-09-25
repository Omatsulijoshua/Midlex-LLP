"use client";
import { motion } from "framer-motion";
import { Reveal } from "../Reveal";

const testimonials = [
  {
    name: "Mr. Monday Isidahome Ehikuele",
    role: "Labour Dispute Client",
    content: "Midlex LLP secured a hard-fought legal victory for me in my labour dispute. Their dedication to protecting employee rights is unparalleled. Another in the bag!",
    image: "/monday-isidahome.png"
  },
  {
    name: "Enyawuile Chukwuka Abednego",
    role: "Principal Partner",
    content: "Successfully negotiated a ₦565 Million out-of-court settlement for 45 disengaged staff in a landmark matter with the Delta State Government. We deliver results through strategy.",
    image: "/ec-abednego.png"
  },
  {
    name: "Enyawuile Chukwuka Abednego",
    role: "Principal Partner",
    content: "Led the mediation between Zudan Electric and UNIBEN, securing a ₦38 Million settlement. Skilful mediation avoids the delays of litigation while delivering justice.",
    image: "/ec-abednego.png"
  },
  {
    name: "Enyawuile Chukwuka Abednego",
    role: "Principal Partner",
    content: "Successfully mediated a landmark ₦1.4 Billion settlement for disengaged staff of Edo State Colleges of Agriculture. We deliver timely, effective results for our clients.",
    image: "/ec-abednego.png"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-4xl font-bold text-primary mb-4">Case Victories & Impact</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              A track record of high-stakes settlements and landmark legal victories across Nigeria.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-8 h-full rounded-[40px] bg-[#fafafa] border border-gray-100 hover:shadow-2xl hover:bg-white transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-secondary/20" />
                    <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-1 border-2 border-white">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{t.name}</h4>
                    <p className="text-xs text-secondary font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic flex-1">"{t.content}"</p>
                <div className="mt-6 flex text-secondary gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
