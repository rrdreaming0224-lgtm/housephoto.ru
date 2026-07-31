import type { Metadata } from "next";
import Link from "next/link";
import { InnerHeader } from "../../_components/InnerHeader";
import { MediaPicture } from "../../_components/MediaPicture";

export const metadata: Metadata = {
  title: "Prime Park — полный комплект материалов",
  description: "Фотосъёмка, интерьерный фильм и PDF-презентация квартиры в Prime Park.",
};

export default function PrimeParkProject() {
  return (
    <main className="service-page project-page">
      <InnerHeader />
      <section className="service-hero">
        <div><p className="service-hero__crumb"><Link href="/">Главная</Link> / Проекты</p><h1>Prime Park</h1></div>
        <div className="service-hero__side"><p>Квартира, для которой мы собрали полный комплект: фотографии, ручной интерьерный фильм и PDF-презентацию объекта.</p><div className="service-meta"><div><span>Город</span><b>Москва</b></div><div><span>Форматы</span><b>3 материала</b></div></div></div>
      </section>
      <div className="service-example"><MediaPicture name="hero" alt="Гостиная квартиры Prime Park" eager /></div>
      <section className="project-gallery section-shell">
        <MediaPicture name="bedroom" alt="Спальня квартиры Prime Park" />
        <MediaPicture name="courtyard" alt="Двор Prime Park" />
        <MediaPicture name="facade" alt="Фасад Prime Park" />
      </section>
      <section className="service-about section-shell">
        <p className="section-index">Единая подача</p>
        <div className="service-about__copy"><h2>От первого кадра до документа.</h2><p>Покупатель видит объект последовательно: сначала получает впечатление от фото и фильма, затем может спокойно изучить детали квартиры, дома и территории в презентации.</p></div>
      </section>
      <section className="project-presentation section-shell">
        <div><img src="/media/presentation-overview.webp" alt="Страницы презентации Prime Park" loading="lazy" /></div>
        <div><p className="section-index">PDF-презентация</p><h2>20 страниц — нормальный объём, когда каждая отвечает на вопрос покупателя.</h2><p>Здесь нет страниц ради количества: объект, комнаты, техника, дом, территория и окружение собраны в понятную историю.</p></div>
      </section>
      <section className="service-cta section-shell"><h2>Нужен такой комплект?</h2><div><p>Соберите нужные форматы и получите предварительную стоимость.</p><Link className="button button--dark" href="/#calculator">Рассчитать стоимость</Link></div></section>
    </main>
  );
}
