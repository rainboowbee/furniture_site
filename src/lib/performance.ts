// Утилита для мониторинга производительности
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.initObservers();
    }
  }

  private initObservers() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.fcp = fcpEntry.startTime;
            this.logMetric('FCP', this.metrics.fcp);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP observer failed:', e);
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime;
            this.logMetric('LCP', this.metrics.lcp);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer failed:', e);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'first-input') {
              const firstInputEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
              this.metrics.fid = firstInputEntry.processingStart - firstInputEntry.startTime;
              this.logMetric('FID', this.metrics.fid);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer failed:', e);
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'layout-shift') {
              const layoutShiftEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value;
              }
            }
          });
          this.metrics.cls = clsValue;
          this.logMetric('CLS', this.metrics.cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer failed:', e);
      }
    }

    // Time to First Byte
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.logMetric('TTFB', this.metrics.ttfb);
      }
    }
  }

  private logMetric(name: string, value: number) {
    const isGood = this.isMetricGood(name, value);
    const emoji = isGood ? '✅' : '⚠️';
    
    console.log(`${emoji} ${name}: ${value.toFixed(2)}ms`);
    
    // В продакшене отправляем метрики в аналитику
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value);
    }
  }

  private isMetricGood(name: string, value: number): boolean {
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      FCP: { good: 1800, needsImprovement: 3000 },
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      TTFB: { good: 800, needsImprovement: 1800 },
    };

    const threshold = thresholds[name];
    if (!threshold) return true;

    return value <= threshold.good;
  }

  private sendToAnalytics(name: string, value: number) {
    // Отправляем в Google Analytics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }

    // Отправляем в Yandex Metrica
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).ym) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ym(process.env['NEXT_PUBLIC_YANDEX_METRICA_ID'], 'reachGoal', 'web_vitals', {
        metric: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
      });
    }
  }

  // Получить все метрики
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Получить конкретную метрику
  getMetric(name: keyof PerformanceMetrics): number | undefined {
    return this.metrics[name];
  }

  // Проверить, загружены ли все метрики
  isComplete(): boolean {
    return Object.keys(this.metrics).length >= 5;
  }

  // Получить оценку производительности
  getScore(): number {
    if (!this.isComplete()) return 0;

    let score = 100;
    const weights = { fcp: 0.25, lcp: 0.25, fid: 0.25, cls: 0.15, ttfb: 0.1 };

    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        const metricName = key.toUpperCase();
        const isGood = this.isMetricGood(metricName, value);
        if (!isGood) {
          score -= weights[key as keyof typeof weights] * 20;
        }
      }
    });

    return Math.max(0, Math.round(score));
  }
}

export const performanceMonitor = new PerformanceMonitor();
