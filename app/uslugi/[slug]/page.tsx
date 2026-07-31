import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InnerHeader } from "../../_components/InnerHeader";
import { MediaPicture } from "../../_components/MediaPicture";
import { getService, services } from "../../_data/services";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.title,
    description: `${service.summary} ${service.price}, готовность: ${service.timing}. Москва и Московская область.`,
    alternates: { canonical: `/uslugi/${service.slug}` },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = getService((await params).slug);
  if (!service) notFound();

  return (
    <main className="service-page">
      <InnerHeader />
      <section className="service-hero">
        <div>
          <p className="service-hero__crumb"><Link href="/">Главная</Link> / {service.eyebrow}</p>
          <h1>{service.title}</h1>
        </div>
        <div className="service-hero__side">
          <p>{service.summary}</p>
          <div className="service-meta">
            <div><span>Стоимость</span><b>{service.price}</b></div>
            <div><span>Готовность</span><b>{service.timing}</b></div>
          </div>
        </div>
      </section>
      <div className="service-example">
        <MediaPicture name={service.image} alt={`Пример: ${service.title.toLowerCase()}`} eager />
      </div>
      <section className="service-about section-shell">
        <p className="section-index">Зачем нужен формат</p>
        <div className="service-about__copy">
          <h2>Сначала — понятный пример. Потом цена.</h2>
          <p>{service.purpose}</p>
        </div>
      </section>
      <section className="deliverables section-shell">
        <p className="section-index">Что вы получите</p>
        <div className="deliverables__grid">
          {service.deliverables.map((item, index) => (
            <div key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></div>
          ))}
        </div>
      </section>
      <section className="service-cta section-shell">
        <h2>Подходит вашему объекту?</h2>
        <div>
          <p>Выберите площадь и остальные услуги — калькулятор покажет предварительную стоимость до заявки.</p>
          <Link className="button button--dark" href="/#calculator">Рассчитать стоимость</Link>
        </div>
      </section>
    </main>
  );
}
