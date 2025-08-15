"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Gallery() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = [
    {
      id: 1,
      title: "Угловой диван для террасы",
      description: "Современный угловой диван с подушками из водоотталкивающей ткани. Металлический каркас, деревянные элементы из тика.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1120&auto=format&fit=crop",
      category: "Диваны",
      size: "3.2м × 2.1м"
    },
    {
      id: 2,
      title: "Комплект для патио",
      description: "Стол и скамейки из устойчивого к погодным условиям дерева. Металлические каркасы, прочная конструкция.",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1120&auto=format&fit=crop",
      category: "Столы и скамейки",
      size: "Стол: 1.8м × 0.9м"
    },
    {
      id: 3,
      title: "Лежаки для сада",
      description: "Два комфортных лежака с регулируемыми спинками. Деревянные планки, металлические основания.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1120&auto=format&fit=crop",
      category: "Лежаки",
      size: "2.1м × 0.8м каждый"
    },
    {
      id: 4,
      title: "Журнальный столик",
      description: "Низкий столик с деревянной столешницей и металлическим каркасом. Идеален для зоны отдыха.",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1120&auto=format&fit=crop",
      category: "Столики",
      size: "1.2м × 0.6м"
    },
    {
      id: 5,
      title: "Садовая скамейка",
      description: "Классическая скамейка из массива дерева с металлическими ножками. Устойчива к влаге и перепадам температур.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1120&auto=format&fit=crop",
      category: "Скамейки",
      size: "1.5м × 0.5м"
    },
    {
      id: 6,
      title: "Комплект для веранды",
      description: "Уютный уголок отдыха с диваном и столиком. Адаптирован под размеры веранды заказчика.",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1120&auto=format&fit=crop",
      category: "Комплекты",
      size: "4.5м × 3.0м"
    }
  ];

  return (
    <section id="gallery" className="relative bg-[#0B0B0B] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            Наши проекты
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Примеры садовой мебели, созданной по индивидуальным размерам и требованиям
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(project.image)}
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur group-hover:border-gold/30 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Категория и размер */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="inline-block px-3 py-1 bg-gold/90 text-black text-xs font-semibold rounded-full">
                      {project.category}
                    </span>
                    <span className="inline-block px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                      {project.size}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Модальное окно для просмотра изображения */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={selectedImage}
                alt="Увеличенное изображение"
                width={800}
                height={600}
                className="object-contain max-h-[90vh]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Кнопка "Наверх" */}
      <div className="text-center mt-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-white/60 hover:text-gold transition-colors duration-300 text-sm flex items-center gap-2 mx-auto"
        >
          <span>↑</span>
          <span>Наверх</span>
        </button>
      </div>
    </section>
  );
}