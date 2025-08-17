"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative bg-[#0B0B0B] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold">
              О компании GARDENFAB
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Мы специализируемся на производстве премиальной садовой мебели по индивидуальным проектам: угловые диваны, лежаки, скамейки, столы и стулья для террас, патио и садовых зон.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              Наша команда объединяет опытных мастеров, которые создают мебель с учетом особенностей вашего пространства. Мы используем только качественные материалы: устойчивую к погодным условиям качественную древесину (тик, акация), прочный металл и водоотталкивающие ткани.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              Каждый проект — это уникальное решение, адаптированное под размеры вашей террасы, стиль ландшафта и индивидуальные предпочтения. Мы гарантируем долговечность и комфорт в любое время года.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative h-56 sm:h-72 rounded-lg overflow-hidden card-hover"
            >
              <Image
                src="/work/Komplekt mebeli.jpg"
                alt="Комплект садовой мебели"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative h-56 sm:h-72 rounded-lg overflow-hidden card-hover"
            >
              <Image
                src="/work/kashpo2.jpg"
                alt="Кашпо для сада"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}