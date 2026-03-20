import TopBar from "./topbar";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-white text-black">
      <TopBar/>
      <main className="bg-white">
        <div className="flex gap-6 text-center sm:items-start">
          <p className="font-semibold text-black">
            This is a dummy landing page until we have a real one :)
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[5] px-5 transition-colors hover:border-transparent hover:bg-[#CCC] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation for Next.js
          </a>
        </div>
      </main>
    </div>
  );
}
