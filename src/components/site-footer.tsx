import Link from "next/link";
import { FooterAdminToggle } from "@/components/admin/footer-admin-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { SHOP_CATEGORIES } from "@/lib/home-content";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/women" },
  { label: "Custom Orders", href: "/contact" },
  { label: "Festive Collection", href: "/event-based" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-footer-bg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-[minmax(16rem,1.35fr)_1fr_1fr_1fr] lg:py-16">
        <div className="min-w-0">
          <BrandLogo variant="footer" />
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            Handmade crochet accessories, gifts and keepsakes crafted with love
            and care.
          </p>
          <p className="mt-4 text-sm text-text-body">
            Thank you for supporting handmade!{" "}
            <span className="text-pink-accent">♡</span>
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-text-head">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-text-muted transition hover:text-maroon"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg text-text-head">Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {SHOP_CATEGORIES.map((cat) => (
              <li key={cat.title}>
                <Link
                  href={cat.href}
                  className="text-sm text-text-muted transition hover:text-maroon"
                >
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg text-text-head">Connect</h3>
          <p className="mt-4 text-sm text-text-muted">
            Instagram · Pinterest · YouTube · WhatsApp
          </p>
          <h3 className="mt-8 font-serif text-lg text-text-head">Contact Us</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-text-muted">
            <li>
              <a href="mailto:hello@crochetbysammu.com">hello@crochetbysammu.com</a>
            </li>
            <li>+91 98765 43210</li>
            <li>India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#e8ddd6] px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-text-muted md:flex-row">
          <p>© 2024 crochet_by_sammu. All rights reserved.</p>
          <FooterAdminToggle />
          <p>
            Made with <span className="text-pink-accent">♥</span> for a handmade
            world.
          </p>
        </div>
      </div>
    </footer>
  );
}
