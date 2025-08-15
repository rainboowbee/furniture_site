"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Reviews() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const reviews = [
    {
      id: 1,
      name: "Анна Петрова",
      location: "Москва, Подмосковье",
      rating: 5,
      text: "Заказали угловой диван для террасы. Мастера приехали, сделали замеры, учли все наши пожелания. Мебель получилась идеально по размерам, очень качественная. Прошло уже 2 года - выглядит как новая, несмотря на дожди и солнце.",
      project: "Угловой диван для террасы"
    },
    {
      id: 2,
      name: "Дмитрий Соколов",
      location: "Москва, Рублевка",
      rating: 5,
      text: "Сделали комплект мебели для патио: стол и скамейки. Дерево отличного качества, металлические ножки не ржавеют. Все размеры подогнаны под наше пространство. Рекомендую!",
      project: "Комплект для патио"
    },
    {
      id: 3,
      name: "Елена Воронова",
      location: "Москва, Новая Москва",
      rating: 5,
      text: "Заказывали лежаки для сада. Очень довольны качеством и комфортом. Материалы действительно устойчивы к погодным условиям. Спасибо за отличную работу!",
      project: "Лежаки для сада"
    },
    {
      id: 4,
      name: "Сергей Морозов",
      location: "Москва, Звенигород",
      rating: 5,
      text: "Профессиональный подход от начала до конца. Сделали замеры, предложили несколько вариантов дизайна, учли все детали. Мебель получилась именно такой, как мы хотели.",
      project: "Комплект для веранды"
    },
    {
      id: 5,
      name: "Мария Козлова",
      location: "Москва, Истра",
      rating: 5,
      text: "Заказывали садовую скамейку. Качество превзошло ожидания! Дерево красивое, обработка идеальная. Скамейка стоит уже 3 года и выглядит отлично.",
      project: "Садовая скамейка"
    },
    {
      id: 6,
      name: "Александр Новиков",
      location: "Москва, Одинцово",
      rating: 5,
      text: "Отличная команда мастеров! Сделали журнальный столик для зоны отдыха в саду. Все размеры подогнаны идеально, дизайн современный и стильный.",
      project: "Журнальный столик"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-gold" : "text-white/20"}>
        ★
      </span>
    ));
  };

  return (
    <section id="reviews" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Что говорят заказчики о качестве садовой мебели и нашей работе
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-[#0B0B0B] rounded-xl border border-white/10 p-6 backdrop-blur hover:border-gold/30 transition-all duration-300 group"
            >
              {/* Рейтинг */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-lg">
                  {renderStars(review.rating)}
                </div>
                <span className="text-white/60 text-sm">{review.rating}/5</span>
              </div>

              {/* Проект */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full">
                  {review.project}
                </span>
              </div>

              {/* Текст отзыва */}
              <blockquote className="text-white/80 leading-relaxed mb-6 italic">
                &ldquo;{review.text}&rdquo;
              </blockquote>

              {/* Автор */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{review.name}</div>
                  <div className="text-sm text-white/60">{review.location}</div>
                </div>
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                  <span className="text-gold font-bold text-lg">
                    {review.name.charAt(0)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-gold mb-2">150+</div>
              <div className="text-white/70">Реализованных проектов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold mb-2">98%</div>
              <div className="text-white/70">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold mb-2">5 лет</div>
              <div className="text-white/70">Гарантии на мебель</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}