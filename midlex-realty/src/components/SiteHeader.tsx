"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function SiteHeader() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const links = [['Marketplace', '/#marketplace'], ['Services', '/#services'], ['Contact', '/contact']];
  return <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#fffdf7]/95 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3"><Image src="/midlex-logo.png" alt="Midlex Realty" width={156} height={58} className="h-12 w-auto object-contain" priority /><div className="hidden border-l border-emerald-900/15 pl-3 sm:block"><p className="text-sm font-black tracking-tight text-[#073d22]">MIDLEX REALTY</p><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a87835]">Verified property marketplace</p></div></Link><nav className="hidden items-center gap-7 md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-bold text-slate-600 hover:text-[#0a5c33]">{label}</Link>)}<Link href="/admin/login" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0a5c33]"><ShieldCheck size={16} /> Admin</Link><Link href="/cart" className="relative flex items-center gap-2 rounded-full bg-[#073d22] px-5 py-3 text-sm font-bold text-white"><Heart size={17} /> Saved <span className="rounded-full bg-[#ddb849] px-2 py-0.5 text-[10px] text-[#073d22]">{items.length}</span></Link></nav><button className="rounded-xl border border-emerald-900/10 p-2 text-[#073d22] md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <div className="border-t border-emerald-950/10 bg-white px-5 py-5 md:hidden">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-slate-100 py-3 font-bold text-slate-700">{label}</Link>)}<Link href="/cart" className="mt-4 block rounded-xl bg-[#073d22] px-4 py-3 text-center font-bold text-white">Saved properties ({items.length})</Link><Link href="/admin/login" className="mt-2 block py-2 text-center text-xs font-bold text-slate-500">Realty admin sign in</Link></div>}</header>;
}
