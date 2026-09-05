"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const images = [
  {
    url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop",
    title: "Our Main Office",
    category: "Office"
  },
  {
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
    title: "Supreme Court Session",
    category: "Court"
  },
  {
    url: "/client_consultation.png",
    title: "Client Consultation",
    category: "Clients"
  },
  {
    url: "/team_strategy_meeting.png",
    title: "Team Strategy Meeting",
    category: "Lawyers"
  },
  {
    url: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?q=80&w=2070&auto=format&fit=crop",
    title: "Legal Research Library",
    category: "Office"
  },
  {
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2070&auto=format&fit=crop",
    title: "Corporate Mediation",
    category: "Clients"
  }
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-4xl font-bold text-primary mb-4">Firm Gallery</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A glimpse into our professional environment, court appearances, and dedicated client service.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="group relative aspect-video bg-gray-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">{img.category}</span>
                  <h3 className="text-white text-xl font-bold">{img.title}</h3>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
