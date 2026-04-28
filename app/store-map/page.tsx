"use client";

import { useState } from "react";
import TopBar from "../topbar";
import GroceryList from "../grocery-list/page";
import StoreMap from "./StoreMap";
import "../css/home.css";

type Tab = "list" | "map";

export default function StoreMapPage() {
    const [activeTab, setActiveTab] = useState<Tab>("map");

    return (
        <div className="home-wrapper">
            <TopBar />

            {/* Mobile tab bar - hidden on tablet+ */}
            <div className="home-tab-bar">
                <button
                    type="button"
                    className={`home-tab-btn${activeTab === "list" ? " home-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab("list")}
                >
                    📋 Grocery List
                </button>
                <button
                    type="button"
                    className={`home-tab-btn${activeTab === "map" ? " home-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab("map")}
                >
                    🗺️ Store Map
                </button>
            </div>

            <main className="home-main">

                {/* Grocery list - toggled by tab on mobile, always visible on tablet+ */}
                <div className={`home-list${activeTab === "list" ? " home-panel--active" : " home-panel--hidden"}`}>
                    <GroceryList />
                </div>

                {/* Map panel - toggled by tab on mobile, always visible on tablet+ */}
                <div className={`home-map home-map--visible${activeTab === "map" ? " home-panel--active" : " home-panel--hidden"}`}>
                    <StoreMap />
                </div>

            </main>
        </div>
    );
}