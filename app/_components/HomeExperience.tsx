"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaPicture } from "./MediaPicture";
import { PriceCalculator } from "./PriceCalculator";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const videoFormats = [
  {
    slug: "video-presentation",
    number: "01",
    title: "Видеопрезентация",
    copy: "Движение и атмосфера без отдельного съёмочного дня.",
    meta: "1 минута · готово вместе с фото · +10 000 ₽",
    image: "hero" as const,
  },
  {
    slug: "interior-film",
    number: "02",
    title: "Интерьерный фильм",
    copy: "Ручная съёмка маршрута, света и деталей объекта.",
    meta: "1–2 минуты · готовность 2 дня · от 35 000 ₽",
    image: "bedroom" as const,
  },
  {
    slug: "video-with-host",
    number: "03",
    title: "Видео с ведущим",
    copy: "Живой рассказ об объекте по заранее подготовленному сценарию.",
    meta: "1–3 минуты · сценарий включён · от 55 000 ₽",
    image: "courtyard" as const,
  },
];

const faqs = [
  ["Нужно ли присутствовать на съёмке?", "Нет. Можно передать ключи — мы самостоятельно снимем объект, закроем его и отправим готовые материалы."],
  ["Сколько фотографий я получу?", "Обычно 2–3 сильных кадра на каждую комнату, плюс фасад, территория, входная группа и вид из окна."],
  ["Когда будут готовы материалы?", "Фотографии и видеопрезентация — на следующий день. Интерьерный фильм и PDF-презентация — за 2 дня."],
  ["Что нужно подготовить?", "Объект должен быть чистым и готовым к показу. Перед съёмкой пришлём короткий чек-лист и поможем убрать из кадра всё лишнее."],
  ["Можно внести правки?", "Да. Включён один раунд коррекции фотографий и два раунда правок видео или презентации."],
];

function IntroLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const chosenRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    const track = trackRef.current;
    const chosen = chosenRef.current;
    if (!loader || !track || !chosen) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem("housephoto-intro");
    if (seen || reduced) {
      gsap.set(loader, { display: "none" });
      return;
    }

    document.documentElement.classList.add("intro-running");
    const centerChosen = () => window.innerWidth / 2 - (chosen.offsetLeft + chosen.offsetWidth / 2);

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        window.sessionStorage.setItem("housephoto-intro", "seen");
        document.documentElement.classList.remove("intro-running");
      },
    });

    timeline
      .fromTo(".intro-card", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 })
      .fromTo(track, { x: centerChosen() + 180 }, { x: centerChosen(), duration: 0.9 }, 0.12)
      .add(() => {
        const rect = chosen.getBoundingClientRect();
        const clone = chosen.cloneNode(true) as HTMLDivElement;
        clone.classList.add("intro-card--clone");
        Object.assign(clone.style, {
          position: "fixed",
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          margin: "0",
          zIndex: "3",
        });
        loader.appendChild(clone);
        gsap.to(track, { opacity: 0, duration: 0.3 });
        gsap.to(clone, {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 1.05,
          ease: "expo.inOut",
          onComplete: () => clone.remove(),
        });
      })
      .to(loader, { opacity: 0, duration: 0.38, delay: 0.9, display: "none" });

    return () => {
      timeline.kill();
      document.documentElement.classList.remove("intro-running");
    };
  }, []);

  const loaderImages = ["bedroom", "courtyard", "hero", "facade", "bedroom", "courtyard"];

  return (
    <div className="intro" ref={loaderRef} aria-hidden="true">
      <div className="intro__brand">HOUSEPHOTO</div>
      <div className="intro__track" ref={trackRef}>
        {loaderImages.map((image, index) => (
          <div className="intro-card" ref={index === 2 ? chosenRef : undefined} key={`${image}-${index}`}>
            <img src={`/media/${image}-900.webp`} alt="" />
          </div>
        ))}
      </div>
      <div className="intro__status"><span>Москва</span><span>Фото · видео · презентации</span></div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header ${open ? "is-open" : ""}`}>
      <Link className="wordmark" href="/" aria-label="HousePhoto — главная">HOUSEPHOTO</Link>
      <nav aria-label="Главная навигация">
        <a href="#formats">Форматы</a>
        <a href="#case">Проект</a>
        <a href="#process">Как работаем</a>
        <a href="#faq">Вопросы</a>
      </nav>
      <a className="header-cta" href="#calculator">Рассчитать стоимость <span>↗</span></a>
      <button className="menu-button" aria-label="Открыть меню" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
    </header>
  );
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="arrow-link" href={href}><span>{children}</span><span>↗</span></Link>;
}

export function HomeExperience() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.from(".hero__eyebrow, .hero__title, .hero__bottom", {
      opacity: 0,
      y: 28,
      duration: 1,
      stagger: 0.12,
      delay: 1.7,
      ease: "power3.out",
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 54,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 84%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>(".photo-frame img").forEach((image) => {
      gsap.fromTo(image, { scale: 1.08 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: image.closest(".photo-frame"), start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    const statement = gsap.timeline({
      scrollTrigger: {
        trigger: ".statement-stage",
        start: "top top",
        end: "+=130%",
        scrub: 0.5,
        pin: ".statement-stage__inner",
      },
    });
    statement
      .fromTo(".statement--photo", { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: 0.35 })
      .to(".statement--photo", { opacity: 0, y: -35, duration: 0.25 }, "+=0.3")
      .fromTo(".statement--video", { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: 0.35 })
      .to(".statement-stage__line", { scaleX: 1, duration: 1 }, 0);

    gsap.from(".video-card", {
      opacity: 0,
      y: 80,
      stagger: 0.12,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".video-grid", start: "top 78%", once: true },
    });
  }, { scope: rootRef });

  return (
    <main ref={rootRef}>
      <IntroLoader />
      <Header />

      <section className="hero" aria-labelledby="hero-title">
        <MediaPicture name="hero" alt="Гостиная квартиры в Prime Park, снятая HousePhoto" className="hero__media" eager />
        <div className="hero__veil" />
        <p className="hero__eyebrow">Студия съёмки недвижимости · Москва</p>
        <h1 className="hero__title" id="hero-title">Показываем недвижимость так,<br />чтобы её хотелось увидеть <i>вживую.</i></h1>
        <div className="hero__bottom">
          <a className="button button--light" href="#calculator">Рассчитать стоимость</a>
          <p>Фото — на следующий день<br />Полный комплект — за 1–2 дня</p>
        </div>
        <div className="scroll-cue"><span>Листайте</span><i /></div>
      </section>

      <section className="recognition section-shell">
        <p className="section-index">01 / Задача</p>
        <div className="recognition__copy" data-reveal>
          <h2>До первого просмотра покупатель знакомится не с объектом — а с его объявлением.</h2>
          <div>
            <p>По нему он решает: пролистать дальше или захотеть увидеть недвижимость вживую.</p>
            <p>Наша задача — сделать так, чтобы ваш объект заметили.</p>
          </div>
        </div>
      </section>

      <section className="photo-flow" aria-label="Пример фотосъёмки объекта">
        <article className="photo-frame">
          <MediaPicture name="facade" alt="Фасад жилого комплекса Prime Park" />
          <span>Фасад</span><b>01</b>
        </article>
        <article className="photo-frame">
          <MediaPicture name="bedroom" alt="Спальня с панорамным окном" />
          <span>Интерьер</span><b>02</b>
        </article>
        <article className="photo-frame">
          <MediaPicture name="courtyard" alt="Благоустроенный двор с фонтаном" />
          <span>Окружение</span><b>03</b>
        </article>
      </section>

      <section className="dark-chapter" id="formats">
        <div className="statement-stage">
          <div className="statement-stage__inner">
            <p className="statement statement--photo">Фотографии позволяют<br />рассмотреть объект.</p>
            <p className="statement statement--video">Видео помогает почувствовать пространство<br />и удерживает внимание.</p>
            <i className="statement-stage__line" />
          </div>
        </div>

        <div className="formats-head section-shell">
          <p className="section-index section-index--dark">02 / Три видеоформата</p>
          <div data-reveal>
            <h2>Один объект.<br />Три способа вызвать интерес.</h2>
            <p>Наведение раскрывает формат. После загрузки ваших роликов все три будут идти одновременно — без звука и без тяжёлых YouTube-вставок.</p>
          </div>
        </div>

        <div className="video-grid">
          {videoFormats.map((format) => (
            <Link href={`/uslugi/${format.slug}`} className="video-card" key={format.slug}>
              <MediaPicture name={format.image} alt="" className="video-card__media" sizes="(min-width: 900px) 34vw, 88vw" />
              <span className="video-card__shade" />
              <span className="video-card__number">{format.number}</span>
              <span className="video-card__play">▶</span>
              <span className="video-card__copy">
                <strong>{format.title}</strong>
                <em>{format.copy}</em>
                <small>{format.meta}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="study-tools section-shell">
        <p className="section-index">03 / Изучить подробнее</p>
        <div className="study-tools__intro" data-reveal>
          <h2>Всё, что помогает покупателю принять решение до просмотра.</h2>
          <p>Видео создаёт первое впечатление. Презентация и 3D-тур дают вернуться к деталям, сравнить и отправить объект близким.</p>
        </div>
        <div className="study-grid">
          <article className="presentation-card" data-reveal>
            <div className="presentation-card__visual">
              <img src="/media/presentation-overview.webp" alt="Страницы PDF-презентации квартиры в Prime Park" loading="lazy" />
            </div>
            <div className="study-card__copy">
              <span>PDF / Презентация</span>
              <h3>Объект, собранный в ясную историю.</h3>
              <p>Фотографии, преимущества, планировка и окружение — в одном документе, который удобно переслать.</p>
              <ArrowLink href="/uslugi/presentation">Посмотреть формат</ArrowLink>
            </div>
          </article>
          <article className="tour-card" data-reveal>
            <div className="tour-card__visual">
              <MediaPicture name="hero" alt="Панорамный просмотр гостиной" />
              <span className="tour-target tour-target--one" /><span className="tour-target tour-target--two" />
              <b>360°</b>
            </div>
            <div className="study-card__copy">
              <span>3D / Виртуальный тур</span>
              <h3>Свободный просмотр из любой точки.</h3>
              <p>Покупатель сам проходит по объекту и понимает планировку до личной встречи.</p>
              <ArrowLink href="/uslugi/3d-tour">Посмотреть формат</ArrowLink>
            </div>
          </article>
        </div>
      </section>

      <section className="case-section" id="case">
        <div className="case-section__top section-shell">
          <p className="section-index">04 / Проект целиком</p>
          <div data-reveal>
            <p className="case-label">Prime Park · Москва</p>
            <h2>Один объект — единая система материалов.</h2>
          </div>
        </div>
        <div className="case-hero">
          <MediaPicture name="bedroom" alt="Спальня квартиры Prime Park" />
          <div className="case-hero__caption"><span>Фотосъёмка</span><span>Интерьерный фильм</span><span>PDF-презентация</span></div>
        </div>
        <div className="case-facts section-shell">
          <div><b>01</b><p>Сняли интерьер, фасад, территорию и вид из окон.</p></div>
          <div><b>02</b><p>Показали маршрут по квартире в ручном интерьерном фильме.</p></div>
          <div><b>03</b><p>Собрали объект и его окружение в 20-страничную презентацию.</p></div>
          <ArrowLink href="/proekty/prime-park">Открыть весь проект</ArrowLink>
        </div>
      </section>

      <section className="process section-shell" id="process">
        <p className="section-index">05 / Как работаем</p>
        <div className="process__head" data-reveal>
          <h2>Можно просто передать ключи.</h2>
          <p>Ваше присутствие не требуется. До съёмки согласуем задачу и пришлём короткий чек-лист подготовки.</p>
        </div>
        <ol className="process-list">
          <li><span>01</span><div><h3>Согласуем задачу</h3><p>Адрес, площадь, сроки и нужные форматы. Стоимость известна заранее.</p></div></li>
          <li><span>02</span><div><h3>Снимем объект</h3><p>Фотосъёмка занимает 2–3 часа. При необходимости работаем без собственника.</p></div></li>
          <li><span>03</span><div><h3>Передадим готовое</h3><p>Два комплекта фото — в высоком разрешении и для площадок. Остальные материалы — одной ссылкой.</p></div></li>
        </ol>
      </section>

      <section className="calculator-section section-shell" id="calculator">
        <p className="section-index">06 / Стоимость</p>
        <div className="calculator-section__head" data-reveal>
          <h2>Соберите комплект<br />для вашего объекта.</h2>
          <p>Сначала выберите задачу — цена будет понятна до заявки. Если формат незнаком, рядом есть короткое объяснение и пример.</p>
        </div>
        <PriceCalculator />
      </section>

      <section className="proof section-shell">
        <p className="section-index">07 / Без обещаний на словах</p>
        <div className="proof__head" data-reveal>
          <h2>Смотрите реальные материалы до заказа.</h2>
          <p>Не будем обещать абстрактную «конверсию». Покажем, как выглядит результат, сколько занимает работа и что именно вы получите.</p>
        </div>
        <div className="proof-grid">
          <div><b>2–3</b><span>сильных кадра<br />на комнату</span></div>
          <div><b>1 день</b><span>фотографии и<br />видеопрезентация</span></div>
          <div><b>2 дня</b><span>ручное видео и<br />PDF-презентация</span></div>
          <div><b>2 круга</b><span>правок для видео<br />и презентации</span></div>
        </div>
      </section>

      <section className="faq section-shell" id="faq">
        <div className="faq__sticky">
          <p className="section-index">08 / Вопросы</p>
          <h2>Всё, что обычно<br />спрашивают до съёмки.</h2>
          <p>Если вашего вопроса нет — напишите. Ответим по задаче, без длинного брифа.</p>
        </div>
        <div className="faq__list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span><b>{question}</b><i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta" id="contact">
        <MediaPicture name="facade" alt="Архитектура жилого комплекса Prime Park" className="final-cta__media" />
        <div className="final-cta__veil" />
        <div className="final-cta__content">
          <p>Следующая свободная съёмка</p>
          <h2>Покажем ваш объект<br />так, как он того стоит.</h2>
          <a className="button button--light" href="#calculator">Рассчитать стоимость</a>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <div className="wordmark wordmark--footer">HOUSEPHOTO</div>
        <div><span>Москва и Московская область</span><span>Фото · видео · презентации недвижимости</span></div>
        <div><a href="#formats">Услуги</a><a href="#case">Проекты</a><a href="#calculator">Стоимость</a></div>
        <div><span>Контакт подключим перед публикацией</span><a href="#calculator">Оставить заявку ↗</a></div>
        <small>© {new Date().getFullYear()} HousePhoto</small>
      </footer>
    </main>
  );
}
