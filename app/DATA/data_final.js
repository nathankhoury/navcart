/*
*   DATA BASED ON 40 federal st, lynn 01905 LOCATION
*   STORE # 82
*
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

var Inventory = {};
Inventory["abrasive cleaner"] =         {"id": 1, "name": "Abrasive Cleaner", "location": "Aisle 15", "code": "A15", "category": "Grocery", "isCold": false}
Inventory["artificial sweetener"] =     {"id": 2, "name": "Artificial Sweetener", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["baby cosmetics"] =           {"id": 3, "name": "Baby Cosmetics", "location": "Aisle 12", "code": "A12", "category": "Grocery", "isCold": false}
Inventory["bags"] =                     {"id": 4, "name": "Bags", "location": "Registers", "code": "REG", "category": "Grocery", "isCold": false}
Inventory["baking powder"] =            {"id": 5, "name": "Baking Powder", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["bathroom cleaner"] =         {"id": 6, "name": "Bathroom Cleaner", "location": "Aisle 15", "code": "A15", "category": "Grocery", "isCold": false}
Inventory["beef"] =                     {"id": 7, "name": "Beef", "location": "Meat Department", "code": "MEAT", "category": "Meat", "isCold": true}
Inventory["berries"] =                  {"id": 8, "name": "Berries", "location": "Produce Department", "code": "PROD", "category": "Produce", "isCold": true}
Inventory["beverages"] =                {"id": 9, "name": "Beverages", "location": "Registers", "code": "REG", "category": "Grocery", "isCold": true}
Inventory["water"] =                    {"id": 10, "name": "Water", "location": "Aisle 16", "code": "A16", "category": "Grocery", "isCold": false}
Inventory["bread"] =                    {"id": 11, "name": "Bread", "location": "Aisle 18", "code": "A18", "category": "Grocery", "isCold": false}
Inventory["butter"] =                   {"id": 12, "name": "Butter", "location": "Aisle 1", "code": "A1", "category": "Dairy", "isCold": true}
Inventory["butter milk"] =              {"id": 13, "name": "Butter Milk", "location": "Aisle 1", "code": "A1", "category": "Dairy", "isCold": true}
Inventory["cake"] =                     {"id": 14, "name": "Cake", "location": "Bakery", "code": "BAKE", "category": "Bakery", "isCold": false}
Inventory["candles"] =                  {"id": 15, "name": "Candles", "location": "Aisle 15", "code": "A15", "category": "Grocery", "isCold": false}
Inventory["candy"] =                    {"id": 16, "name": "Candy", "location": "Aisle 9", "code": "A9", "category": "Grocery", "isCold": false}
Inventory["canned fish"] =              {"id": 17, "name": "Canned Fish", "location": "Aisle 2", "code": "A2", "category": "Grocery", "isCold": false}
Inventory["canned fruit"] =             {"id": 18, "name": "Canned Fruit", "location": "Aisle 9", "code": "A9", "category": "Grocery", "isCold": false}
Inventory["canned vegetables"] =        {"id": 19, "name": "Canned Vegetables", "location": "Aisle 6", "code": "A6", "category": "Grocery", "isCold": false}
Inventory["cat food"] =                 {"id": 20, "name": "Cat Food", "location": "Aisle 14", "code": "A14", "category": "Grocery", "isCold": false}
Inventory["cereals"] =                  {"id": 21, "name": "Cereals", "location": "Aisle 4", "code": "A4", "category": "Grocery", "isCold": false}
Inventory["gum"] =                      {"id": 22, "name": "Chewing Gum", "location": "Registers", "code": "REG", "category": "Grocery", "isCold": false}
Inventory["chicken"] =                  {"id": 23, "name": "Chicken", "location": "Meat Department", "code": "MEAT", "category": "Meat", "isCold": true}
Inventory["chocolate"] =                {"id": 24, "name": "Chocolate", "location": "Aisle 9", "code": "A9", "category": "Grocery", "isCold": false}
Inventory["chocolate marshmallow"] =    {"id": 25, "name": "Chocolate Marshmallow", "location": "Aisle 9", "code": "A9", "category": "Grocery", "isCold": false}
Inventory["citrus fruit"] =             {"id": 26, "name": "Citrus Fruit", "location": "Produce Department", "code": "PROD", "category": "Produce", "isCold": true}
Inventory["cleaner"] =                  {"id": 27, "name": "Cleaner", "location": "Aisle 15", "code": "A15", "category": "Grocery", "isCold": false}
Inventory["cling wrap"] =               {"id": 28, "name": "Cling Wrap", "location": "Aisle 13", "code": "A13", "category": "Grocery", "isCold": false}
Inventory["cocoa drinks"] =             {"id": 29, "name": "Cocoa Drinks", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["coffee"] =                   {"id": 30, "name": "Coffee", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["condensed milk"] =           {"id": 31, "name": "Condensed Milk", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["cooking chocolate"] =        {"id": 32, "name": "Cooking Chocolate", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["cookware"] =                 {"id": 33, "name": "Cookware", "location": "Aisle 7", "code": "A7", "category": "Grocery", "isCold": false}
Inventory["cream"] =                    {"id": 34, "name": "Cream", "location": "Aisle 1", "code": "A1", "category": "Dairy", "isCold": true}
Inventory["cream cheese"] =             {"id": 35, "name": "Cream Cheese", "location": "Aisle 1", "code": "A1", "category": "Dairy", "isCold": true}
Inventory["curd"] =                     {"id": 36, "name": "Curd", "location": "Aisle 1", "code": "A1", "category": "Dairy", "isCold": true}
Inventory["curd cheese"] =              {"id": 37, "name": "Curd Cheese", "location": "Aisle 1", "code": "A1", "category": "Dairy", "isCold": true}
Inventory["decalcifier"] =              {"id": 38, "name": "Decalcifier", "location": "Aisle 15", "code": "A15", "category": "Grocery", "isCold": false}
Inventory["dental care"] =              {"id": 39, "name": "Dental Care", "location": "Aisle 11", "code": "A11", "category": "Grocery", "isCold": false}
Inventory["dessert"] =                  {"id": 40, "name": "Dessert", "location": "Aisle 10", "code": "A10", "category": "Grocery", "isCold": false}
