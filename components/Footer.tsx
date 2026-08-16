import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/shop?sort=newest", label: "New Arrivals" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#story", label: "About IBEE" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-white mt-24">
      <div className="ibee-container py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="text-xl font-bold mb-2">IBEE</p>
          <p className="text-sm text-white/60 max-w-xs">Wear Your Identity. Minimal, confident clothing for young Pakistan.</p>
          <div className="flex gap-4 mt-6 text-sm text-white/70">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="TikTok">TikTok</a>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="ibee-eyebrow text-white/50 mb-4">{col.title}</p>
            <ul className="flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} IBEE Clothing. All rights reserved.
      </div>
    </footer>
  );
}
