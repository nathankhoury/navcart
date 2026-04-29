"use client";

import Image from "next/image";
import Inventory from "../DATA/data_final";
import { useState, useEffect } from "react";
import { marketBasketSections } from "../store-map/marketBasketData";
import { GroceryItem, StoreSection, RoutePoint } from "../store-map/types";
import Link from "next/link";
import "../css/grocerylist.css";

/*
    References:
    - https://react.dev/reference/react/useState
        (useState hook - used for tracking checked and collapsed state)
    - https://react.dev/reference/react/hooks
        (React hooks overview)
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
        (JavaScript Map object - used in groupByCategory to group items by category)
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        (Array.map - used to transform category groups into JSX)
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
        (JavaScript Set - used to track checked and collapsed categories)
    - https://www.typescriptlang.org/docs/handbook/2/objects.html
        (TypeScript object types - used for GroceryItem and CategoryGroup type definitions)
    - https://www.typescriptlang.org/docs/handbook/utility-types.html
        (TypeScript Record utility type - used for CATEGORY_INFO)
    
    - https://developer.mozilla.org/en-US/docs/Web/CSS/transition
        (CSS transition - used for smooth hover effects on items and the manage list button)
    - https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        (CSS transform translateY - used for the manage list button moving up slightly on hover)
    - https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        (CSS transform rotate - used to rotate the category caret when collapsed)
    - https://nextjs.org/docs/app/api-reference/components/image
        (Next.js Image component - used for category caret and item check icons)
    - https://fonts.google.com/icons?icon.size=28&icon.color=%23FFFFFF
        (Google Material Icons - source for category caret and checkmark icon)

    Description: 
    This component renders the grocery list sidebar that appears on the home page.
    It groups items by category and allows the user to check them off as they shop.
    Categories can be collapsed/expanded to save space and the number of remaining 
    items is shown at the top.

    TODO: When save/load is implemented, replace the PLACEHOLDER_ITEMS array 
    below with the saved items in manager list.
    The item shape must match the Inventory entries in data_final.js exactly.

    Contributors for this file:
    Camila Salinas (last modified: 3/22/2026)
    Nathan Khoury (last modified: 4/1/2026)
*/

// This type matches the shape of items in DATA/data_final.js
type GroceryItem = {
    id: number;
    name: string;
    location: string; // "Aisle 1", "Produce Department"
    code: string;     // "A1", "PROD", "MEAT"
    category: string; // "Dairy", "Produce", "Meat", "Grocery"
    isCold: boolean;
};

type CategoryGroup = {
    category: string;
    emoji: string;
    items: GroceryItem[];
};

type GroceryListProps = {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
};

/*
  CATEGORY_INFO

  Defines the emoji and sort order for each category.
  Add a new entry here if a new category is added to the dataset.
*/
const CATEGORY_INFO: Record<string, { emoji: string; order: number }> = {
    Produce: { emoji: "🍎", order: 1 },
    Dairy: { emoji: "🧀", order: 2 },
    Bakery: { emoji: "🍞", order: 3 },
    Meat: { emoji: "🥩", order: 4 },
    Grocery: { emoji: "🛒", order: 5 },
};

/*
 Reusing Richie's code from StoreMap.tsx to sort by the route's order and render the results
 by that metric, rather than by category
*/

export function getAisleNumber(code: string): number | null {
  if (!code.startsWith("A")) return null;
  const num = Number(code.slice(1));
  return Number.isNaN(num) ? null : num;
}

export function getSectionPriority(section: StoreSection): number {
  if (section.code === "PROD") return 1;
  if (section.code === "BAKE") return 2;
  if (section.code === "DELI") return 3;

  const aisleNum = getAisleNumber(section.code);
  if (aisleNum !== null) return 100 - aisleNum;

  if (section.code === "MEAT") return 200;
  if (section.code === "DAIRY") return 201;

  return 999;
}

export function getSectionForItem(item: GroceryItem): StoreSection | undefined {
  return marketBasketSections.find(
    (section) => section.code === item.code
  );
}

export function sortItemsByRouteOrder(items: GroceryItem[]): GroceryItem[] {
  return [...items].sort((a, b) => {
    const sectionA = getSectionForItem(a);
    const sectionB = getSectionForItem(b);

    if (!sectionA || !sectionB) return 0;

    const priorityDiff =
      getSectionPriority(sectionA) - getSectionPriority(sectionB);

    if (priorityDiff !== 0) return priorityDiff;

    // tie-breaker: left-to-right in store
    return sectionA.x - sectionB.x;
  });
}

/*
  groupByCategory

  Takes a flat list of items and groups them by their category field.
  Returns an array of CategoryGroup objects sorted by the order in CATEGORY_INFO.
*/
function groupByCategory(items: GroceryItem[]): CategoryGroup[] {
    const map = new Map<string, GroceryItem[]>();

    for (const item of items) {
        if (!map.has(item.category)) map.set(item.category, []);
        map.get(item.category)!.push(item);
    }

    return Array.from(map.entries())
        .map(([category, items]) => ({
            category,
            emoji: CATEGORY_INFO[category]?.emoji ?? "📦",
            items,
        }))
        .sort((a, b) =>
            (CATEGORY_INFO[a.category]?.order ?? 99) - (CATEGORY_INFO[b.category]?.order ?? 99)
        );
}

export default function GroceryList() {
    // Load current list of items into state - initially empty until we load from localStorage in useEffect
    const [items, setItems] = useState<GroceryItem[]>([]);
    // Tracks which item IDs have been checked off by the user
    const [checked, setChecked] = useState<Set<number>>(() => {
        if (typeof window === "undefined") return new Set();
        try {
            const saved = localStorage.getItem("navcart-checked-items");
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    });

    // Tracks which category names are collapsed (hidden)
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

    // Toggle a single item's checked state
    const toggle = (id: number) => {
        setChecked((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Toggle a category's collapsed/expanded state
    const toggleCollapse = (category: string) => {
        setCollapsed((prev) => {
            const next = new Set(prev);
            next.has(category) ? next.delete(category) : next.add(category);
            return next;
        });
    };

    const sortedItems = sortItemsByRouteOrder(items);
    const remaining = items.filter((item) => !checked.has(item.id)).length;


    useEffect(() => {
        // retrieve saved list
        const saved = localStorage.getItem("navcart-current-list");

        // abort if nothing saved
        if (!saved) return;

        // parse the saved list, which is an array of item keys
        try {
            const parsed: string[] = JSON.parse(saved);

            // convert keys into actual GroceryItem objects
            const mappedItems: GroceryItem[] = parsed
                .map((key) => Inventory[key as keyof typeof Inventory])
                .filter(Boolean);
            
                // write to state
            setItems(mappedItems);
        } catch {
            console.error("Failed to load grocery list");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("navcart-checked-items", JSON.stringify(Array.from(checked)));
        window.dispatchEvent(new Event("navcart-checked-updated"));
    }, [checked]);

    return (
        <aside className="gl-sidebar">

            {/* --- Sticky top section: title + manage list button --- */}
            <div className="gl-sticky-top">
                <div className="gl-header">
                    <h2 className="gl-title">Grocery List</h2>
                    {/* Badge shows how many items are left to check off */}
                    <span className="gl-badge">{remaining} items</span>
                </div>
                {/* Navigates to the list manager page */}
                <Link href="/list-manager" className="gl-manage-btn">
                    Manage List
                </Link>
            </div>

            {/* --- Scrollable list section --- */}
            <div className="gl-list">
                {items.length === 0 ? (
                    /* Empty state shown when no items are in the list */
                    <div className="gl-empty">
                        <p>Your list is empty.</p>
                        <p>Go to <Link href="/list-manager">Manage List</Link> to add items.</p>
                    </div>
                ) : (
                    /* Render each category group */
                    sortedItems.map((item, index) => {
                        const isDone = checked.has(item.id);

                        return (
                            <button
                                type="button"
                                key={item.id}
                                className={`gl-item${isDone ? " gl-item--checked" : ""}`}
                                onClick={() => toggle(item.id)}
                            >
                                <span className="gl-step-number">
                                    {index + 1}
                                </span>

                                <span className={`gl-circle${isDone ? " gl-circle--checked" : ""}`}>
                                    {isDone && (
                                        <Image
                                            src="/done_28dp_FFFFFF.svg"
                                            alt="checked"
                                            width={12}
                                            height={12}
                                            className="gl-check-icon"
                                        />
                                    )}
                                </span>

                                <span className="gl-item-info">
                                    <span className="gl-item-name">{item.name}</span>
                                    <span className="gl-item-aisle">{item.location}</span>
                                </span>

                                <span className="gl-aisle-code">{item.code}</span>
                            </button>
                        );
                    })
                )}
            </div>
        </aside>
    );
}