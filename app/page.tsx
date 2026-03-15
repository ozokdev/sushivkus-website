"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
// import Hero from "@/components/Hero"; // Убрано временно
import WorkTimer from "@/components/WorkTimer";
import MenuSection from "@/components/Menu";
import CategoryGrid from "@/components/CategoryGrid";

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
  const [sections, setSections] = useState<Record<string, boolean>>({
    show_instagram: true,
    show_faq: true,
  });

  useEffect(() => {
    fetch("https://api.sushivkus.ru/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSections({
            show_instagram: data.show_instagram !== "false",
            show_faq: data.show_faq !== "false",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <TopBar />
      <Header />
      <main>
        {/* <Hero /> */}
        <WorkTimer />
        <CategoryGrid />
        <MenuSection />
        {sections.show_instagram && <InstagramGallery />}
        {sections.show_faq && <FAQ />}
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
