import Image from 'next/image';
import "./css/styles.css";

{/*
    https://stackoverflow.com/questions/65169431/how-to-set-the-next-image-component-to-100-height    
*/}

export default function TopBar() {
    return (
        <div id="topbar-wrapper" className="flex items-center gap-3">
            <Image
                id="topbar-logo"
                src="/logo.svg"
                alt="top nav bar"
                width={120}
                height={40}
            />
            <p>sample topbar text</p>
        </div>
    );
}