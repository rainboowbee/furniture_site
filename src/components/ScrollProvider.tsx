/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let cleanup: (() => void) | undefined;

    // Временно отключаем Locomotive Scroll и используем стандартный скроллинг
    const initStandardScroll = () => {
      // Функция для жесткого предотвращения скролла после футера
      const preventScrollAfterFooter = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // Отладочная информация
        if (scrollTop > 0) {
          console.log('Scroll Debug:', {
            scrollTop,
            documentHeight,
            windowHeight,
            difference: documentHeight - windowHeight,
            isAtBottom: scrollTop + windowHeight >= documentHeight - 2
          });
        }
        
        // Если достигли конца страницы, мягко останавливаем скролл
        if (scrollTop + windowHeight >= documentHeight - 2) {
          console.log('STOPPING SCROLL - Reached bottom!');
          // Мягко возвращаем в конец страницы
          requestAnimationFrame(() => {
            window.scrollTo(0, documentHeight - windowHeight);
          });
        }
      };

      // Функция для предотвращения wheel событий после футера
      const preventWheelAfterFooter = (e: WheelEvent) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // Только если действительно достигли самого конца страницы
        if (scrollTop + windowHeight >= documentHeight - 2 && e.deltaY > 0) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Во всех остальных случаях разрешаем нормальный скролл
        return true;
      };

      // Функция для предотвращения touch событий после футера
      const preventTouchAfterFooter = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // Если достигли конца страницы, только логируем, но не блокируем
        if (scrollTop + windowHeight >= documentHeight - 5) {
          console.log('Touch at bottom - allowing but monitoring');
          // Не блокируем touch события, только мониторим
          return true;
        }
        
        // Во всех остальных случаях разрешаем нормальный скролл
        return true;
      };

      // Функция для предотвращения keydown событий после футера
      const preventKeydownAfterFooter = (e: KeyboardEvent) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // Если достигли конца страницы и пытаемся скроллить вниз
        if (scrollTop + windowHeight >= documentHeight - 2 && 
            (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' || e.key === ' ')) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Key blocked at bottom:', e.key);
          return false;
        }
        
        // Во всех остальных случаях разрешаем нормальную работу
        return true;
      };

      // Добавляем все обработчики
      window.addEventListener("scroll", preventScrollAfterFooter);
      window.addEventListener("wheel", preventWheelAfterFooter, { passive: false });
      window.addEventListener("touchmove", preventTouchAfterFooter, { passive: false });
      document.addEventListener("keydown", preventKeydownAfterFooter);

      // Дополнительная проверка каждые 500ms (менее агрессивно)
      const intervalId = setInterval(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // Только если действительно вышли за границы
        if (scrollTop + windowHeight > documentHeight) {
          console.log('Interval check: forcing scroll back');
          requestAnimationFrame(() => {
            window.scrollTo(0, documentHeight - windowHeight);
          });
        }
      }, 500);

      cleanup = () => {
        window.removeEventListener("scroll", preventScrollAfterFooter);
        window.removeEventListener("wheel", preventWheelAfterFooter);
        window.removeEventListener("touchmove", preventTouchAfterFooter);
        document.removeEventListener("keydown", preventKeydownAfterFooter);
        clearInterval(intervalId);
      };
    };

    // Инициализируем стандартный скроллинг
    initStandardScroll();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return <>{children}</>;
}