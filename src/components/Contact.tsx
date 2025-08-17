"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Имя обязательно";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (!/^\+?[0-9\s\-\(\)]{10,20}$/.test(form.phone.trim())) {
      newErrors.phone = "Неверный формат телефона";
    }

    if (form.message.trim().length > 1000) {
      newErrors.message = "Сообщение слишком длинное (максимум 1000 символов)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Очищаем ошибку при вводе
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Ошибка отправки");
      }
      
      setSent(true);
      setForm({ name: "", phone: "", message: "" });
      setErrors({});
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка отправки";
      setError(message);
      
      // Скрываем ошибку через 5 секунд
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-semibold"
            >
              Свяжитесь с нами
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-4 text-white/80"
            >
              Расскажите о вашем проекте — мы подготовим предложение с учетом размеров террасы, стиля ландшафта и ваших предпочтений по материалам.
            </motion.p>

            <motion.form 
              onSubmit={handleSubmit} 
              className="mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <label className="block text-sm mb-2 text-white/70" htmlFor="name">
                  Имя <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg bg-[#0E0E0E] border px-4 py-3 placeholder:text-white/40 focus:outline-none transition-colors ${
                    errors.name 
                      ? "border-red-400 focus:border-red-300" 
                      : "border-gold/40 focus:border-gold/80"
                  }`}
                  placeholder="Ваше имя"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-white/70" htmlFor="phone">
                  Телефон <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full rounded-lg bg-[#0E0E0E] border px-4 py-3 placeholder:text-white/40 focus:outline-none transition-colors ${
                    errors.phone 
                      ? "border-red-400 focus:border-red-300" 
                      : "border-gold/40 focus:border-gold/80"
                  }`}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-white/70" htmlFor="message">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full rounded-lg bg-[#0E0E0E] border px-4 py-3 placeholder:text-white/40 focus:outline-none transition-colors ${
                    errors.message 
                      ? "border-red-400 focus:border-red-300" 
                      : "border-gold/40 focus:border-gold/80"
                  }`}
                  placeholder="Опишите вашу террасу/патио, укажите размеры, предпочтения по стилю и материалам, особые требования"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                )}
                <p className="mt-1 text-xs text-white/40">
                  {form.message.length}/1000 символов
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="button-primary rounded-full px-6 py-3 text-sm font-semibold shadow-gold-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Отправка..." : "Отправить заявку"}
                </button>
                
                {sent && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-green-400 text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Заявка отправлена!
                  </motion.span>
                )}
                
                {error && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-red-400 text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </motion.span>
                )}
              </div>
            </motion.form>
          </div>

          <motion.div 
            className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-full h-[360px] sm:h-[480px] bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Контакты</h3>
                <p className="text-white/70 mb-4">Воронеж</p>
                <div className="space-y-2 text-sm text-white/60">
                  <p>📞 +7 (901) 092-97-88</p>
                  <p>🕒 Пн-Пт: 9:00 - 18:00</p>
                </div>
                
                                 {/* Социальные сети */}
                 <div className="mt-6">
                   <p className="text-white/70 text-sm mb-3">Мы в социальных сетях</p>
                   <div className="flex justify-center gap-4">
                     <a 
                       href="https://t.me/gardenfab" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300 group"
                       aria-label="Telegram канал"
                     >
                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                       </svg>
                     </a>
                                           <a 
                        href="https://vk.com/gardenfab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-300 group"
                        aria-label="ВКонтакте"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                          <path fill="#1976d2" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5 V37z"></path>
                          <path fill="#fff" d="M35.937,18.041c0.046-0.151,0.068-0.291,0.062-0.416C35.984,17.263,35.735,17,35.149,17h-2.618 c-0.661,0-0.966,0.4-1.144,0.801c0,0-1.632,3.359-3.513,5.574c-0.61,0.641-0.92,0.625-1.25,0.625C26.447,24,26,23.786,26,23.199 v-5.185C26,17.32,25.827,17,25.268,17h-4.649C20.212,17,20,17.32,20,17.641c0,0.667,0.898,0.827,1,2.696v3.623 C21,24.84,20.847,25,20.517,25c-0.89,0-2.642-3-3.815-6.932C16.448,17.294,16.194,17,15.533,17h-2.643 C12.127,17,12,17.374,12,17.774c0,0.721,0.6,4.619,3.875,9.101C18.25,30.125,21.379,32,24.149,32c1.678,0,1.85-0.427,1.85-1.094 v-2.972C26,27.133,26.183,27,26.717,27c0.381,0,1.158,0.25,2.658,2c1.73,2.018,2.044,3,3.036,3h2.618 c0.608,0,0.957-0.255,0.971-0.75c0.003-0.126-0.015-0.267-0.056-0.424c-0.194-0.576-1.084-1.984-2.194-3.326 c-0.615-0.743-1.222-1.479-1.501-1.879C32.062,25.36,31.991,25.176,32,25c0.009-0.185,0.105-0.361,0.249-0.607 C32.223,24.393,35.607,19.642,35.937,18.041z"></path>
                        </svg>
                      </a>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
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