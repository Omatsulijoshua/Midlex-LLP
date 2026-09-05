"use client";

import { motion } from "framer-motion";
import { Home, Building2, Gavel, Scale, Shield, Users } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Legal Representation",
    description: "Expert advocacy in litigation and dispute resolution before all superior courts of record.",
    icon: <Gavel size={32} />,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Property Acquisition",
    description: "End-to-end guidance in acquiring landed properties, ensuring clean titles and legal security.",
    icon: <Home size={32} />,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Real Estate Law",
    description: "Comprehensive legal services for real estate development, leasing, and management.",
    icon: <Building2 size={32} />,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Corporate Legal Services",
    description: "Strategic advice for businesses, company secretarial services, and regulatory compliance.",
    icon: <Users size={32} />,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Commercial Arbitration",
    description: "Alternative dispute resolution to protect your business interests with efficiency.",
    icon: <Scale size={32} />,
    color: "bg-red-50 text-red-600",
  },
  {
    title: "Legal Advisory",
    description: "Proactive legal risk management and strategic consulting for individuals and firms.",
    icon: <Shield size={32} />,
    color: "bg-primary/10 text-primary",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-primary mb-4"
          >
            Our Areas of Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Midlex LLP offers a wide range of legal services, combining deep expertise with 
            a commitment to delivering practical and effective solutions.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${service.color}`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
              <Link 
                href="#contact"
                className="mt-6 text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all inline-block"
              >
                Learn More <span>&rarr;</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
