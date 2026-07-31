import type { Metadata } from "next";
import { HomeExperience } from "./_components/HomeExperience";

export const metadata: Metadata = {
  title: "Фото и видео недвижимости в Москве",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeExperience />;
}
