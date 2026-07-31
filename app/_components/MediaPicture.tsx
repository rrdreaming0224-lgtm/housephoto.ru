type MediaPictureProps = {
  name: "hero" | "bedroom" | "facade" | "courtyard";
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
};

export function MediaPicture({
  name,
  alt,
  className,
  eager = false,
  sizes = "100vw",
}: MediaPictureProps) {
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={`/media/${name}-900.avif 900w, /media/${name}-1600.avif 1600w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`/media/${name}-900.webp 900w, /media/${name}-1600.webp 1600w`}
        sizes={sizes}
      />
      <img
        src={`/media/${name}-1600.webp`}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
      />
    </picture>
  );
}
