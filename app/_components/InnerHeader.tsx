import Link from "next/link";

export function InnerHeader() {
  return (
    <header className="site-header site-header--inner">
      <Link className="wordmark" href="/">HOUSEPHOTO</Link>
      <nav aria-label="Главная навигация">
        <Link href="/#formats">Форматы</Link>
        <Link href="/#case">Проекты</Link>
        <Link href="/#process">Как работаем</Link>
        <Link href="/#faq">Вопросы</Link>
      </nav>
      <Link className="header-cta" href="/#calculator">Рассчитать стоимость <span>↗</span></Link>
    </header>
  );
}
