"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Process() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Консультация & Планирование",
      description: "Знакомимся с вашим проектом, обсуждаем идеи и создаем детальный план",
      items: ["Встреча и обсуждение", "Коммерческое предложение", "Техническое задание", "Подписание договора"],
      icon: "🌱",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      number: "02",
      title: "Проектирование & Дизайн",
      description: "Создаем уникальный дизайн, учитывая все ваши пожелания и особенности участка",
      items: ["Обмеры и анализ участка", "3D-визуализация проекта", "Подбор материалов", "Создание чертежей"],
      icon: "✏️",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      number: "03",
      title: "Производство & Контроль",
      description: "Изготавливаем мебель с применением лучших технологий и материалов",
      items: ["Подготовка материалов", "Изготовление элементов", "Сборка конструкции", "Контроль качества"],
      icon: "🔨",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      number: "04",
      title: "Монтаж & Завершение",
      description: "Устанавливаем мебель на участке и проводим финальную проверку",
      items: ["Доставка на участок", "Монтаж и установка", "Финальная отделка", "Фотосъемка проекта"],
      icon: "✨",
      gradient: "from-purple-500/20 to-pink-500/20"
    }
  ];

  return (
    <section id="process" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-black">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 bg-gradient-motion subtle-lines" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      
      {/* Золотые акценты */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 rounded-full mb-6"
          >
            <span className="text-3xl">📋</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6">
            Как мы <span className="text-gold">работаем</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            От первой встречи до готового проекта — мы создаем эксклюзивную садовую мебель, 
            которая станет украшением вашего участка на долгие годы
          </p>
        </motion.div>

        {/* Блоки этапов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Основная карточка */}
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gold/30 transition-all duration-500 hover:shadow-gold-glow">
                {/* Градиентный фон */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Содержимое */}
                <div className="relative z-10">
                  {/* Заголовок с номером */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-2xl font-bold text-black shadow-gold-glow">
                      {step.number}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
                        {step.icon}
            </div>
          </div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-gold transition-colors duration-300">
                      {step.title}
                    </h3>
                  </div>
                  
                  {/* Описание */}
                  <p className="text-white/80 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Список пунктов */}
                  <ul className="space-y-3">
                    {step.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.2 + itemIndex * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
                      >
                        <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
                        <span className="text-base">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
          </div>
                
                {/* Декоративные элементы */}
                <div className="absolute top-4 right-4 w-16 h-16 border border-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border border-gold/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
        </div>

              {/* Соединительная линия (кроме последнего элемента) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gold/50 to-transparent transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
