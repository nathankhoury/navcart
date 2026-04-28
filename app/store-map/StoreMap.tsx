"use client";

/*
StoreMap.tsx

This component:
1. Loads the current grocery list from localStorage
2. Loads checked-off item IDs from localStorage
3. Filters out already checked items so route generation only uses remaining items
4. Matches remaining items to store sections using section/item codes
5. Generates a store route from the nearest entrance to checkout
*/

import { useEffect, useMemo, useState } from "react";
import Inventory from "../DATA/data_final";
import { marketBasketSections } from "./marketBasketData";
import { GroceryItem, StoreSection, RoutePoint } from "./types";

/*
Returns the visual center point of a store section.
Used for route markers and SVG line drawing.
*/
function getCenter(section: StoreSection): RoutePoint {
    return {
        x: section.x + section.width / 2,
        y: section.y + section.height / 2,
    };
}

/*
Basic distance formula between two points.
Used to decide which entrance is closest to the first route stop.
*/
function distance(a: RoutePoint, b: RoutePoint) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

/*
If a section code looks like A1, A15, A21, etc.,
extract the aisle number as a number.
*/
function getAisleNumber(code: string): number | null {
    if (!code.startsWith("A")) return null;
    const num = Number(code.slice(1));
    return Number.isNaN(num) ? null : num;
}

function getSectionPriority(section: StoreSection): number {
    if (section.code === "PROD") return 1;
    if (section.code === "BAKE") return 2;
    if (section.code === "DELI") return 3;

    const aisleNum = getAisleNumber(section.code);
    if (aisleNum !== null) return 100 - aisleNum;

    if (section.code === "MEAT") return 200;
    if (section.code === "DAIRY") return 201;

    return 999;
}

function isAisle(section: StoreSection): boolean {
    return getAisleNumber(section.code) !== null;
}

function getAisleEntryPoint(section: StoreSection, fromTop: boolean): RoutePoint {
    return {
        x: section.x + section.width / 2,
        y: fromTop ? section.y : section.y + section.height,
    };
}

function getAisleExitPoint(section: StoreSection, enteredFromTop: boolean): RoutePoint {
    return {
        x: section.x + section.width / 2,
        y: enteredFromTop ? section.y + section.height : section.y,
    };
}

function getCheckoutEntryPoint(section: StoreSection): RoutePoint {
    return {
        x: section.x + section.width / 2,
        y: section.y,
    };
}

export default function StoreMap() {
    const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [routeGenerated, setRouteGenerated] = useState(false);

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

    useEffect(() => {
        const loadCheckedItems = () => {
            try {
                const saved = localStorage.getItem("navcart-checked-items");
                if (!saved) {
                    setCheckedIds(new Set());
                    return;
                }

                const parsed: number[] = JSON.parse(saved);
                setCheckedIds(new Set(parsed));
            } catch {
                setCheckedIds(new Set());
            }
        };

        loadCheckedItems();

        window.addEventListener("storage", loadCheckedItems);
        window.addEventListener("navcart-checked-updated", loadCheckedItems);

        return () => {
            window.removeEventListener("storage", loadCheckedItems);
            window.removeEventListener("navcart-checked-updated", loadCheckedItems);
        };
    }, []);

    const routeItems = useMemo(() => {
        return selectedItems.filter((item) => !checkedIds.has(item.id));
    }, [selectedItems, checkedIds]);

    const highlightedCodes = useMemo(() => {
        return new Set(routeItems.map((item) => item.code).filter(Boolean));
    }, [routeItems]);

    const highlightedSections = useMemo(() => {
        return marketBasketSections.filter((section) =>
            highlightedCodes.has(section.code)
        );
    }, [highlightedCodes]);

    const routeSections = useMemo(() => {
        if (!routeGenerated) return [];

        const checkout = marketBasketSections.find((section) => section.code === "REG");
        const southEntrance = marketBasketSections.find(
            (section) => section.code === "ENT_S"
        );
        const eastEntrance = marketBasketSections.find(
            (section) => section.code === "ENT_E"
        );

        const sectionsWithoutSpecialNodes = highlightedSections.filter(
            (section) => !["REG", "ENT_S", "ENT_E"].includes(section.code)
        );

        if (sectionsWithoutSpecialNodes.length === 0) {
            return [];
        }

        // Pick a starting entrance based on which entrance is closest
        // to any item on the route.
        let chosenEntrance: StoreSection | undefined = southEntrance;
        
        if (southEntrance && eastEntrance) {
            const closestToSouth = Math.min(
                ...sectionsWithoutSpecialNodes.map((section) =>
                    distance(getCenter(southEntrance), getCenter(section))
            )
        );

        const closestToEast = Math.min(
            ...sectionsWithoutSpecialNodes.map((section) =>
                distance(getCenter(eastEntrance), getCenter(section))
        )
    );
    
        chosenEntrance = closestToSouth <= closestToEast ? southEntrance : eastEntrance;
    } else if (eastEntrance) {
        chosenEntrance = eastEntrance;
    }

        // Nearest-neighbor route:
        // Each next stop is the closest remaining section.
        const sortedSections: StoreSection[] = [];
        const remainingSections = [...sectionsWithoutSpecialNodes];

        let currentPoint = chosenEntrance
            ? getCenter(chosenEntrance)
            : getCenter(remainingSections[0]);

        while (remainingSections.length > 0) {
            let closestIndex = 0;
            let closestDistance = distance(
                currentPoint,
                getCenter(remainingSections[0])
            );
            
            for (let i = 1; i < remainingSections.length; i++) {
                const sectionDistance = distance(
                    currentPoint,
                    getCenter(remainingSections[i])
                );
                
                if (sectionDistance < closestDistance) {
                    closestDistance = sectionDistance;
                    closestIndex = i;
                }
            }

            const [closestSection] = remainingSections.splice(closestIndex, 1);
            sortedSections.push(closestSection);
            currentPoint = getCenter(closestSection);
        }

        return [chosenEntrance, ...sortedSections, checkout].filter(
            Boolean
        ) as StoreSection[];
    }, [highlightedSections, routeGenerated]);
    
    const routePoints = useMemo((): RoutePoint[] => {
        if (routeSections.length === 0) return [];
        const bottomLaneY = 530;
        const topLaneY = 120;
        
        const points: RoutePoint[] = [];
        let lastPoint = getCenter(routeSections[0]);

        points.push(lastPoint);
        
        for (let i = 1; i < routeSections.length; i++) {
            const current = routeSections[i];
            const currentCenter = getCenter(current);

            const currentIsAisle = isAisle(current);
            const previousPoint = points[points.length - 1];

            if (currentIsAisle) {
                const distanceToTop = Math.abs(previousPoint.y - current.y);
                const distanceToBottom = Math.abs(
                    previousPoint.y - (current.y + current.height)
                );
                
                const enterFromTop = distanceToTop < distanceToBottom;

                const entryPoint = getAisleEntryPoint(current, enterFromTop);
                const exitPoint = getAisleExitPoint(current, enterFromTop);

                const laneY = enterFromTop ? topLaneY : bottomLaneY;

                points.push({ x: previousPoint.x, y: laneY });
                points.push({ x: entryPoint.x, y: laneY });
                points.push(entryPoint);
                points.push(exitPoint);

                lastPoint = exitPoint;
            } else {
                if (current.code === "REG") {
                    const checkoutPoint = getCheckoutEntryPoint(current);
                    
                    points.push({ x: lastPoint.x, y: bottomLaneY });
                points.push({ x: checkoutPoint.x, y: bottomLaneY });
                points.push(checkoutPoint);

                lastPoint = checkoutPoint;
                continue;
            }
            const currentIsTopDepartment = ["BAKE", "DELI", "MEAT", "DAIRY"].includes(
                current.code
            );
            const laneY = currentIsTopDepartment ? topLaneY : bottomLaneY;

            points.push({ x: lastPoint.x, y: laneY });
            points.push({ x: currentCenter.x, y: laneY });
            points.push(currentCenter);

            lastPoint = currentCenter;
        } 
    }
    return points;
}, [routeSections]);

    const polylinePoints = routePoints
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

    const currentStop = routeSections.length > 1 ? routeSections[1] : null;
    const nextStop = routeSections.length > 2 ? routeSections[2] : null;

    return (
        <section className="w-full">
            <div className="mb-4 rounded border bg-white px-4 py-3 text-sm text-gray-700">
                {selectedItems.length === 0 ? (
                    <p>No items currently selected. Go to Manage List to add items.</p>
                ) : routeItems.length === 0 ? (
                    <p>All items on your current list have been checked off.</p>
                ) : (
                    <p>
                        {routeItems.length} remaining item
                        {routeItems.length === 1 ? "" : "s"} available for routing.
                    </p>
                )}
            </div>

            <div className="mb-4 flex gap-3">
                <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    onClick={() => setRouteGenerated((prev) => !prev)}
                    disabled={highlightedSections.length === 0}
                >
                    Toggle Route
                </button>
            </div>

            <div className="overflow-hidden">
                <div
                    className="relative mx-auto rounded-lg border-2 border-gray-400 bg-gray-50"
                    style={{
                        width: "1100px",
                        height: "650px",
                        transform: "scale(0.78)",
                        transformOrigin: "top left",
                    }}
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
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            />
                            )}

                        {routeSections.map((section, index) => {
                            const point = getCenter(section);
                            const isCurrentStep = index === 1;
                            const circleFill = isCurrentStep ? "#16a34a" : "#2563eb";
                            const circleStroke = "#ffffff";

                            return (
                                <g key={section.id}>
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="14"
                                        fill={circleFill}
                                        stroke={circleStroke}
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={point.x}
                                        y={point.y + 4}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="#ffffff"
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
                        const isCurrentStop =
                            routeGenerated &&
                            currentStop &&
                            section.code === currentStop.code;
                        const isUpcomingStop =
                            routeGenerated &&
                            nextStop &&
                            section.code === nextStop.code;

                        let borderColor = "#374151";
                        let borderWidth = "1px";
                        let boxShadow = "none";

                        if (isHighlighted) {
                            borderColor = "#2563eb";
                            borderWidth = "3px";
                            boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.15)";
                        }

                        if (isUpcomingStop) {
                            borderColor = "#2563eb";
                            borderWidth = "4px";
                            boxShadow = "0 0 0 5px rgba(37, 99, 235, 0.18)";
                        }

                        if (isCurrentStop) {
                            borderColor = "#16a34a";
                            borderWidth = "4px";
                            boxShadow = "0 0 0 6px rgba(22, 163, 74, 0.18)";
                        }

                        return (
                            <div
                                key={section.id}
                                className="absolute flex flex-col items-center justify-center rounded-md border text-center text-sm font-medium shadow-sm transition-all"
                                style={{
                                    left: `${section.x}px`,
                                    top: `${section.y}px`,
                                    width: `${section.width}px`,
                                    height: `${section.height}px`,
                                    backgroundColor: section.color,
                                    borderColor,
                                    borderWidth,
                                    boxShadow,
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
                        Blue outline = remaining unchecked items
                    </div>

                    <div className="absolute bottom-4 right-4 rounded border bg-white px-3 py-2 text-xs text-gray-600">
                        Green = current stop, blue = upcoming route
                    </div>
                </div>
            </div>
        </section>
    );
}