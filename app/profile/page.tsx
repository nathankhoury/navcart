"use client";

import TopBar from "../topbar";
import Image from "next/image";
import { useState, useRef } from "react";
import { useProfile } from "../context/ProfileContext";

/*
    Description:
    Profile page with an editable profile card (display name + profile picture)
    and two toggleable settings: Cold Item Priority and Dynamic Route Calculation.

    Contributors for this file: Andrew Belyea
    (last modified: 3/24/2026)
*/

export default function Profile() {
    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);

    // Profile info state
    const [handle] = useState("@janedoe"); // handle is not currently editable
    const [memberSince] = useState("01/14/2025"); // static, not editable
    const { profilePicUrl, displayName, setProfilePicUrl, setDisplayName } = useProfile();

    // Temporary edit state (only committed on Save)
    const [draftName, setDraftName] = useState(displayName);
    const [draftPicUrl, setDraftPicUrl] = useState<string | null>(profilePicUrl);

    // Settings state
    const [coldItemPriority, setColdItemPriority] = useState(false);
    const [dynamicRoute, setDynamicRoute] = useState(false);

    // File input ref for profile picture upload
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Enter edit mode, copy current values into draft
    const handleEditClick = () => {
        setDraftName(displayName);
        setDraftPicUrl(profilePicUrl);
        setIsEditing(true);
    };

    // Commit draft values to real state
    const handleSaveClick = () => {
        setDisplayName(draftName.trim() || displayName);
        setProfilePicUrl(draftPicUrl);
        setIsEditing(false);
    };

    // Cancel edit without saving
    const handleCancelClick = () => {
        setIsEditing(false);
    };

    // Handle profile picture file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setDraftPicUrl(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // The URL shown in the avatar (draft during edit, real otherwise)
    const avatarUrl = isEditing ? draftPicUrl : profilePicUrl;

    // Initials fallback for the avatar circle
    const initials = (isEditing ? draftName : displayName)
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex flex-col h-screen bg-[#F9FAFB] text-black overflow-hidden">
            <TopBar />

            <main className="flex-1 overflow-y-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-8 text-gray-800">Profile</h1>

                {/* Profile Card*/}
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-400 px-8 py-8 flex flex-col items-center gap-3">

                    {/* Avatar */}
                    <div className="relative">
                        <div
                            style={{ backgroundColor: '#4CAF50' }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden select-none ${isEditing ? "cursor-pointer ring-4 ring-emerald-300 ring-offset-2" : ""}`}
                            onClick={() => isEditing && fileInputRef.current?.click()}
                            title={isEditing ? "Click to change profile picture" : undefined}
                        >
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Profile picture"
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>

                        {/* Camera overlay hint during edit */}
                        {isEditing && (
                            <div
                                className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Display Name */}
                    {isEditing ? (
                        <input
                            type="text"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="text-xl font-semibold text-center border-b-2 border-emerald-400 focus:outline-none bg-transparent w-full text-gray-800 pb-1"
                            maxLength={40}
                            placeholder="Display name"
                            autoFocus
                        />
                    ) : (
                        <p className="text-xl font-semibold text-gray-800">{displayName}</p>
                    )}

                    {/* Handle */}
                    <p className="text-sm text-gray-400 -mt-1">{handle}</p>

                    {/* Member since */}
                    <p className="text-xs text-gray-400">User since {memberSince}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSaveClick}
                                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancelClick}
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 text-sm font-medium rounded-lg transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-150"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Settings Area */}
                <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-gray-400 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Settings</h2>
                    </div>

                    {/* Setting 1: Cold Item Priority */}
                    <SettingRow
                        label="Cold Item Priority"
                        description="Force route to be calculated with all frozen, cold, and produce items at the end if enabled."
                        enabled={coldItemPriority}
                        onToggle={() => setColdItemPriority((v) => !v)}
                    />

                    {/* Divider */}
                    <div className="mx-6 border-t border-gray-100" />

                    {/* Setting 2: Dynamic Route Calculation */}
                    <SettingRow
                        label="Dynamic Route Calculation"
                        description="Update the visual route as items are checked off if enabled."
                        enabled={dynamicRoute}
                        onToggle={() => setDynamicRoute((v) => !v)}
                    />
                </div>
            </main>
        </div>
    );
}

/* SettingRow sub-component */

type SettingRowProps = {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
};

function SettingRow({ label, description, enabled, onToggle }: SettingRowProps) {
    return (
        <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
            </div>

            {/* Toggle Switch */}
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={label}
                onClick={onToggle}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${enabled ? "bg-emerald-500" : "bg-gray-200"}`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`}
                />
            </button>
        </div>
    );
}