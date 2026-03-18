import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-white text-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-white sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            This is a dummy landing page until we have a real one :)
          </h1>
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
          <Link 
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[5] px-5 transition-colors hover:border-transparent hover:bg-[#CCC] md:w-[158px]"
            href="/list-manager">
              List Manager
          </Link>
        </div>
      </main>
    </div>
  );
}
