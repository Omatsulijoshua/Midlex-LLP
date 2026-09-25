"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Link from "next/link";
import Testimonials from "@/components/Testimonials/Testimonials";
import Gallery from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Contact = dynamic(() => import("@/components/Contact/Contact"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      
      {/* About Section */}
      <section id="about" className="py-24 bg-[#fafafa] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] bg-primary rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/30" />
                  <img 
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" 
                    alt="Midlex LLP Office"
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hidden md:block"
                >
                  <p className="text-4xl font-bold text-primary mb-1">20+</p>
                  <p className="text-gray-500 font-medium">Expert Lawyers</p>
                </motion.div>
              </div>
            </Reveal>
            
            <Reveal direction="right">
              <div>
                <h2 className="text-4xl font-bold text-primary mb-8 leading-tight">
                  About Midlex LLP <br />
                  <span className="text-secondary">(Prudence in Law)</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Headquartered in the heart of Benin City, Midlex LLP is a distinguished law firm 
                  dedicated to providing sophisticated legal solutions for complex challenges.
                </p>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  Our philosophy, "Leges Prudentia" (Prudence in Law), reflects our commitment to 
                  wisdom, foresight, and meticulous attention to detail in every case we handle.
                </p>
                
                <div className="space-y-6">
                  {[
                    "Integrity & Transparency",
                    "Client-Centric Advocacy",
                    "Results-Oriented Approach",
                    "Innovative Legal Solutions"
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-lg font-semibold text-primary">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Meet the Lawyers */}
      <section id="lawyers" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold text-primary mb-16">Meet Our Partners</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { name: "S.U ENYAWUILE, Esq", role: "Head of Chambers", img: "/head-of-chambers.png" },
              { name: "SAMUEL OKANNI", role: "Head, Pro Bono Services & Community Relations", img: "/samuel-okanni.png" },
              { name: "Enyawuile Chukwuka Abednego", role: "Principal Partner", img: "/ec-abednego.png" },
              { name: "Godman HANNAH Esq", role: "Assistant Secretary Elect", img: "/ec-hannah.png" }
            ].map((lawyer, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded-[32px] overflow-hidden mb-6 relative">
                    <img src={lawyer.img} alt={lawyer.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{lawyer.name}</h3>
                  <p className="text-secondary font-medium uppercase text-sm tracking-widest mt-1">{lawyer.role}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Contact />

      {/* Footer */}
      <footer className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
            <div className="col-span-2">
              <span className="text-3xl font-bold tracking-tight mb-6 block">
                MIDLEX <span className="text-secondary">LLP</span>
              </span>
              <p className="text-white/60 max-w-sm leading-relaxed mb-8">
                Prudence in law, excellence in service. Providing premium legal excellence and 
                strategic advisory across Nigeria.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "Instagram", href: "https://www.instagram.com/midlexllp/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" },
                  { name: "Facebook", href: "https://www.facebook.com/people/Midlex-LLP/100094930886471/", icon: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" },
                  { name: "LinkedIn", href: "https://ng.linkedin.com/company/leges-prudentia-ilc", icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
                ].map((social, i) => (
                  <motion.a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noreferrer" 
                    whileHover={{ y: -5, backgroundColor: "#c5a059" }}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all"
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-white/60">
                <li><Link href="#about" className="hover:text-secondary transition-colors">About Us</Link></li>
                <li><Link href="#services" className="hover:text-secondary transition-colors">Services</Link></li>
                <li><Link href="#lawyers" className="hover:text-secondary transition-colors">Our Team</Link></li>
                <li><Link href="#contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Headquarters</h4>
              <p className="text-white/60 leading-relaxed">
                Owa Street, Off Wire Road,<br />
                Benin City, Edo State,<br />
                Nigeria.
              </p>
            </div>
          </div>
          <div className="pt-8 flex justify-between items-center text-sm text-white/40">
            <p>© 2026 Midlex LLP. All rights reserved.</p>
            <p>Designed by Emrald Code Studio</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
