"use client";

import Image from "next/image";
import Inventory from "../DATA/data_final";
import { useState, useEffect } from "react";
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

/*
  PLACEHOLDER DATA

  These items are hardcoded just to show how the list will look.
  Replace this array with real data once save/load is working.
  The shape of each object matches data_final.js.
*/
const PLACEHOLDER_ITEMS: GroceryItem[] = [
    { id: 8, name: "Berries", location: "Produce Department", code: "PROD", category: "Produce", isCold: true },
    { id: 26, name: "Citrus Fruit", location: "Produce Department", code: "PROD", category: "Produce", isCold: true },
    { id: 12, name: "Butter", location: "Aisle 1", code: "A1", category: "Dairy", isCold: true },
    { id: 34, name: "Cream", location: "Aisle 1", code: "A1", category: "Dairy", isCold: true },
    { id: 7, name: "Beef", location: "Meat Department", code: "MEAT", category: "Meat", isCold: true },
    { id: 23, name: "Chicken", location: "Meat Department", code: "MEAT", category: "Meat", isCold: true },
    { id: 11, name: "Bread", location: "Aisle 18", code: "A18", category: "Bakery", isCold: false },
    { id: 21, name: "Cereals", location: "Aisle 4", code: "A4", category: "Grocery", isCold: false },
    { id: 30, name: "Coffee", location: "Aisle 7", code: "A7", category: "Grocery", isCold: false },
];

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
    /*
      In Progress: Replace PLACEHOLDER_ITEMS with real data when save/load is ready.
    */
    const [items, setItems] = useState<GroceryItem[]>([]);

    // Tracks which item IDs have been checked off by the user
    const [checked, setChecked] = useState<Set<number>>(new Set());

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

    const groups = groupByCategory(items);
    const remaining = items.length - checked.size;


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
                    groups.map((group) => {
                        const isCollapsed = collapsed.has(group.category);
                        const groupChecked = group.items.filter((i) => checked.has(i.id)).length;

                        return (
                            <div key={group.category} className="gl-category">

                                {/* Category header - clicking it collapses/expands the group */}
                                <button
                                    type="button"
                                    className="gl-category-header"
                                    onClick={() => toggleCollapse(group.category)}
                                >
                                    <span className="gl-category-left">
                                        <span className="gl-category-emoji">{group.emoji}</span>
                                        <span className="gl-category-label">{group.category.toUpperCase()}</span>
                                        <span className="gl-category-count">{groupChecked}/{group.items.length}</span>
                                    </span>
                                    {/* Caret icon rotates when the category is collapsed */}
                                    <Image
                                        src="/keyboard_arrow_down_28dp_9CA3AF.svg"
                                        alt="collapse arrow"
                                        width={20}
                                        height={20}
                                        className={`gl-collapse-icon${isCollapsed ? " gl-collapse-icon--closed" : ""}`}
                                    />
                                </button>

                                {/* Items are hidden when the category is collapsed */}
                                {!isCollapsed && group.items.map((item) => {
                                    const isDone = checked.has(item.id);
                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            className={`gl-item${isDone ? " gl-item--checked" : ""}`}
                                            onClick={() => toggle(item.id)}
                                        >
                                            {/* Checkbox circle - fills green when checked */}
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

                                            {/* Item name and aisle location */}
                                            <span className="gl-item-info">
                                                <span className="gl-item-name">{item.name}</span>
                                                <span className="gl-item-aisle">{item.location}</span>
                                            </span>

                                            {/* Short aisle code badge, for example A1, PROD, MEAT */}
                                            <span className="gl-aisle-code">{item.code}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
}