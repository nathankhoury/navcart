"use client";

import { useState } from "react";
import TopBar from "./topbar";
import GroceryList from "./grocery-list/page";
import StoreMap from "./store-map/StoreMap";
import "./css/home.css";

export default function Home() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="home-wrapper">
      <TopBar />
      <main className="home-main">

        {/* Grocery list sidebar - always visible */}
        <div className="home-list">
          <GroceryList />
        </div>

        {/* Map panel - tablet and desktop only */}
        <div className={`home-map${showMap ? " home-map--visible" : " home-map--hint"}`}>
          {showMap ? (
            <StoreMap embedded />
          ) : (
            <div className="home-map-hint">
              <span className="home-map-hint-icon">🗺️</span>
              <p className="home-map-hint-text">Store map is hidden</p>
              <p className="home-map-hint-sub">Press the button in the bottom right corner to show it</p>
            </div>
          )}
        </div>

        {/* Toggle button - tablet and desktop only */}
        <button
          type="button"
          onClick={() => setShowMap((prev) => !prev)}
          className="home-map-toggle"
          title={showMap ? "Hide map" : "Show map"}
        >
          {showMap ? "❌ Hide Map" : "🗺️ Show Map"}
        </button>

      </main>
    </div>
  );
}