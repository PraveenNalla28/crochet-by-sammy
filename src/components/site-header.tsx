"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AddNavOptionForm } from "@/components/admin/admin-catalog-controls";
import { useAdminMedia } from "@/components/admin/admin-media-context";
import { useShopCatalog } from "@/components/admin/shop-catalog-context";
import { BrandLogo } from "@/components/brand-logo";
import {
  IconBag,
  IconChevronDown,
  IconClose,
  IconHeart,
  IconMenu,
  IconSearch,
} from "@/components/icons";
import { type NavDropdownItem, type NavEntry } from "@/lib/navigation";
import { buildMainNav } from "@/lib/shop-catalog";

function navIsActive(pathname: string, entry: NavEntry): boolean {
  if (entry.type === "link") return pathname === entry.href;
  return (
    pathname === entry.href ||
    (entry.href !== "/" && pathname.startsWith(`${entry.href}/`)) ||
    entry.items.some((item) =>
      pathname.startsWith(item.href.split("#")[0].split("?")[0]),
    )
  );
}

function navLinkClass(active: boolean) {
  return `font-serif text-[15px] font-semibold tracking-wide text-[#2f2426] transition-colors hover:text-maroon ${
    active
      ? "border-b-2 border-maroon pb-1 text-[#2f2426]"
      : "border-b-2 border-transparent pb-1"
  }`;
}

function NavOptionRow({
  item,
  onNavigate,
}: {
  item: NavDropdownItem;
  onNavigate?: () => void;
}) {
  const { isAdmin } = useAdminMedia();
  const { setNavEnabled, removeNavOption } = useShopCatalog();
  const tab = item.tab;
  const id = item.id;
  const enabled = item.enabled !== false;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 ${enabled ? "" : "opacity-50"}`}
    >
      <Link
        href={item.href}
        className="min-w-0 flex-1 px-2 py-1.5 text-sm text-[#5a4a4d] hover:text-[#2f2426]"
        onClick={onNavigate}
      >
        {item.label}
      </Link>
      {isAdmin && tab && id ? (
        <div className="flex shrink-0 items-center gap-1 pr-1">
          <button
            type="button"
            className="text-[10px] text-[#8b4a52]"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setNavEnabled(tab, id, Boolean(item.extra), !enabled);
            }}
          >
            {enabled ? "On" : "Off"}
          </button>
          {item.extra ? (
            <button
              type="button"
              className="text-[10px] text-[#b42318]"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                removeNavOption(tab, id);
              }}
            >
              ×
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function NavDropdown({
  entry,
  active,
}: {
  entry: Extract<NavEntry, { type: "dropdown" }>;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={entry.href}
        className={`inline-flex items-center gap-0.5 ${navLinkClass(active)}`}
        aria-expanded={open}
      >
        {entry.label}
        <IconChevronDown className="h-3 w-3 opacity-60" />
      </Link>
      <div
        className={`absolute left-0 top-full z-50 min-w-[13rem] pt-3 ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div className="border border-[#ecd5d9] bg-white py-2 shadow-md">
          <ul>
            {entry.items.map((item) => (
              <li key={item.href + (item.id ?? item.label)}>
                <NavOptionRow item={item} onNavigate={() => setOpen(false)} />
              </li>
            ))}
          </ul>
          {entry.tab ? <AddNavOptionForm tab={entry.tab} /> : null}
        </div>
      </div>
    </div>
  );
}

function MobileNavLinks({
  nav,
  onNavigate,
}: {
  nav: NavEntry[];
  onNavigate?: () => void;
}) {
  return (
    <ul>
      {nav.map((entry) => {
        if (entry.type === "link") {
          return (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="block py-3 text-base font-semibold text-[#2f2426]"
                onClick={onNavigate}
              >
                {entry.label}
              </Link>
            </li>
          );
        }
        return (
          <li key={entry.label}>
            <p className="pt-3 pb-1 text-base font-semibold text-[#2f2426]">
              {entry.label}
            </p>
            <ul className="pb-2 pl-1">
              {entry.items.map((item) => (
                <li key={item.href + (item.id ?? item.label)}>
                  <NavOptionRow item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
            {entry.tab ? <AddNavOptionForm tab={entry.tab} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { isAdmin } = useAdminMedia();
  const { catalog } = useShopCatalog();
  const nav = useMemo(
    () => buildMainNav(catalog, isAdmin),
    [catalog, isAdmin],
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    menuRef.current?.removeAttribute("open");
  }, [pathname]);

  function closeMenu() {
    menuRef.current?.removeAttribute("open");
  }

  return (
    <header className="relative z-[200] overflow-visible border-b border-[#ecd5d9]/60 bg-cream">
      <div className="relative flex h-[76px] w-full items-center gap-2 pr-1 sm:h-[92px] sm:pr-4 md:h-[108px] md:pr-6">
        <div className="min-w-0 flex-1 overflow-hidden lg:flex-none">
          <BrandLogo className="w-fit max-w-full" />
        </div>

        <nav
          className="shop-desktop-nav absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 items-center gap-7 xl:gap-9"
          aria-label="Main"
        >
          {nav.map((entry) => {
            const active = navIsActive(pathname, entry);
            if (entry.type === "link") {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={navLinkClass(active)}
                >
                  {entry.label}
                </Link>
              );
            }
            return (
              <NavDropdown key={entry.label} entry={entry} active={active} />
            );
          })}
        </nav>

        <div className="relative z-[210] ml-auto flex shrink-0 items-center">
          <button
            type="button"
            className="hidden p-2 text-[#5c3d42] hover:text-[#2f2426] sm:inline-flex sm:p-2.5"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <IconSearch className="h-[22px] w-[22px] stroke-[1.25]" />
          </button>
          <Link
            href="/login"
            className="hidden p-2 text-[#5c3d42] hover:text-[#2f2426] sm:inline-flex sm:p-2.5"
            aria-label="Wishlist"
          >
            <IconHeart className="h-[22px] w-[22px] stroke-[1.25]" />
          </Link>
          <Link
            href="/cart"
            className="relative p-2 text-[#5c3d42] hover:text-[#2f2426] sm:p-2.5"
            aria-label="Cart"
          >
            <IconBag className="h-[22px] w-[22px] stroke-[1.25]" />
            <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e53935] px-1 text-[10px] font-semibold text-white">
              0
            </span>
          </Link>

          <details ref={menuRef} className="shop-mobile-menu">
            <summary className="shop-menu-toggle" aria-label="Open menu">
              <span className="shop-menu-toggle-inner">
                <IconMenu className="shop-menu-icon-open h-6 w-6" />
                <IconClose className="shop-menu-icon-close h-6 w-6" />
              </span>
            </summary>
            <nav className="shop-mobile-panel" aria-label="Mobile">
              <form action="/" method="get" className="mb-3 sm:hidden">
                <input
                  type="search"
                  name="q"
                  placeholder="Search products"
                  className="w-full border-b border-[#d4a5ae]/50 bg-transparent py-2 text-sm outline-none focus:border-[#8b4a52]"
                />
              </form>
              <MobileNavLinks nav={nav} onNavigate={closeMenu} />
            </nav>
          </details>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#ecd5d9]/60 px-4 py-3 md:px-10">
          <form action="/" method="get" className="mx-auto max-w-xl">
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full border-b border-[#d4a5ae]/50 bg-transparent py-2 text-sm outline-none focus:border-[#8b4a52]"
            />
          </form>
        </div>
      )}
    </header>
  );
}
