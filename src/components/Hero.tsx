"use client";

import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/scroll";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[85vh] sm:min-h-[92vh] pt-16 sm:pt-24 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-motion subtle-lines" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center min-h-[85vh] sm:min-h-[92vh]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight"
        >
          Садовая мебель премиум-класса
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
          className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl"
        >
          Создаем эксклюзивную садовую мебель по индивидуальным размерам. Точное соответствие вашему пространству, стилю и требованиям к качеству.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <button 
            onClick={() => scrollToSection('contact')}
            className="button-primary rounded-full px-6 py-3 text-sm font-semibold shadow-gold-glow w-full sm:w-auto text-center"
          >
            Заказать проект
          </button>
          <button 
            onClick={() => scrollToSection('gallery')}
            className="rounded-full px-6 py-3 text-sm font-semibold border border-white/15 hover:border-white/30 transition-colors w-full sm:w-auto text-center"
          >
            Смотреть проекты
          </button>
        </motion.div>
      </div>
    </section>
  );
}