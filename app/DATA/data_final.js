/*
*   Format for individual items:
*   Inventory["KEY"] = {"id":       *unique id number*, 
*                       "name":     *name to be displayed to user*,
*                       "location": *dept/aisle to be displayed to user*,
*                       "code":     *location as a short character code for our purposes potentially*,
*                       "category": *give a categorization of what the item is, most items will just be "grocery"*,
*                       "isCold":   *boolean value for if the item needs to be refridgerated/frozen*,
*                       }
*   For right now, focus on the file Grocery_dataset_sorted.txt and converting those items into this format
*   
*   Template: Inventory[""] = {"id":, "name": "", "location": "", "code": "", "category": "", "isCold": false}
*/

var Inventory = [];
Inventory["abrasive cleaner"] = {"id": 1, "name": "Abrasive Cleaner", "location": "Aisle 15", "code": "A15", "category": "Grocery", "isCold": false}
