import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceExperience } from "../../_components/ServiceExperience";
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
  return <ServiceExperience service={service} />;
}
