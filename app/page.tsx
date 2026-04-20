"use client";

import { useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
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
import DeliveryChoiceModal from "@/components/DeliveryChoiceModal";
import { useSettingsStore } from "@/store/settingsStore";

export default function Home() {
  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <WorkTimer />
        <CategoryGrid />
        <MenuSection />
        {settings.showInstagram && <InstagramGallery />}
        {settings.showFaq && <FAQ />}
      </main>
      <Footer />
      <Cart />
      <OrderForm />
      <OrderSuccess />
      <ScrollToTop />
      <MobileNav />
      <Toast />
      <DeliveryChoiceModal />
    </>
  );
}
