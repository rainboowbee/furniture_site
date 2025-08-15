"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/scroll";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#about", label: "О компании" },
    { href: "#gallery", label: "Примеры" },
    { href: "#process", label: "Этапы" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#contact", label: "Контакты" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2">
          <span className="text-lg sm:text-xl tracking-[0.2em] font-semibold text-gold">GARDEN</span>
          <span className="text-lg sm:text-xl tracking-[0.2em] font-semibold">FAB</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <button 
              key={item.href} 
              onClick={() => scrollToSection(item.href.replace('#', ''))}
              className="text-sm text-white/80 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contact')}
            className="button-primary rounded-full px-4 py-2 text-sm font-medium cursor-pointer"
          >
            Заказать проект
          </button>
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-sm text-white/60 hover:text-gold transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
            title="Наверх"
          >
            <span>↑</span>
            <span className="hidden lg:inline">Наверх</span>
          </button>
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/10 text-white/80 hover:text-white transition-colors"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md"
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  scrollToSection(item.href.replace('#', ''));
                  setIsOpen(false);
                }}
                className="text-base text-white/80 hover:text-white transition-colors py-2 border-b border-white/5 bg-transparent border-none cursor-pointer text-left"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                scrollToSection('contact');
                setIsOpen(false);
              }}
              className="button-primary rounded-full px-6 py-3 text-base font-medium text-center mt-4 cursor-pointer"
            >
              Заказать проект
            </button>
            <button
              onClick={() => {
                scrollToSection('hero');
                setIsOpen(false);
              }}
              className="text-base text-white/60 hover:text-gold transition-colors py-2 border-b border-white/5 bg-transparent border-none cursor-pointer text-left flex items-center gap-2"
            >
              <span>↑</span>
              <span>Наверх</span>
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}