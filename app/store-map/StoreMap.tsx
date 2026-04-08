"use client";

import { useEffect, useMemo, useState } from "react";
import Inventory from "../DATA/data_final";
import { marketBasketSections } from "./marketBasketData";
import { GroceryItem, StoreSection, RoutePoint } from "./types";

function getCenter(section: StoreSection): RoutePoint {
    return {
        x: section.x + section.width / 2,
        y: section.y + section.height / 2,
    };
}

function distance(a: RoutePoint, b: RoutePoint) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function buildOrthogonalSegment(a: RoutePoint, b: RoutePoint): RoutePoint[] {
    // horizontal first, then vertical
    return [
        a,
        { x: b.x, y: a.y },
        b,
    ];
}

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

        loadCurrentList();

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

    const highlightedSections = useMemo(() => {
        return marketBasketSections.filter((section) =>
            highlightedCodes.has(section.code)
        );
    }, [highlightedCodes]);

    const routeSections = useMemo(() => {
        const checkout = marketBasketSections.find((section) => section.code === "REG");
        const southEntrance = marketBasketSections.find((section) => section.code === "ENT_S");
        const eastEntrance = marketBasketSections.find((section) => section.code === "ENT_E");

        const sectionsWithoutSpecialNodes = highlightedSections.filter(
            (section) => !["REG", "ENT_S", "ENT_E"].includes(section.code)
        );

        const sortedSections = [...sectionsWithoutSpecialNodes].sort((a, b) => a.x - b.x);

        if (sortedSections.length === 0) {
            return [];
        }

        const firstStop = getCenter(sortedSections[0]);

        let chosenEntrance: StoreSection | undefined = southEntrance;

        if (southEntrance && eastEntrance) {
            const southDistance = distance(getCenter(southEntrance), firstStop);
            const eastDistance = distance(getCenter(eastEntrance), firstStop);
            chosenEntrance = southDistance <= eastDistance ? southEntrance : eastEntrance;
        } else if (eastEntrance) {
            chosenEntrance = eastEntrance;
        }

        return [chosenEntrance, ...sortedSections, checkout].filter(Boolean) as StoreSection[];
    }, [highlightedSections]);

    const routePoints = useMemo((): RoutePoint[] => {
        if (routeSections.length === 0) return [];

        const bottomLaneY = 530;
        const topLaneY = 120;

        const points: RoutePoint[] = [];

        const start = getCenter(routeSections[0]);
        points.push(start);

        for (let i = 1; i < routeSections.length; i++) {
            const current = routeSections[i - 1];
            const next = routeSections[i];

            const currentCenter = getCenter(current);
            const nextCenter = getCenter(next);

            const nextIsTopDepartment =
                ["BAKE", "DELI", "MEAT", "DAIRY"].includes(next.code);

            const laneY = nextIsTopDepartment ? topLaneY : bottomLaneY;

            const currentLanePoint = { x: currentCenter.x, y: laneY };
            const nextLanePoint = { x: nextCenter.x, y: laneY };

            // move from current stop to the lane
            if (
                points[points.length - 1].x !== currentLanePoint.x ||
                points[points.length - 1].y !== currentLanePoint.y
            ) {
                points.push(currentLanePoint);
            }

            // move horizontally along the lane
            if (
                points[points.length - 1].x !== nextLanePoint.x ||
                points[points.length - 1].y !== nextLanePoint.y
            ) {
                points.push(nextLanePoint);
            }

            // move vertically into the next stop
            if (
                points[points.length - 1].x !== nextCenter.x ||
                points[points.length - 1].y !== nextCenter.y
            ) {
                points.push(nextCenter);
            }
        }

        return points;
    }, [routeSections]);

    const polylinePoints = routePoints.map((point) => `${point.x},${point.y}`).join(" ");

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
                    <svg
                        className="absolute left-0 top-0 pointer-events-none"
                        width="1100"
                        height="650"
                    >
                        {routePoints.length >= 2 && (
                            <polyline
                                points={polylinePoints}
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="8 6"
                            />
                        )}

                        {routeSections.map((section, index) => {
                            const point = getCenter(section);

                            return (
                                <g key={section.id}>
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="7"
                                        fill="#2563eb"
                                    />
                                    <text
                                        x={point.x}
                                        y={point.y - 12}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#1d4ed8"
                                        fontWeight="bold"
                                    >
                                        {index + 1}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

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

                    <div className="absolute bottom-4 right-4 rounded border bg-white px-3 py-2 text-xs text-gray-600">
                        Dashed blue line = sample walking route from nearest entrance to checkout
                    </div>
                </div>
            </div>
        </section>
    );
}