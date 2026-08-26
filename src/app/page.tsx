import Hero from "@/_components/home/Hero";
import Categories from "@/_components/home/Categories";
import PromoSection from "@/_components/home/AD";
import RecentlyViewed from "@/_components/RecentlyViewed";
import Footer from "@/_components/home/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <PromoSection />
      <RecentlyViewed />
      <Footer />
    </>
  );
}
