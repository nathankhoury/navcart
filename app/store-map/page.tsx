"use client";

import TopBar from "../topbar";
import GroceryList from "../grocery-list/page";
import StoreMap from "./StoreMap";
import "../css/home.css";

export default function StoreMapPage() {
    return (
        <div className="home-wrapper">
            <TopBar />

            <main className="home-main">

                {/* Grocery list sidebar - always visible */}
                <div className="home-list">
                    <GroceryList />
                </div>

                {/* Map panel - always visible */}
                <div className="home-map home-map--visible">
                    <StoreMap />
                </div>

            </main>
        </div>
    );
}