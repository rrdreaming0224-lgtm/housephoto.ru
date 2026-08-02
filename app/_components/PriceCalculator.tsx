"use client";

import { useEffect, useMemo, useState } from "react";

type ObjectType = "apartment" | "house" | "commercial";
type VideoType = "none" | "photo-video" | "film" | "host";

const number = new Intl.NumberFormat("ru-RU");

function basePhotoPrice(type: ObjectType, area: number) {
  const tier = area <= 60 ? 0 : area <= 100 ? 1 : area <= 150 ? 2 : 3;
  const prices: Record<ObjectType, number[]> = {
    apartment: [15000, 20000, 25000, 35000],
    house: [25000, 35000, 45000, 60000],
    commercial: [20000, 30000, 40000, 55000],
  };
  return prices[type][tier];
}

export function PriceCalculator({ compact = false }: { compact?: boolean }) {
  const [type, setType] = useState<ObjectType>("apartment");
  const [area, setArea] = useState(60);
  const [outside, setOutside] = useState(false);
  const [video, setVideo] = useState<VideoType>("photo-video");
  const [presentation, setPresentation] = useState(false);
  const [tour, setTour] = useState(false);
  const [rush, setRush] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedFromPage, setSelectedFromPage] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const service = url.searchParams.get("service");
    const labels: Record<string, string> = {
      photo: "Фотосъёмка",
      "video-presentation": "Видеопрезентация",
      "interior-film": "Интерьерный фильм",
      "video-with-host": "Видео с ведущим",
      presentation: "PDF-презентация",
      "3d-tour": "3D-тур",
    };

    const selectionTimer = window.setTimeout(() => {
      if (service && labels[service]) {
        setSelectedFromPage(labels[service]);
        setVideo(
          service === "video-presentation" ? "photo-video" :
            service === "interior-film" ? "film" :
              service === "video-with-host" ? "host" : "none",
        );
        setPresentation(service === "presentation");
        setTour(service === "3d-tour");
      }
    }, 0);

    const scrollTimer = url.hash === "#calculator"
      ? window.setTimeout(() => document.getElementById("calculator")?.scrollIntoView({ block: "start" }), 80)
      : undefined;

    return () => {
      window.clearTimeout(selectionTimer);
      if (scrollTimer) window.clearTimeout(scrollTimer);
    };
  }, []);

  const price = useMemo(() => {
    let total = basePhotoPrice(type, area) + (outside ? 3000 : 0);
    total += { none: 0, "photo-video": 10000, film: 35000, host: 55000 }[video];
    total += presentation ? 15000 : 0;
    total += tour ? 15000 : 0;
    if (rush) total *= 1.3;
    return Math.round(total / 1000) * 1000;
  }, [area, outside, presentation, rush, tour, type, video]);

  return (
    <div className={`calculator ${compact ? "calculator--compact" : ""}`}>
      <div className="calculator__controls">
        {selectedFromPage && <p className="calculator__preselected"><span>Выбрано</span>Услуга «{selectedFromPage}» уже добавлена в расчёт</p>}
        <fieldset>
          <legend>Объект</legend>
          <div className="segmented">
            {[
              ["apartment", "Квартира"],
              ["house", "Дом"],
              ["commercial", "Коммерция"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="object"
                  value={value}
                  checked={type === value}
                  onChange={() => setType(value as ObjectType)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="area-field">
          <legend>Площадь</legend>
          <div className="area-field__value">{area} м²</div>
          <input
            aria-label="Площадь объекта"
            type="range"
            min="30"
            max="300"
            step="10"
            value={area}
            onChange={(event) => setArea(Number(event.target.value))}
          />
          <div className="range-labels"><span>30</span><span>300 м²</span></div>
        </fieldset>

        <fieldset>
          <legend>Как показать объект</legend>
          <div className="service-options">
            {[
              ["none", "Только фотографии", "от 1 дня"],
              ["photo-video", "Видео из фотографий", "+10 000 ₽ · 1 день"],
              ["film", "Интерьерный фильм", "от +35 000 ₽ · 2 дня"],
              ["host", "Видео с ведущим", "от +55 000 ₽ · по сценарию"],
            ].map(([value, label, note]) => (
              <label key={value} className="service-option">
                <input
                  type="radio"
                  name="video"
                  value={value}
                  checked={video === value}
                  onChange={() => setVideo(value as VideoType)}
                />
                <span className="service-option__mark" />
                <span><b>{label}</b><small>{note}</small></span>
                {value !== "none" && (
                  <a href={`/uslugi/${value === "photo-video" ? "video-presentation" : value === "film" ? "interior-film" : "video-with-host"}`}>Что это?</a>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Дополнительно</legend>
          <div className="check-grid">
            <label><input type="checkbox" checked={presentation} onChange={(e) => setPresentation(e.target.checked)} /><span>PDF-презентация <small>+15 000 ₽</small></span></label>
            <label><input type="checkbox" checked={tour} onChange={(e) => setTour(e.target.checked)} /><span>3D-тур <small>от +15 000 ₽</small></span></label>
            <label><input type="checkbox" checked={outside} onChange={(e) => setOutside(e.target.checked)} /><span>Московская область <small>от +3 000 ₽</small></span></label>
            <label><input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} /><span>Срочная готовность <small>+30%</small></span></label>
          </div>
        </fieldset>
      </div>

      <aside className="calculator__result">
        <p>Предварительная стоимость</p>
        <strong>от {number.format(price)} ₽</strong>
        <ul>
          <li>Профессиональная фотосъёмка включена</li>
          <li>Подготовка файлов для площадок</li>
          <li>Москва и область</li>
        </ul>
        {!showLead ? (
          <button className="button button--dark" onClick={() => setShowLead(true)}>Получить точный расчёт</button>
        ) : (
          <form
            className="lead-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <label>Как с вами связаться<input required name="contact" placeholder="Телефон или @username" /></label>
            <label>Адрес или ЖК<input name="address" placeholder="Например, Prime Park" /></label>
            <button className="button button--dark" type="submit">Отправить расчёт</button>
            {sent && <p className="form-note">Заявка собрана. Перед публикацией подключим её к вашему Telegram.</p>}
          </form>
        )}
        <small>Точная цена зависит от планировки, удалённости и задачи. Никаких скрытых услуг после съёмки.</small>
      </aside>
    </div>
  );
}
