import Image from "next/image";
import Link from "next/link";

export default async function GallerySSR() {
  const imgCount = 25;
  const photos = await fetchImages(imgCount);

  async function fetchImage() {
    const res = await fetch("http://localhost:8080/image", {
      cache: "no-store",
    });
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  }

  async function fetchImages(count: number) {
    return Promise.all(Array.from({ length: count }).map(() => fetchImage()));
  }
  if (!photos) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center items-center p-25 h-dvh">
      <h2 className="pb-20 text-2xl">Galeria zdjęć (CSR, 25 zdjęć)</h2>
      <div className="flex flex-wrap gap-2.5">
        {photos.map((src, idx) => (
          <Image
            key={idx}
            id={idx === photos.length - 1 ? "image-loaded" : undefined}
            src={src}
            alt={`Obrazek ${idx + 1}`}
            width={120}
            height={90}
          />
        ))}
        <Link
          href={"/"}
          className="transition duration-300 ease-in-out 
          hover:-translate-y-2 hover:scale-110 hover:text-indigo-500"
        >
          Powrót do strony głównej
        </Link>
      </div>
    </div>
  );
}


