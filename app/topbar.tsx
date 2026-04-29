"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useProfile } from "./context/ProfileContext";
import "./css/navbar.css";

/*
    References:
    - https://react.dev/reference/react/useState
        (useState hook - used for dropdown open/close and selected location state)
    - https://react.dev/reference/react/useEffect
        (useEffect hook - used to add and clean up the outside click event listener)
    - https://react.dev/reference/react/useRef
        (useRef hook - used to reference the dropdown DOM element for outside click detection)
    - https://nextjs.org/docs/app/api-reference/functions/use-pathname
        (usePathname - used to highlight the active nav link based on current route)
    - https://dev.to/mirfayekhossain/how-to-detect-clicks-outside-of-an-element-in-nextjs-or-react-301p
        (outside click detection with useRef + useEffect - used to close dropdown on outside click)
    - https://nextjs.org/learn/dashboard-app/navigating-between-pages
        (active link pattern with usePathname - used to highlight the current page in the nav)

    - https://developer.mozilla.org/en-US/docs/Web/CSS/transition
        (CSS transition - used for smooth background color changes on hover)
    - https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        (CSS transform - used to rotate the dropdown caret 180deg when open)
    - https://nextjs.org/docs/app/api-reference/components/image
        (Next.js Image component - used for logo, profile icon and dropdown caret)
    - https://fonts.google.com/icons?icon.size=28&icon.color=%23FFFFFF
        (Google Material Icons - source for profile icon and dropdown caret svgs)

    Description:
    This is the top navigation bar shown on every page of the app.
    It contains the NavCart logo, nav links (Home, Manage List, Help, Profile),
    a store location dropdown and a profile icon placeholder.
    The active nav link is highlighted based on the current route using usePathname.
    The location dropdown closes automatically when clicking outside of it.

    Contributors for this file:
    Camila Salinas (last modified: 3/22/2026)
*/

// Store locations - update this list when real locations are added
const LOCATIONS = ["40 Federal St, Lynn, MA", "More Locations Coming Soon!"];

// Nav links - add more here if needed
const NAV_LINKS = [
    { href: "/",             label: "Home"        },
    { href: "/store-map",    label: "Store Map"   },
    { href: "/list-manager", label: "Manage List" },
    { href: "/help",         label: "Help"        },
    { href: "/profile",      label: "Profile"     },
];

export default function TopBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { profilePicUrl, displayName } = useProfile();
    const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
    
    // usePathname lets us highlight whichever page is currently active
    const pathname = usePathname();

    // Close the dropdown when the user clicks outside of it
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div id="topbar-wrapper">

            {/* Logo - always links back to home */}
            <Link href="/" id="topbar-logo-link">
                <Image
                    id="topbar-logo"
                    src="/logo.svg"
                    alt="NavCart logo"
                    width={160}
                    height={60}
                />
            </Link>

            {/* Nav links - active page gets a highlight background */}
            <nav id="topbar-nav">
                {NAV_LINKS.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`topbar-nav-link${pathname === href ? " topbar-nav-link--active" : ""}`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Store location dropdown - opens on click, closes on outside click */}
            <div className="topbar-dropdown" ref={dropdownRef}>
                <button
                    type="button"
                    className={`topbar-dropbtn${dropdownOpen ? " topbar-dropbtn--open" : ""}`}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                >
                    <span>{selected ?? "Select Store Location"}</span>
                    <Image
                        src="/keyboard_arrow_down_28dp_FFFFFF.svg"
                        alt="dropdown arrow"
                        width={20}
                        height={20}
                        className={`topbar-caret${dropdownOpen ? " topbar-caret--open" : ""}`}
                    />
                </button>

                {/* Dropdown menu - only rendered when open */}
                {dropdownOpen && (
                    <div className="topbar-dropdown-content">
                        {LOCATIONS.map((loc) => (
                            <button
                                type="button"
                                key={loc}
                                className={`topbar-dropdown-item${selected === loc ? " topbar-dropdown-item--selected" : ""}`}
                                onClick={() => {
                                    setSelected(loc);
                                    setDropdownOpen(false);
                                }}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Profile icon - links to /profile page */}
            <Link href="/profile" className="topbar-profile-btn" title="Profile / Settings">
                {profilePicUrl ? (
                    <div className="topbar-avatar">
                        <Image
                            src={profilePicUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                            sizes="30px"
                        />
                    </div>
                ) : (
                    <span className="topbar-avatar-initials">{initials}</span>
                )}
            </Link>
        </div>
    );
}