/* 
This file defines the TypeScript types used in the store map.

StoreSection:
- Represents a section of the grocery store (like Produce or an aisle)
- Include postitions and size for rendering on the map
- "code" connects the section to real inventory data (like A1 - A15, PROD)

GroceryItem: 
- Represents an item from the inventory dataset
- Comes from data_final.js
*/
export type StoreSection = {
    id: string;
    label: string;
    code: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};

export type GroceryItem = {
    id: number;
    name: string;
    location: string;
    code: string;
    category: string;
    isCold: boolean;
};