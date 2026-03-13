"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";

const galleryPhotos = [
  "/photo/california_tempura.jpg",
  "/photo/manchester.jpg",
  "/photo/philadelphia_classic.jpg",
  "/photo/california_zapechen.jpg",
  "/photo/poke_salmon.jpg",
  "/photo/caesar_pizza.jpg",
  "/photo/mister_krabs.jpg",
  "/photo/lava_zapechen.jpg",
];

export default function InstagramGallery() {
  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Instagram className="w-4 h-4" />
            Мы в соцсетях
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Наши блюда в деле
          </h2>
          <p className="text-gray-500 text-sm">
            Реальные фото наших блюд — никаких стоковых картинок
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={photo}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <Image
                src={photo}
                alt="Блюдо Суши Вкус"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-4"
        >
          <a
            href="https://instagram.com/sushivkus_lybertsy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-5 h-5" />
            Подписаться в Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
