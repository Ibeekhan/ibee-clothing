import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] min-h-[80vh]">
      <aside className="border-r border-[var(--color-line)] p-6">
        <p className="font-bold mb-8">IBEE Admin</p>
        <nav className="flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium hover:text-[var(--color-accent)]">
              {l.label}
            </Link>
          ))}
          <Link href="/" className="text-sm text-black/50 mt-8">← Back to store</Link>
        </nav>
      </aside>
      <div className="p-8">{children}</div>
    </div>
  );
}
