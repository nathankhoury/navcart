import Image from 'next/image';
import Link from 'next/link';
import "./css/styles.css";

{/*
    https://stackoverflow.com/questions/65169431/how-to-set-the-next-image-component-to-100-height    
*/}

export default function TopBar() {
    {/* Return the entire top bar, essentially as an object (component) */}
    return (
        <div id="topbar-wrapper" className="flex items-center gap-3">
            {/* Clicking the logo navigates back to root page */}
            <Link href="/">
                <Image
                    id="topbar-logo"
                    src="/logo.svg"
                    alt="top nav bar"
                    width={200}
                    height={80}
                />
            </Link>
            <Link 
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[5] px-5 transition-colors hover:border-transparent hover:bg-[#58b03f] md:w-[158px]"
            href="/list-manager">
                Manage List
            </Link>
            <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[5] px-5 transition-colors hover:border-transparent hover:bg-[#58b03f] md:w-[158px]"
            href="/store-map">
                Store Map
            </Link>
        </div>
    );
}