"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function MidlexMediaLanding() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    serviceType: 'LIVE_STREAMING',
    eventDate: '',
    location: 'Benin City, Edo State',
    details: '',
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.clientName || !bookingForm.email) {
      alert('Please fill in required fields.');
      return;
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsBookingModalOpen(false);
      setBookingForm({
        clientName: '',
        email: '',
        phone: '',
        serviceType: 'LIVE_STREAMING',
        eventDate: '',
        location: 'Benin City, Edo State',
        details: '',
      });
      alert('Thank you for booking with Midlex Media! Our production team under Daniel Uyi will reach out to confirm your media coverage & live stream schedule.');
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
                <span className="text-sm font-black tracking-tight text-white">MIDLEX MEDIA</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HEADED BY DANIEL UYI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Legal Content Creation, Live Event Streaming &amp; Social Media Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#services"
              className="hidden md:inline-block text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
            >
              Media Services
            </a>
            <a
              href="#director"
              className="hidden md:inline-block text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
            >
              Leadership (Daniel Uyi)
            </a>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              🎥 Book Live Stream / Media Production
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase shadow-xl">
            <span>🎬 Official Legal Media, Broadcasting &amp; Digital PR Division</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-tight">
            Legal Content Creation, Live Event Streaming &amp; Digital Media
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            Midlex Media specializes in law content creation, high-definition live streaming for court symposiums and NBA events, legal documentaries, podcasts, and strategic social media management for legal practitioners across Nigeria.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              📡 Book Live Streaming / Media Coverage →
            </button>
            <a
              href="#director"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-slate-800 transition-all"
            >
              👑 Meet Daniel Uyi (Director of Media)
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">4K Live</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Event Multi-Cam Streaming</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-purple-400">Podcasts</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Legal Video Series</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400">Social Media</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Advocate Brand Management</div>
            </div>
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">Legal PR</div>
              <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">Press &amp; Media Briefings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Spotlight — Daniel Uyi */}
      <section id="director" className="py-20 bg-slate-900/60 border-t border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Profile Avatar / Badge */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-1 shadow-2xl">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl sm:text-5xl font-black text-amber-400 border border-amber-500/30">
                  DU
                </div>
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg whitespace-nowrap">
                DIRECTOR OF MEDIA
              </span>
            </div>

            {/* Leadership Details */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest rounded-full">
                MIDLEX MEDIA LEADERSHIP SPOTLIGHT
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Headed by Daniel Uyi
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Under the strategic vision of <strong>Daniel Uyi</strong>, Midlex Media has established itself as the leading specialized media house for the legal profession in Nigeria. Daniel leads a multidisciplinary team of video producers, live broadcast engineers, legal journalists, and social media strategists—bringing law firm achievements, court proceedings, and legal education to millions of digital viewers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold block">Live Streaming</span>
                  <span className="text-slate-400 text-[11px]">HD Multi-Cam Events</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold block">Digital PR</span>
                  <span className="text-slate-400 text-[11px]">Bar &amp; Media Coverage</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold block">Brand Strategy</span>
                  <span className="text-slate-400 text-[11px]">Advocate &amp; Firm PR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20">
              OUR CORE MEDIA DIVISIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Full-Spectrum Law &amp; Legal Media Services</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Tailored specifically for law firms, senior advocates, NBA branches, legal institutions, and legal event organizers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-2xl flex items-center justify-center font-bold">
                🎥
              </div>
              <h3 className="text-xl font-black text-white">Live Event &amp; Court Streaming</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                4K multi-camera live streaming for law conferences, NBA branch meetings, book launches, court symposiums, and webinars.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Live YouTube &amp; Zoom broadcasting</li>
                <li>• High-definition audio &amp; graphics</li>
                <li>• Instant event video archiving</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-2xl flex items-center justify-center font-bold">
                🎙️
              </div>
              <h3 className="text-xl font-black text-white">Legal Content &amp; Podcasts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Production of legal video series, advocate interviews, courtroom documentaries, legal reels, and audio/video podcasts.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• Professional studio recording</li>
                <li>• Lawyer spotlight interviews</li>
                <li>• Educational legal reels</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl flex items-center justify-center font-bold">
                📱
              </div>
              <h3 className="text-xl font-black text-white">Social Media Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strategic brand management for advocates and law firms across LinkedIn, YouTube, Instagram, and X (Twitter).
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• LinkedIn thought leadership</li>
                <li>• Content calendar &amp; graphics</li>
                <li>• Legal audience growth</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-2xl flex items-center justify-center font-bold">
                📰
              </div>
              <h3 className="text-xl font-black text-white">Legal PR &amp; Press Briefings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Press releases, court reporting features, press conference hosting, and legal news distribution to national newspapers.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 font-medium">
                <li>• National press release distribution</li>
                <li>• Press conference management</li>
                <li>• Media kits &amp; court briefings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpg" alt="Midlex" width={110} height={35} className="h-8 w-auto object-contain" />
            <p>© {new Date().getFullYear()} Midlex Media. Headed by Daniel Uyi. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#services" className="hover:text-amber-400 transition-colors">Media Services</a>
            <a href="#director" className="hover:text-amber-400 transition-colors">Daniel Uyi</a>
            <button onClick={() => setIsBookingModalOpen(true)} className="hover:text-amber-400 transition-colors">Book Live Stream</button>
          </div>
        </div>
      </footer>

      {/* MEDIA BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                  MIDLEX MEDIA PRODUCTION BOOKING
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Book Media Coverage / Live Stream</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect with the Midlex Media team under Daniel Uyi for live event streaming, legal content, or PR.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Law Firm / Client Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.clientName}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Midlex Legal / NBA Benin"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="media@midlex.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Service Required *</label>
                    <select
                      value={bookingForm.serviceType}
                      onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-bold"
                    >
                      <option value="LIVE_STREAMING">🎥 Live Event Streaming (Multi-Cam)</option>
                      <option value="LEGAL_PODCAST">🎙️ Legal Video / Podcast Production</option>
                      <option value="SOCIAL_MEDIA">📱 Social Media &amp; Brand Management</option>
                      <option value="LEGAL_PR">📰 Legal PR &amp; Press Conference Briefing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="+234 803 000 0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Event Date</label>
                    <input
                      type="date"
                      value={bookingForm.eventDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Event Location / Venue</label>
                    <input
                      type="text"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Benin City, Abuja, Online"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Project Details &amp; Special Requirements</label>
                  <textarea
                    rows={3}
                    value={bookingForm.details}
                    onChange={(e) => setBookingForm({ ...bookingForm, details: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Describe your event, streaming requirements, or media campaign goals..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-5 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSuccess}
                    className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    {isSuccess ? 'Submitting...' : 'Confirm Media Booking →'}
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
