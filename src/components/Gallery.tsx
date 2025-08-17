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
      title: "Комплект мебели для террасы",
      description: "Современный угловой диван с подушками из водоотталкивающей ткани. Металлический каркас, элементы из качественной древесины тика.",
      image: "/work/ugldivan.jpg"
    },
    {
      id: 2,
      title: "Комплект садовой мебели",
      description: "Полный комплект для обустройства террасы: стол, стулья и дополнительные элементы из качественной древесины.",
      image: "/work/Komplekt mebeli.jpg"
    },
    {
      id: 3,
      title: "Угловой диван",
      description: "Комфортный угловой диван для зоны отдыха на террасе. Прочная конструкция с мягкими подушками.",
      image: "/work/uglovoydivan.jpg"
    },
    {
      id: 4,
      title: "Садовая скамейка",
      description: "Классическая скамейка из массива качественной древесины с металлическими ножками. Устойчива к влаге и перепадам температур.",
      image: "/work/skameyka.jpg"
    },
    {
      id: 5,
      title: "Кашпо для сада",
      description: "Стильные кашпо из качественных материалов для украшения садового пространства и террасы.",
      image: "/work/kashpo.jpg"
    },
    
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
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur group-hover:border-gold/30 transition-all duration-300 hover:shadow-gold-glow">
                {/* Контейнер с фиксированными пропорциями для решения проблемы разноразмерности */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3} // Приоритетная загрузка для первых 3 изображений
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Название товара в овальном белом блоке */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                        {project.title}
                      </h3>
                    </div>
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
                className="object-contain max-h-[90vh] rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px"
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