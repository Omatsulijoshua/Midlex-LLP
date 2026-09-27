"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function MidlexRealtyLanding() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    serviceType: 'BUY_PROPERTY',
    propertyType: 'RESIDENTIAL_PLOT',
    location: 'Benin City (GRA / Airport Rd)',
    budget: '',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.email) {
      alert('Please complete all required fields.');
      return;
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsEnquiryModalOpen(false);
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        serviceType: 'BUY_PROPERTY',
        propertyType: 'RESIDENTIAL_PLOT',
        location: 'Benin City (GRA / Airport Rd)',
        budget: '',
        details: '',
      });
      alert('Thank you for contacting Midlex Realty! Our senior real estate and conveyancing team will contact you shortly regarding your property request.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header / Navigation */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              <Image src="/logo.jpg" alt="Midlex" width={130} height={40} className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">MIDLEX REALTY</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SALES, MANAGEMENT &amp; TITLE PERFECTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Samson Sabbat &amp; Midlex Real Estate Conveyancing Arm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#services"
              className="hidden md:inline-block text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
            >
              Realty Services
            </a>
            <a
              href="#listings"
              className="hidden md:inline-block text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
            >
              Verified Listings
            </a>
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              🏢 Request Property Consultation
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase shadow-xl">
            <span>✨ 100% Legally Verified Property Sales &amp; Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-tight">
            Verified Property Sales, Management &amp; Real Estate Conveyancing
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            Your trusted legal and real estate partner. Midlex Realty manages all aspects of property transactions—including verified land sales, facility administration, tenant leasing, Certificate of Occupancy (C of O) searches, and deed perfection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              🔍 Explore Verified Properties / Search Title →
            </button>
            <a
              href="#services"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-slate-800 transition-all"
            >
              🔑 Property Management Solutions
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">100%</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">C of O Verified Titles</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400">Full Management</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Rent &amp; Tenant Leasing</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">Zero Dispute</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Legal Title Guarantee</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-blue-400">EDOGIS / Lands</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Ministry Searches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20">
              OUR REAL ESTATE DIVISIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">How Midlex Handles Real Estate &amp; Properties</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Combining legal expertise with real estate market knowledge to safeguard buyers, sellers, landlords, and estate developers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-2xl flex items-center justify-center font-bold">
                🏢
              </div>
              <h3 className="text-xl font-black text-white">Property Sales &amp; Acquisitions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sale and acquisition of verified residential plots, luxury villas, commercial plazas, and industrial lands with zero title disputes.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Pre-vetted land titles</li>
                <li>• Transparent purchase contracts</li>
                <li>• Estate agent oversight</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl flex items-center justify-center font-bold">
                🔑
              </div>
              <h3 className="text-xl font-black text-white">Property &amp; Tenant Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-service property administration for property owners, including tenant screening, lease drafting, rent collection, and maintenance.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Strict tenant vetting</li>
                <li>• Automated rent collection</li>
                <li>• Facility repairs &amp; oversight</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-2xl flex items-center justify-center font-bold">
                🔍
              </div>
              <h3 className="text-xl font-black text-white">Title Verification &amp; C of O Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thorough legal searches at Ministry of Lands / EDOGIS, Certificate of Occupancy (C of O) validation, and Governor's Consent perfection.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Land registry searches</li>
                <li>• Survey plan validation</li>
                <li>• Deed of Assignment perfection</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-2xl flex items-center justify-center font-bold">
                📝
              </div>
              <h3 className="text-xl font-black text-white">Conveyancing &amp; JV Agreements</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Legal drafting of Joint Venture (JV) property development agreements, land conveyancing deeds, tenancy notices, and dispute resolution.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Joint Venture drafting</li>
                <li>• Tenancy dispute defence</li>
                <li>• Land registry filing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Catalogue Section */}
      <section id="listings" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                VERIFIED REALTY CATALOGUE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Featured Verified Property Listings</h2>
              <p className="text-slate-400 text-sm mt-1">Inspected and legally cleared by Samson Sabbat &amp; Midlex Conveyancing Advocates</p>
            </div>
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              + List Your Property With Us
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Property 1 */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl" />
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">COMMERCIAL LAND • GRA BENIN</span>
                  <h4 className="text-lg font-black text-white">1,200 sqm Commercial Plot in GRA Benin City</h4>
                  <span className="text-xs text-emerald-400 font-bold">✓ C of O Verified • Free of Encroachment</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Prime commercial land situated in GRA Benin City, suitable for office complex, hotel, or medical plaza development.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">Title: Certificate of Occupancy</span>
                <button onClick={() => setIsEnquiryModalOpen(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-all">
                  Inquire Now
                </button>
              </div>
            </div>

            {/* Property 2 */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">LUXURY RESIDENTIAL VILLA</span>
                  <h4 className="text-lg font-black text-white">4-Bedroom Smart Detached Duplex</h4>
                  <span className="text-xs text-emerald-400 font-bold">✓ Deed of Assignment &amp; Registered Survey</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Newly built luxury 4-bedroom detached villa with BQ, solar power integration, security automation, and estate parking in Airport Road, Benin.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">Title: Registered Survey &amp; Deed</span>
                <button onClick={() => setIsEnquiryModalOpen(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-all">
                  Inquire Now
                </button>
              </div>
            </div>

            {/* Property 3 */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">COMMERCIAL RETAIL PLAZA</span>
                  <h4 className="text-lg font-black text-white">Sapele Road 2-Storey Commercial Plaza</h4>
                  <span className="text-xs text-emerald-400 font-bold">✓ Full Property Management Mandate</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-yield commercial plaza generating annual rental income, managed by Midlex Realty for tenant leasing and maintenance.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">Title: Governor's Consent</span>
                <button onClick={() => setIsEnquiryModalOpen(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-all">
                  Inquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpg" alt="Midlex" width={110} height={35} className="h-8 w-auto object-contain" />
            <p>© {new Date().getFullYear()} Midlex Realty &amp; Property Management. Samson Sabbat Lead Counsel. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#services" className="hover:text-amber-400 transition-colors">Realty Services</a>
            <a href="#listings" className="hover:text-amber-400 transition-colors">Verified Listings</a>
            <button onClick={() => setIsEnquiryModalOpen(true)} className="hover:text-amber-400 transition-colors">Property Consultation</button>
          </div>
        </div>
      </footer>

      {/* PROPERTY ENQUIRY / TITLE VERIFICATION MODAL */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                  MIDLEX REALTY ENQUIRY FORM
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Request Property Service / Title Search</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect with Samson Sabbat &amp; the Midlex Realty team for property acquisition, tenant management, or legal title verification.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Chief Osaigbovo"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="client@midlex.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Realty Service Needed *</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-bold"
                    >
                      <option value="BUY_PROPERTY">🏢 Buy Verified Property / Land Plot</option>
                      <option value="SELL_PROPERTY">🏷️ Sell / List Property For Sale</option>
                      <option value="PROPERTY_MANAGEMENT">🔑 Property &amp; Tenant Management Mandate</option>
                      <option value="TITLE_SEARCH">🔍 Land Title Search &amp; C of O Verification</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Property Category</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-bold"
                    >
                      <option value="RESIDENTIAL_PLOT">🌱 Residential Land Plot</option>
                      <option value="COMMERCIAL_LAND">🏢 Commercial Development Land</option>
                      <option value="LUXURY_VILLA">🏡 Luxury Residential Home / Villa</option>
                      <option value="COMMERCIAL_PLAZA">🏬 Commercial Retail / Office Plaza</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="+234 803 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Target Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. GRA Benin, Airport Rd, Sapele Rd"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Property Details &amp; Specific Requirements</label>
                  <textarea
                    rows={3}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Provide details regarding your property inquiry, land size requirements, or title search details..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryModalOpen(false)}
                    className="px-5 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSuccess}
                    className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    {isSuccess ? 'Submitting...' : 'Submit Property Request →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
