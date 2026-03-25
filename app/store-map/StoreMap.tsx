/*
This is the main component that renders the store map.

What this file does rn:
1. Imports inventory data from data_final.js
2. Converts the inventory object into an array using Object.values()
3. Filters items based on a sample grocery list
4. Matches item "codes" to store sections
5. Highlights matching sections on the map

Key concept:
- Each grocery item has a "code" (like A15 or PROD).
- Each store section also has a "code".
- If they match → that section gets highlighted.

Right now 'sampleSelectedItems' is hardcoded for testing
Later this will connect to the list-manager so real user selections highlight the map
*/
"use client";

import Inventory from "../DATA/data_final";
import { marketBasketSections } from "./marketBasketData";
import { GroceryItem, StoreSection } from "./types";

const sampleSelectedItems = ["abrasive cleaner", "beef", "berries"];

export default function StoreMap() {
    const items = Object.values(Inventory) as GroceryItem[];

    const selectedItems = items.filter((item) => sampleSelectedItems.includes(item.name.toLowerCase()));

const highlightedCodes = new Set(selectedItems.map((item) => item.code));

return (
    <section className="w-full">
        <div className="overflow-x-auto">
            <div
            className="relative mx-auto rounded-lg border-2 border-gray-400 bg-gray-50"
            style={{ width: "1100px", height: "650px" }}
            >
                {marketBasketSections.map((section: StoreSection) => {
                    const isHighlighted = highlightedCodes.has(section.code);
                    
                    return (
                    <div
                    key={section.id}
                    className="absolute flex flex-col items-center justify-center rounded-md border text-center text-sm font-medium shadow-sm"
                    style={{
                    left: `${section.x}px`,
                    top: `${section.y}px`,
                    width: `${section.width}px`,
                    height: `${section.height}px`,
                    backgroundColor: section.color,
                    borderColor: isHighlighted ? "#2563eb" : "#374151",
                    borderWidth: isHighlighted ? "3px" : "1px",
                    boxShadow: isHighlighted
                    ? "0 0 0 4px rgba(37, 99, 235, 0.15)"
                    : "none",
                }}
                >
                    <span>{section.label}</span>
                    <span className="mt-1 text-xs text-gray-600">{section.code}</span>
                    </div>
                    );
                    })}
                    
                    <div className="absolute bottom-4 left-4 rounded border bg-white px-3 py-2 text-xs text-gray-600">
                        Blue outline = section matched to selected grocery items
                    </div>
                </div>
            </div>
        </section>
    );
}