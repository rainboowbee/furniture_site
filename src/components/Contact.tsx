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
                <div className="text-gold text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2">Наш офис</h3>
                <p className="text-white/70 mb-4">Москва, ул. Примерная, д. 123</p>
                <div className="space-y-2 text-sm text-white/60">
                  <p>📞 +7 (495) 123-45-67</p>
                  <p>✉️ info@gardenfab.ru</p>
                  <p>🕒 Пн-Пт: 9:00 - 18:00</p>
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