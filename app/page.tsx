"use client";

import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkTimer from "@/components/WorkTimer";
import MenuSection from "@/components/Menu";
import CategoryGrid from "@/components/CategoryGrid";
import PopularSection from "@/components/PopularSection";
import Cart from "@/components/Cart";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MobileNav from "@/components/MobileNav";
import Toast from "@/components/Toast";
import OrderSuccess from "@/components/OrderSuccess";

import FAQ from "@/components/FAQ";
import InstagramGallery from "@/components/InstagramGallery";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <WorkTimer />
        <CategoryGrid />
        <PopularSection />

        <MenuSection />
        <InstagramGallery />
        <FAQ />
      </main>
      <Footer />
      <Cart />
      <OrderForm />
      <OrderSuccess />
      <ScrollToTop />
      <MobileNav />
      <Toast />
    </>
  );
}
