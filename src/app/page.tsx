import { BestSellers } from "@/components/home/best-sellers";
import { CustomCreations } from "@/components/home/custom-creations";
import { FestiveFavourites } from "@/components/home/festive-favourites";
import { HeroSection } from "@/components/home/hero-section";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { WhyCustomersLoveUs } from "@/components/home/why-customers-love-us";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShopByCategory />
      <BestSellers />
      <CustomCreations />
      <FestiveFavourites />
      <WhyCustomersLoveUs />
      <InstagramStrip />
    </>
  );
}
