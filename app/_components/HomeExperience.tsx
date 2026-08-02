"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { MediaPicture } from "./MediaPicture";
import { PriceCalculator } from "./PriceCalculator";

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

const processSteps = [
  {
    number: "01",
    title: "Согласуем задачу",
    copy: "Адрес, площадь, сроки и нужные форматы. Стоимость известна заранее.",
    note: "Обычно 10–15 минут в переписке",
    image: "facade" as const,
  },
  {
    number: "02",
    title: "Снимем объект",
    copy: "Фотосъёмка занимает 2–3 часа. При необходимости работаем без собственника.",
    note: "Можно просто передать ключи",
    image: "hero" as const,
  },
  {
    number: "03",
    title: "Передадим готовое",
    copy: "Два комплекта фото и остальные материалы — одной аккуратной ссылкой.",
    note: "Фото — на следующий день",
    image: "bedroom" as const,
  },
];

function ProcessShowcase() {
  const [active, setActive] = useState(0);
  const step = processSteps[active];

  return (
    <div className="process-showcase">
      <div className="process-showcase__visual" aria-live="polite">
        {processSteps.map((item, index) => (
          <MediaPicture key={item.number} name={item.image} alt="" className={index === active ? "is-active" : ""} />
        ))}
        <span className="process-showcase__count">{step.number} / 03</span>
        <span className="process-showcase__note">{step.note}</span>
      </div>
      <ol className="process-list">
        {processSteps.map((item, index) => (
          <li className={index === active ? "is-active" : ""} key={item.number}>
            <button
              type="button"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
            >
              <span>{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.copy}</p></div>
              <i>↗</i>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function IntroLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const chosenRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    const track = trackRef.current;
    const chosen = chosenRef.current;
    const cover = coverRef.current;
    const brand = brandRef.current;
    const status = statusRef.current;
    if (!loader || !track || !chosen || !cover || !brand || !status) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipRequested = new URLSearchParams(window.location.search).get("skipIntro") === "1";
    const seen = window.localStorage.getItem("housephoto-intro-v1") || window.sessionStorage.getItem("housephoto-intro");
    if (seen || skipRequested || reduced) {
      if (seen || skipRequested) window.localStorage.setItem("housephoto-intro-v1", "seen");
      loader.style.display = "none";
      return;
    }

    document.documentElement.classList.remove("intro-skip");
    window.localStorage.setItem("housephoto-intro-v1", "seen");
    document.documentElement.classList.add("intro-running");

    let cancelled = false;
    let cleanupAnimation: (() => void) | undefined;

    void import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;

      const centerChosen = () => window.innerWidth / 2 - (chosen.offsetLeft + chosen.offsetWidth / 2);
      const cards = Array.from(track.querySelectorAll<HTMLElement>(".intro-card"));
      const loadingLine = loader.querySelector<HTMLElement>(".intro__loading-line");
      const rect = chosen.getBoundingClientRect();
      const centeredLeft = (window.innerWidth - rect.width) / 2;

      gsap.set(track, { x: centerChosen() + Math.min(180, window.innerWidth * 0.18), opacity: 0 });
      gsap.set(cards, { opacity: 0, y: 22 });
      gsap.set(cover, {
        opacity: 0,
        "--clip-top": `${rect.top}px`,
        "--clip-right": `${centeredLeft}px`,
        "--clip-bottom": `${window.innerHeight - rect.bottom}px`,
        "--clip-left": `${centeredLeft}px`,
        "--clip-radius": "6px",
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("intro-running");
        },
      });

      timeline
        .to(loadingLine, { opacity: 0, duration: 0.16, ease: "none" }, 0)
        .set(track, { opacity: 1 })
        .to(cards, { opacity: 1, y: 0, duration: 0.42, stagger: 0.055, ease: "power2.out" }, 0)
        .to(track, { x: centerChosen(), duration: 0.92, ease: "power3.inOut" }, 0.06)
        .to(cover, { opacity: 1, duration: 0.18, ease: "none" }, 0.86)
        .to([track, brand, status], { opacity: 0, duration: 0.24, ease: "power2.out" }, 0.88)
        .to(cover, {
          "--clip-top": "0px",
          "--clip-right": "0px",
          "--clip-bottom": "0px",
          "--clip-left": "0px",
          "--clip-radius": "0px",
          duration: 1.08,
          ease: "expo.inOut",
        }, 0.96)
        .to(loader, { opacity: 0, duration: 0.4, ease: "power2.out" }, 1.98)
        .set(loader, { display: "none" });

      cleanupAnimation = () => timeline.kill();
    }).catch(() => {
      loader.style.display = "none";
      document.documentElement.classList.remove("intro-running");
    });

    return () => {
      cancelled = true;
      cleanupAnimation?.();
      document.documentElement.classList.remove("intro-running");
    };
  }, []);

  const loaderImages = ["bedroom", "courtyard", "hero", "facade", "bedroom", "courtyard"];

  return (
    <div className="intro" ref={loaderRef} aria-hidden="true">
      <div className="intro__brand" ref={brandRef}>HOUSEPHOTO</div>
      <i className="intro__loading-line" />
      <div className="intro__track" ref={trackRef}>
        {loaderImages.map((image, index) => (
          <div className="intro-card" ref={index === 2 ? chosenRef : undefined} key={`${image}-${index}`}>
            <img src={`/media/${image}-900.webp`} alt="" />
          </div>
        ))}
      </div>
      <div className="intro__cover" ref={coverRef}><img src="/media/hero-1600.webp" alt="" /></div>
      <div className="intro__status" ref={statusRef}><span>Москва</span><span>Фото · видео · презентации</span></div>
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
  const [photoIndex, setPhotoIndex] = useState(0);

  useLayoutEffect(() => {
    let cancelled = false;
    let cleanupAnimation: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollTriggerModule]) => {
      if (cancelled || !rootRef.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;

        const introIsRunning = document.documentElement.classList.contains("intro-running");
        gsap.from(".hero__eyebrow, .hero__title, .hero__bottom", {
          opacity: 0,
          y: 28,
          duration: 1,
          stagger: 0.12,
          delay: introIsRunning ? 1.7 : 0.15,
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

        const slider = rootRef.current?.querySelector<HTMLElement>(".photo-slider");
        const track = rootRef.current?.querySelector<HTMLElement>(".photo-slider__track");
        const current = rootRef.current?.querySelector<HTMLElement>(".photo-slider__current");
        const progress = rootRef.current?.querySelector<HTMLElement>(".photo-slider__progress i");
        const media = gsap.matchMedia();

        media.add("(min-width: 901px)", () => {
          if (!slider || !track) return;
          gsap.to(track, {
            xPercent: -66.6667,
            ease: "none",
            scrollTrigger: {
              trigger: slider,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
              onUpdate: (self) => {
                if (current) current.textContent = String(Math.min(3, Math.floor(self.progress * 3) + 1)).padStart(2, "0");
                if (progress) gsap.set(progress, { scaleY: self.progress });
              },
            },
          });
          gsap.utils.toArray<HTMLElement>(".photo-slide img").forEach((image) => {
            gsap.fromTo(image, { scale: 1.07 }, { scale: 1, ease: "none", scrollTrigger: { trigger: slider, start: "top top", end: "bottom bottom", scrub: true } });
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
      }, rootRef);

      cleanupAnimation = () => context.revert();
    });

    return () => {
      cancelled = true;
      cleanupAnimation?.();
    };
  }, []);

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

      <section className="photo-slider" aria-label="Пример фотосъёмки объекта">
        <div className="photo-slider__sticky">
          <div
            className="photo-slider__track"
            onScroll={(event) => {
              const track = event.currentTarget;
              if (window.innerWidth <= 900) setPhotoIndex(Math.round(track.scrollLeft / track.clientWidth));
            }}
          >
        <article className="photo-slide">
          <MediaPicture name="facade" alt="Фасад жилого комплекса Prime Park" />
          <span>Фасад</span><b>01</b>
        </article>
        <article className="photo-slide">
          <MediaPicture name="bedroom" alt="Спальня с панорамным окном" />
          <span>Интерьер</span><b>02</b>
        </article>
        <article className="photo-slide">
          <MediaPicture name="courtyard" alt="Благоустроенный двор с фонтаном" />
          <span>Окружение</span><b>03</b>
        </article>
          </div>
          <div className="photo-slider__ui"><span><b className="photo-slider__current">{String(photoIndex + 1).padStart(2, "0")}</b> / 03</span><i className="photo-slider__progress"><i /></i><small>Листайте</small></div>
        </div>
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

      <section className="process section-shell" id="process">
        <p className="section-index">04 / Как работаем</p>
        <div className="process__head" data-reveal>
          <h2>Можно просто передать ключи.</h2>
          <p>Ваше присутствие не требуется. До съёмки согласуем задачу и пришлём короткий чек-лист подготовки.</p>
        </div>
        <ProcessShowcase />
      </section>

      <section className="calculator-section section-shell" id="calculator">
        <p className="section-index">05 / Стоимость</p>
        <div className="calculator-section__head" data-reveal>
          <h2>Соберите комплект<br />для вашего объекта.</h2>
          <p>Сначала выберите задачу — цена будет понятна до заявки. Если формат незнаком, рядом есть короткое объяснение и пример.</p>
        </div>
        <PriceCalculator />
      </section>

      <section className="proof section-shell">
        <p className="section-index">06 / Без обещаний на словах</p>
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
          <p className="section-index">07 / Вопросы</p>
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
        <div><a href="#formats">Услуги</a><a href="#process">Как работаем</a><a href="#calculator">Стоимость</a></div>
        <div><span>Контакт подключим перед публикацией</span><a href="#calculator">Оставить заявку ↗</a></div>
        <small>© {new Date().getFullYear()} HousePhoto</small>
      </footer>
    </main>
  );
}
