import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://housephoto.ru"),
  title: {
    default: "HousePhoto — съёмка недвижимости в Москве",
    template: "%s — HousePhoto",
  },
  description:
    "Фотографии, видео и презентации для продажи и аренды недвижимости в Москве и области. Готовность материалов — от одного дня.",
  keywords: [
    "фотосъёмка недвижимости",
    "видеосъёмка недвижимости",
    "Москва",
    "съёмка квартиры для продажи",
    "презентация недвижимости",
  ],
  openGraph: {
    title: "HousePhoto — показываем недвижимость так, чтобы её хотелось увидеть вживую",
    description: "Фото, видео и презентации для продажи и аренды недвижимости.",
    type: "website",
    locale: "ru_RU",
    siteName: "HousePhoto",
    images: [{ url: "/media/hero-1600.webp", width: 1600, height: 1200 }],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1e9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
