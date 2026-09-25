import MarketingShell from "@/components/marketing/MarketingShell";

const partners = [
  { name: "S.U ENYAWUILE, Esq", role: "Head of Chambers", img: "/head-of-chambers.png" },
  { name: "SAMUEL OKANNI", role: "Head, Pro Bono Services & Community Relations", img: "/samuel-okanni.png" },
  { name: "SUSAN OKANNI", role: "Head, Real Estate & Property Law", img: "/susan-okanni.png" },
  { name: "OMATSULI JOSHUA", role: "Corporate & Litigation", img: "/omatsuli-joshua.png" },
];

export default function TeamPage() {
  return (
    <MarketingShell>
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Our Team</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Meet the professionals behind Midlex LLP. We bring practical experience and disciplined advocacy to every
            matter.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((p) => (
              <div key={p.name} className="group">
                <div className="aspect-[3/4] bg-gray-100 rounded-[32px] overflow-hidden mb-6 relative">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-primary">{p.name}</h3>
                <p className="text-secondary font-medium uppercase text-xs tracking-widest mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

