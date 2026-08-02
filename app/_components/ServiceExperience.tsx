import Link from "next/link";
import { InnerHeader } from "./InnerHeader";
import { MediaPicture } from "./MediaPicture";
import type { Service } from "../_data/services";

const presentationFrames = [
  ["cover", "Обложка и позиционирование"],
  ["context", "Дом и окружение"],
  ["grounds", "Территория"],
  ["lobby", "Входная группа"],
  ["interior", "Интерьер"],
  ["bathroom", "Детали объекта"],
] as const;

function ServiceExample({ service }: { service: Service }) {
  if (service.slug === "photo") {
    return (
      <section className="service-showcase service-showcase--photo" id="example" aria-label="Пример фотосъёмки">
        <div className="photo-board photo-board--main"><MediaPicture name="bedroom" alt="Спальня с панорамным видом" eager /><span>01 / Свет и объём</span></div>
        <div className="photo-board"><MediaPicture name="hero" alt="Гостиная квартиры" /><span>02 / Планировка</span></div>
        <div className="photo-board"><MediaPicture name="facade" alt="Фасад жилого комплекса" /><span>03 / Дом</span></div>
        <div className="photo-board"><MediaPicture name="courtyard" alt="Территория жилого комплекса" /><span>04 / Окружение</span></div>
      </section>
    );
  }

  if (service.slug === "presentation") {
    return (
      <section className="service-showcase service-showcase--presentation" id="example" aria-labelledby="presentation-example-title">
        <div className="presentation-example__head section-shell">
          <p className="section-index">Реальный пример</p>
          <div><h2 id="presentation-example-title">Не просто фотографии в PDF.<br />Цельная история объекта.</h2><p>Фрагменты презентации Prime Park: от первого впечатления до окружения, входной группы и деталей квартиры.</p></div>
        </div>
        <div className="presentation-pages" aria-label="Фрагменты презентации Prime Park">
          {presentationFrames.map(([name, caption], index) => (
            <figure key={name}>
              <img src={`/media/presentation-${name}.webp`} alt={`${caption} — страница презентации Prime Park`} loading={index < 2 ? "eager" : "lazy"} />
              <figcaption><span>0{index + 1}</span>{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  if (service.slug === "3d-tour") {
    return (
      <section className="service-showcase service-showcase--tour" id="example">
        <div className="tour-demo">
          <MediaPicture name="hero" alt="Пример панорамного просмотра гостиной" eager />
          <div className="tour-demo__veil" />
          <span className="tour-hotspot tour-hotspot--one"><i /><span>Спальня</span></span>
          <span className="tour-hotspot tour-hotspot--two"><i /><span>Кухня</span></span>
          <div className="tour-demo__hint"><b>360°</b><span>Наведите на точки перехода</span></div>
        </div>
      </section>
    );
  }

  const isPhotoVideo = service.slug === "video-presentation";
  const isHost = service.slug === "video-with-host";
  return (
    <section className={`service-showcase service-showcase--film ${isHost ? "service-showcase--host" : ""}`} id="example">
      <a className="film-example" href={service.exampleUrl} target="_blank" rel="noreferrer" aria-label={service.exampleLabel}>
        <MediaPicture name={service.image} alt={`Кадр: ${service.title.toLowerCase()}`} eager />
        <span className="film-example__veil" />
        <span className="film-example__play"><i>▶</i><b>{service.exampleLabel}</b></span>
        <span className="film-example__time">00:00 — {isHost ? "03:00" : isPhotoVideo ? "01:00" : "01:42"}</span>
        {isPhotoVideo && <span className="film-example__motion"><i /><i /><i /></span>}
        {isHost && (
          <span className="host-script">
            <small>Фрагмент сценария</small>
            <b>Сначала — главная причина приехать на просмотр.</b>
            <em>Ведущий объясняет объект, кадры подтверждают рассказ.</em>
          </span>
        )}
      </a>
    </section>
  );
}

export function ServiceExperience({ service }: { service: Service }) {
  const calculatorHref = `/?service=${service.slug}&skipIntro=1#calculator`;

  return (
    <main className={`service-page service-page--${service.slug}`}>
      <InnerHeader />
      <section className="service-hero">
        <div>
          <p className="service-hero__crumb"><Link href="/?skipIntro=1">Главная</Link> / {service.eyebrow}</p>
          <h1>{service.title}</h1>
        </div>
        <div className="service-hero__side">
          <p>{service.summary}</p>
          <div className="service-meta">
            <div><span>Стоимость</span><b>{service.price}</b></div>
            <div><span>Готовность</span><b>{service.timing}</b></div>
            {service.length && <div><span>Хронометраж</span><b>{service.length}</b></div>}
          </div>
          <a className="arrow-link service-hero__anchor" href="#what"><span>Понять формат</span><span>↓</span></a>
        </div>
      </section>

      <ServiceExample service={service} />

      <section className="service-meaning section-shell" id="what">
        <p className="section-index">Что это и зачем</p>
        <div className="service-meaning__body">
          <h2>{service.purpose}</h2>
          <div className="service-result"><span>Что меняется для покупателя</span><p>{service.result}</p></div>
        </div>
      </section>

      <section className="service-includes section-shell">
        <div className="service-includes__head"><p className="section-index">Что вы получите</p><h2>Готовый материал,<br />а не набор исходников.</h2></div>
        <div className="deliverables__grid">
          {service.deliverables.map((item, index) => (
            <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>
          ))}
        </div>
      </section>

      <section className="service-fit section-shell">
        <p className="section-index">Когда подходит</p>
        <div>
          <h2>Формат особенно полезен, если…</h2>
          <ul>{service.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="service-steps section-shell">
        <p className="section-index">Как создаём</p>
        <ol>
          {service.steps.map((step, index) => (
            <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="service-faq section-shell">
        <div><p className="section-index">Коротко о главном</p><h2>Вопросы об услуге</h2></div>
        <div>
          {service.faqs.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary><span>0{index + 1}</span><b>{item.question}</b><i>+</i></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="service-cta section-shell">
        <h2>Посчитаем этот формат<br />для вашего объекта?</h2>
        <div>
          <p>В калькуляторе услуга уже будет выбрана. Останется указать тип объекта, площадь и при необходимости добавить другие материалы.</p>
          <Link className="button button--dark" href={calculatorHref}>Рассчитать с этой услугой</Link>
        </div>
      </section>
    </main>
  );
}
