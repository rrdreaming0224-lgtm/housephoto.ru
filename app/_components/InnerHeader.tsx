import Link from "next/link";

export function InnerHeader() {
  return (
    <header className="site-header site-header--inner">
      <Link className="wordmark" href="/">HOUSEPHOTO</Link>
      <nav aria-label="Главная навигация">
        <Link href="/?skipIntro=1#formats">Форматы</Link>
        <Link href="/?skipIntro=1#process">Как работаем</Link>
        <Link href="/?skipIntro=1#faq">Вопросы</Link>
      </nav>
      <Link className="header-cta" href="/?skipIntro=1#calculator">Рассчитать стоимость <span>↗</span></Link>
    </header>
  );
}
