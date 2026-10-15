import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Pacifico } from "next/font/google";
import { AdminMediaProvider } from "@/components/admin/admin-media-context";
import { ShopCatalogProvider } from "@/components/admin/shop-catalog-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopAnnouncementBar } from "@/components/top-announcement-bar";
import { readShopCatalog } from "@/lib/shop-catalog-store";
import { readHomeMedia, readShopSettings } from "@/lib/shop-media-store";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "crochet_by_sammu | handmade with love",
  description:
    "Unique crochet accessories, gifts and keepsakes made with care, one stitch at a time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [initialMedia, initialSettings, initialCatalog] = await Promise.all([
    readHomeMedia(),
    readShopSettings(),
    readShopCatalog(),
  ]);

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${pacifico.variable} antialiased`}
    >
      <body
        className={`${dmSans.className} flex min-h-screen flex-col bg-cream text-text-body`}
      >
        <AdminMediaProvider
          initialMedia={initialMedia}
          initialSettings={initialSettings}
        >
          <ShopCatalogProvider initialCatalog={initialCatalog}>
            <TopAnnouncementBar />
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </ShopCatalogProvider>
        </AdminMediaProvider>
      </body>
    </html>
  );
}
