import Image from 'next/image';
import Link from 'next/link';
import "./css/styles.css";

{/*
    https://stackoverflow.com/questions/65169431/how-to-set-the-next-image-component-to-100-height    
*/}

export default function TopBar() {
    {/* Return the entire top bar, essentially as an object (component) */ }
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
            <div className="dropdown">
                <button className="dropbtn">Select Store Location
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <a href="#">Location 1</a>
                    <a href="#">Location 2</a>
                    <a href="#">Location 3</a>
                </div>
            </div>
            {/* Profile icon PLACEHOLDER on the right side of the top bar */}
            <div className="profile-icon">
                <button className="profile-btn">Img
                    <i className="fa fa-caret-down"></i>
                </button>
            </div>
        </div>
    );
}