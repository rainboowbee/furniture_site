/**
 * Утилиты для надежной прокрутки к секциям
 */

// Высота фиксированного хедера
const HEADER_HEIGHT = 80;
const MOBILE_HEADER_HEIGHT = 60;

/**
 * Проверяет, достигли ли конца страницы
 */
function isAtBottom(): boolean {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  
  return scrollTop + windowHeight >= documentHeight - 1; // -1 для небольшого допуска
}

/**
 * Плавно прокручивает к элементу с учетом высоты хедера
 */
export function scrollToSection(sectionId: string): void {
  try {
    // Проверяем, не находимся ли мы в конце страницы
    if (isAtBottom()) {
      console.warn('Достигнут конец страницы, скролл заблокирован');
      return;
    }

    const element = document.getElementById(sectionId);
    
    if (!element) {
      console.warn(`Элемент с ID "${sectionId}" не найден`);
      return;
    }

    // Определяем высоту хедера в зависимости от размера экрана
    const headerHeight = window.innerWidth <= 768 ? MOBILE_HEADER_HEIGHT : HEADER_HEIGHT;

    // Простая и надежная прокрутка без scrollIntoView
    let elementPosition = element.offsetTop - headerHeight;
    
    // Проверяем, не выходит ли позиция за пределы страницы
    if (elementPosition < 0) {
      elementPosition = 0;
    }
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });

    // Fallback для браузеров, которые не поддерживают smooth
    if (!CSS.supports('scroll-behavior', 'smooth')) {
      window.scrollTo(0, elementPosition);
    }

    // Сбрасываем возможную блокировку прокрутки после навигации
    setTimeout(() => {
      resetScrollLock();
    }, 200);

  } catch {
    console.error('Ошибка при прокрутке');
    // Fallback - простая прокрутка
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = window.innerWidth <= 768 ? MOBILE_HEADER_HEIGHT : HEADER_HEIGHT;
      let elementPosition = element.offsetTop - headerHeight;
      
      if (elementPosition < 0) {
        elementPosition = 0;
      }
      
      window.scrollTo(0, elementPosition);
    }
    // Сбрасываем блокировку при ошибке
    resetScrollLock();
  }
}

/**
 * Прокручивает наверх страницы
 */
export function scrollToTop(): void {
  try {
    // Сначала пробуем smooth прокрутку
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Проверяем, поддерживается ли smooth прокрутка
    if (!CSS.supports('scroll-behavior', 'smooth')) {
      // Fallback для старых браузеров
      window.scrollTo(0, 0);
    }

    // Сбрасываем возможную блокировку прокрутки
    setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 100);

  } catch {
    // Fallback при ошибке
    window.scrollTo(0, 0);
    // Сбрасываем блокировку
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}

/**
 * Сбрасывает блокировку прокрутки
 */
export function resetScrollLock(): void {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  document.body.style.position = '';
  document.documentElement.style.position = '';
}

/**
 * Проверяет, поддерживает ли браузер smooth прокрутку
 */
export function supportsSmoothScroll(): boolean {
  return CSS.supports('scroll-behavior', 'smooth');
}

/**
 * Получает текущую позицию прокрутки
 */
export function getScrollPosition(): number {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Прокручивает к элементу с анимацией
 */
export function scrollToElementWithAnimation(element: HTMLElement, duration: number = 500): void {
  // Проверяем, не находимся ли мы в конце страницы
  if (isAtBottom()) {
    console.warn('Достигнут конец страницы, скролл заблокирован');
    return;
  }

  const startPosition = getScrollPosition();
  let targetPosition = element.offsetTop - HEADER_HEIGHT;
  
  // Проверяем, не выходит ли позиция за пределы страницы
  if (targetPosition < 0) {
    targetPosition = 0;
  }
  
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  function animateScroll(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Функция плавности (easeInOutCubic)
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    const currentPosition = startPosition + distance * ease(progress);
    window.scrollTo(0, currentPosition);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

/**
 * Останавливает скролл, если достигнут конец страницы
 */
export function stopScrollIfAtBottom(): void {
  if (isAtBottom()) {
    // Останавливаем скролл
    window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight);
  }
}
