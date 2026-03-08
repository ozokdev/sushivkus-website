"use client";

import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkTimer from "@/components/WorkTimer";
import MenuSection from "@/components/Menu";
import CategoryGrid from "@/components/CategoryGrid";
import Cart from "@/components/Cart";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MobileNav from "@/components/MobileNav";
import Toast from "@/components/Toast";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <WorkTimer />
        <CategoryGrid />
        <MenuSection />
      </main>
      <Footer />
      <Cart />
      <OrderForm />
      <ScrollToTop />
      <MobileNav />
      <Toast />
    </>
  );
}
