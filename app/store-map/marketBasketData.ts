/*
This file defines the visual layout of the Market Basket store/floorplan.

Each object represents a section of the store:
- code: matches the inventory data
- label: what is displayed on the map
- x, y: position on the map
- width, height: size of the section
- color: visual styling
*/
import { StoreSection } from  "./types";

const aisleWidth = 35;
const aisleGap = 8;
const aisleStartX = 140;
const aisleTopY = 140;
const aisleHeight = 360;

const aisleSections: StoreSection[] = Array.from({ length: 21 }, (_, i) => {
    const aisleNumber = i + 1;
    
    return {
        id: `aisle-${aisleNumber}`,
        label: `Aisle ${aisleNumber}`,
        code: `A${aisleNumber}`,
        x: aisleStartX + (21 - aisleNumber) * (aisleWidth + aisleGap),
        y: aisleTopY,
        width: aisleWidth,
        height: aisleHeight,
        color: "#f3f4f6",
    };
});

export const marketBasketSections: StoreSection[] = [
    {
        id: "produce",
        label: "Produce",
        code: "PROD",
        x: 90,
        y: aisleTopY,
        width: 30,
        height: aisleHeight,
        color: "#bbf7d0",
    },
    {
        id: "bakery",
        label: "Bakery",
        code: "BAKE",
        x: 20,
        y: 40,
        width: 100,
        height: 60,
        color: "#fde68a",
    },
    {
        id: "deli",
        label: "Deli",
        code: "DELI",
        x: 200,
        y: 40,
        width: 100,
        height: 60,
        color: "#fecaca",
    },
    {
        id: "meat",
        label: "Meat",
        code: "MEAT",
        x: 470,
        y: 40,
        width: 140,
        height: 70,
        color: "#fca5a5",
    },
    {
        id: "dairy",
        label: "Dairy",
        code: "DAIRY",
        x: 920,
        y: 40,
        width: 120,
        height: 50,
        color: "#c7d2fe",
    },
    ...aisleSections,
    {
        id: "south-entrance",
        label: "South Entrance",
        code: "ENT_S",
        x: 20,
        y: 585,
        width: 120,
        height: 35,
        color: "#e5e7eb",
    },
    {
        id: "east-entrance",
        label: "East Entrance",
        code: "ENT_E",
        x: 1045,
        y: 500,
        width: 40,
        height: 120,
        color: "#e5e7eb",
    },
    {
        id: "checkout",
        label: "Checkout / Registers",
        code: "REG",
        x: 220,
        y: 550,
        width: 650,
        height: 60,
        color: "#d1d5db",
    },
];