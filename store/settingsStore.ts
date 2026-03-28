import { create } from "zustand";
import { siteConfig } from "@/data/siteConfig";

export interface SiteSettings {
  siteName: string;
  description: string;
  phone: string;
  phone2: string;
  phoneRaw: string;
  phoneRaw2: string;
  city: string;
  address: string;
  addressLink: string;
  hours: string;
  workStart: string;
  workEnd: string;
  workDays: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  vk: string;
  deliveryTime: string;
  minOrderAmount: number;
  freeDeliveryFrom: number;
  deliveryPrice: number;
  showInstagram: boolean;
  showFaq: boolean;
  showDeliveryChoice: boolean;
}

const defaults: SiteSettings = {
  siteName: siteConfig.siteName,
  description: "Свежие роллы. Быстрая доставка.",
  phone: siteConfig.phone,
  phone2: siteConfig.phone2,
  phoneRaw: siteConfig.phoneRaw,
  phoneRaw2: siteConfig.phoneRaw2,
  city: siteConfig.city,
  address: siteConfig.address,
  addressLink: "https://yandex.ru/maps/?text=г.+Люберцы,+ул.+Шоссейная,+42",
  hours: siteConfig.hours,
  workStart: "10:00",
  workEnd: "22:00",
  workDays: "Ежедневно",
  whatsapp: siteConfig.whatsapp,
  telegram: siteConfig.telegram,
  instagram: siteConfig.instagram,
  vk: siteConfig.vk,
  deliveryTime: siteConfig.deliveryTime,
  minOrderAmount: 500,
  freeDeliveryFrom: 2000,
  deliveryPrice: 200,
  showInstagram: true,
  showFaq: true,
  showDeliveryChoice: true,
};

interface SettingsState {
  settings: SiteSettings;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaults,
  loaded: false,

  fetchSettings: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch("https://api.sushivkus.ru/api/site-settings");
      if (!res.ok) return;
      const data = await res.json();
      if (!data || typeof data !== "object") return;

      set({
        loaded: true,
        settings: {
          ...defaults,
          ...(data.site_name && { siteName: data.site_name }),
          ...(data.description && { description: data.description }),
          ...(data.phone && { phone: data.phone }),
          ...(data.phone2 && { phone2: data.phone2 }),
          ...(data.phone_raw && { phoneRaw: data.phone_raw }),
          ...(data.phone_raw2 && { phoneRaw2: data.phone_raw2 }),
          ...(data.city && { city: data.city }),
          ...(data.address && { address: data.address }),
          ...(data.address_link && { addressLink: data.address_link }),
          ...(data.work_start && data.work_end && {
            hours: `${data.work_start} – ${data.work_end}`,
            workStart: data.work_start,
            workEnd: data.work_end,
          }),
          ...(data.work_days && { workDays: data.work_days }),
          ...(data.whatsapp && { whatsapp: `https://wa.me/${data.whatsapp}` }),
          ...(data.telegram && { telegram: `https://t.me/${data.telegram}` }),
          ...(data.instagram && { instagram: `https://instagram.com/${data.instagram}` }),
          ...(data.delivery_time && { deliveryTime: data.delivery_time }),
          ...(data.min_order_amount && { minOrderAmount: parseInt(data.min_order_amount, 10) || 500 }),
          ...(data.free_delivery_from && { freeDeliveryFrom: parseInt(data.free_delivery_from, 10) || 2000 }),
          ...(data.delivery_price && { deliveryPrice: parseInt(data.delivery_price, 10) || 200 }),
          showInstagram: data.show_instagram !== "false",
          showFaq: data.show_faq !== "false",
          showDeliveryChoice: data.show_delivery_choice !== "false",
        },
      });
    } catch {
      // API жеткиликсиз — default маанилер колдонулат
    }
  },
}));
