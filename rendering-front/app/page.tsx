import Link from "next/link";

export default function Home() {
  return (
    <div className="text-3xl font-sans flex flex-row justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Link
        href={"/csrGallery"}
        className="transition duration-300 ease-in-out hover:-translate-y-2 hover:scale-110 hover:text-indigo-500"
      >
        To CSR page
      </Link>
      <Link
        href={"/ssrGallery"}
        className="transition duration-300 ease-in-out hover:-translate-y-2 hover:scale-110 hover:text-indigo-500"
      >
        To SSR page
      </Link>
    </div>
  );
}
