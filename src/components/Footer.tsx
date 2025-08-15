export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0B0B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg tracking-[0.2em] font-semibold text-gold">GARDEN</span>
          <span className="text-lg tracking-[0.2em] font-semibold">FAB</span>
        </div>
        <div className="text-sm text-white/60">© {new Date().getFullYear()} GARDENFAB. Все права защищены.</div>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <a href="#about" className="hover:text-white">О нас</a>
          <a href="#gallery" className="hover:text-white">Примеры</a>
          <a href="#contact" className="hover:text-white">Контакты</a>
        </div>
      </div>
    </footer>
  );
}