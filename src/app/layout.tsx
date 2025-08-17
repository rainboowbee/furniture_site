import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
// import "locomotive-scroll/dist/locomotive-scroll.css";
import ScrollProvider from "@/components/ScrollProvider";
import Analytics from "@/components/Analytics";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "GARDENFAB — Садовая мебель на заказ",
  description: "Создаем эксклюзивную садовую мебель на заказ: угловые диваны, лежаки, скамейки, столы для террас и патио. Индивидуальные размеры, качественные материалы, гарантия. Заказать садовую мебель в Воронеже.",
  keywords: "садовая мебель на заказ, мебель для террасы, мебель для патио, угловые диваны, лежаки, скамейки, столы, садовая мебель Воронеж, мебель для сада",
  authors: [{ name: "GARDENFAB" }],
  creator: "GARDENFAB",
  publisher: "GARDENFAB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gardenfab.ru"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://gardenfab.ru",
    siteName: "GARDENFAB",
    title: "GARDENFAB — Садовая мебель на заказ в Москве",
    description: "Создаем эксклюзивную садовую мебель на заказ: угловые диваны, лежаки, скамейки, столы для террас и патио. Индивидуальные размеры, качественные материалы, гарантия.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GARDENFAB - Садовая мебель на заказ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GARDENFAB — Садовая мебель на заказ в Москве",
    description: "Создаем эксклюзивную садовую мебель на заказ: угловые диваны, лежаки, скамейки, столы для террас и патио.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  verification: {
    google: process.env['GOOGLE_VERIFICATION'] || "your-google-verification-code",
    yandex: process.env['YANDEX_VERIFICATION'] || "your-yandex-verification-code",
  },
  icons: { 
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} antialiased bg-black text-white`}>
        <ScrollProvider>
          {children}
        </ScrollProvider>
        <Analytics 
          googleAnalyticsId={process.env['NEXT_PUBLIC_GOOGLE_ANALYTICS_ID'] || ""}
          yandexMetricaId={process.env['NEXT_PUBLIC_YANDEX_METRICA_ID'] || ""}
        />
        {/* Инициализируем мониторинг производительности */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Инициализация мониторинга производительности
              if (typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const score = window.performanceMonitor?.getScore();
                    if (score !== undefined) {
                      console.log('🚀 Performance Score:', score + '/100');
                    }
                  }, 2000);
                });
              }
              
              // Предотвращение блокировки прокрутки и мягкий контроль скролла
              (function() {
                function resetScrollLock() {
                  document.body.style.overflow = '';
                  document.documentElement.style.overflow = '';
                  document.body.style.position = '';
                  document.documentElement.style.position = '';
                }
                
                // Функция для мягкого предотвращения скролла после футера
                function preventScrollAfterFooter() {
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const documentHeight = document.documentElement.scrollHeight;
                  const windowHeight = window.innerHeight;
                  
                  // Если достигли конца страницы, мягко останавливаем скролл
                  if (scrollTop + windowHeight >= documentHeight - 10) {
                    requestAnimationFrame(() => {
                      window.scrollTo(0, documentHeight - windowHeight);
                    });
                  }
                }
                
                // Функция для предотвращения wheel событий после футера
                function preventWheelAfterFooter(e) {
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const documentHeight = document.documentElement.scrollHeight;
                  const windowHeight = window.innerHeight;
                  
                  // Если достигли конца страницы и пытаемся скроллить вниз
                  if (scrollTop + windowHeight >= documentHeight - 10 && e.deltaY > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }
                
                // Сбрасываем блокировку при загрузке
                window.addEventListener('load', resetScrollLock);
                
                // Сбрасываем блокировку при прокрутке
                window.addEventListener('scroll', resetScrollLock);
                window.addEventListener('scroll', preventScrollAfterFooter);
                
                // Предотвращаем wheel события после футера
                window.addEventListener('wheel', preventWheelAfterFooter, { passive: false });
                
                // Сбрасываем блокировку при изменении размера окна
                window.addEventListener('resize', resetScrollLock);
                
                // Сбрасываем блокировку при фокусе на элементах
                document.addEventListener('focusin', resetScrollLock);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
