"use client";

import { useEffect, useMemo, useState } from "react";
import Inventory from "../DATA/data_final";
import { marketBasketSections } from "./marketBasketData";
import { GroceryItem, StoreSection } from "./types";

export default function StoreMap() {
    const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);

    useEffect(() => {
        const loadCurrentList = () => {
            try {
                const saved = localStorage.getItem("navcart-current-list");
                if (!saved) {
                    setSelectedItems([]);
                    return;
                }

                const parsed: string[] = JSON.parse(saved);

                const mappedItems: GroceryItem[] = parsed
                    .map((key) => Inventory[key as keyof typeof Inventory])
                    .filter(Boolean);

                setSelectedItems(mappedItems);
            } catch {
                console.error("Failed to load store map items");
                setSelectedItems([]);
            }
        };

        // load once when page opens
        loadCurrentList();

        // optional: update if another page/tab changes the list
        window.addEventListener("storage", loadCurrentList);
        window.addEventListener("navcart-list-updated", loadCurrentList);

        return () => {
            window.removeEventListener("storage", loadCurrentList);
            window.removeEventListener("navcart-list-updated", loadCurrentList);
        };
    }, []);

    const highlightedCodes = useMemo(() => {
        return new Set(selectedItems.map((item) => item.code).filter(Boolean));
    }, [selectedItems]);

    return (
        <section className="w-full">
            <div className="mb-4 rounded border bg-white px-4 py-3 text-sm text-gray-700">
                {selectedItems.length === 0 ? (
                    <p>No items currently selected. Go to Manage List to add items.</p>
                ) : (
                    <p>
                        Highlighting {selectedItems.length} selected item
                        {selectedItems.length === 1 ? "" : "s"} from your current list.
                    </p>
                )}
            </div>

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
                                <span className="text-[10px]">{section.label}</span>
                                <span className="mt-1 text-[9px] text-gray-600">
                                    {section.code}
                                </span>
                            </div>
                        );
                    })}

                    <div className="absolute bottom-4 left-4 rounded border bg-white px-3 py-2 text-xs text-gray-600">
                        Blue outline = section matched to items in your current list
                    </div>
                </div>
            </div>
        </section>
    );
}