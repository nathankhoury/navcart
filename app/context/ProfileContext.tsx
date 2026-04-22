"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ProfileContextType = {
    profilePicUrl: string | null;
    displayName: string;
    setProfilePicUrl: (url: string | null) => void;
    setDisplayName: (name: string) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("Jane Doe");

    return (
        <ProfileContext.Provider value={{ profilePicUrl, displayName, setProfilePicUrl, setDisplayName }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
    return ctx;
}