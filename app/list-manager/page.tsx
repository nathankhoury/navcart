"use client"
import TopBar from "../topbar";
import { useState, useMemo } from "react";
import "../css/styles.css";
import { Inventory } from "../DATA/data_final.js";

/* 
    References:
    https://react.dev/reference/rsc/use-client
    https://react.dev/reference/react/useState
    https://www.w3schools.com/react/react_usememo.asp
    https://v1.tailwindcss.com/components/buttons

    Considering for search bar:
    https://flowbite.com/docs/forms/search-input/
    https://www.material-tailwind.com/docs/html/input-search
    https://tomdekan.com/articles/react-search-bar?ref=r-react

    Contributors for this file:
    Nathan Khoury (last modified: 3/21/2026)

    Description:
    page.tsx is the file that defines the content of the page at the route /list-manager,
    think of it like the main body of the page, and other .tsx files in the same directory
    are supporting components that you can import and use in page.tsx. This list manager
    puts the dataset to use by giving the user the ability to search our internal data for
    items they wish to shop for. They can add to list, and control their list with our
    button controls.
*/

export default function ListManager() {
    // 'query' is the value, 'setQuery' is the function to update the value
    const [query, setQuery] = useState("");         // user input
    // 'list' is the value, 'setList' is the function to update the value
    const [list, setList] = useState<string[]>([]); // array of strings (selected items)

    // only reruns when dependencies change, which is why we use useMemo (think about it as caching or temp storage to save time)
    const results = useMemo(() => {
        // trim() removes unnecessary whitespace, toLowerCase() make it all lower case (duh)
        const q = query.trim().toLowerCase();

        if (!q) return []; // if empty, return empty list

        // return a list of items containing the substring 'q' into 'results'
        return Object.entries(Inventory).filter(([key, item]) => 
            // search substring q in the items name
            item.name.toLowerCase().includes(q) ||
            // also search substring in category name
            item.category.toLowerCase().includes(q)
        );
    }, [query]);    // 'query' is the only dependency

    // if list does not have key, replace the list with itself + the new key (since it was const and immutable)
    const addItem = (key: string) => {
        if (!list.includes(key)) {
            setList(prev => [...prev, key]);
            console.log("Successfully added to user's list");
        } else {
            console.log("Item already in user's list, not added");  
        }
    };

    // remove an item from the internal list
    const removeItem = (key: string) => {
        setList(prev => prev.filter(k => k !== key));   // keep everything such that k !== key
    }

    /* return one single parent div (or other element, but div wrapper seems to work best) */
    return (
        <div id="lm-page-wrapper" className="bg-white text-black">
            {/* Drop in the top bar component */}
            <TopBar/>

            <div id="lm-content-wrapper">    
                {/* The left half of the screen is represented here */}
                <div id="left" className="list-management-panel">
                    <h1 className="panel-header text-4xl font-bold text-heading">Search Items</h1>
                    <p className="tracking-widest text-lg text-gray-600">Click items to add them to your list</p>
                    {/* on input change, change the value of 'query" */}
                    <div id="searchWrapper">
                        <input
                            id="searchBox"
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search for an item or category/dept."
                        />
                        <ul id="searchResults" className="list-none pl-0">
                            {results.map(([key, item]) =>(
                                <li key={item.id}>
                                    <button 
                                        className="bg-transparent hover:bg-[#429c38] text-black-700 hover:text-black py-2 px-4 border border-black-900 hover:border-transparent rounded" 
                                        onClick={() => addItem(key)}
                                    >
                                        <span id="itemNameDisplayed">{item.name + ' '}</span>
                                        <span id="itemLoc">{item.location || item.category}</span>   {/* fallback, display the category */}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* The right half of the screen is represented here */}
                <div id="right" className="list-management-panel">
                    <h1 className="panel-header text-4xl font-bold text-headingr">Your List</h1>
                    <p className="tracking-widest text-lg text-gray-600">Click items to remove them from your list</p>
                    <div>
                        {/* the three main buttons for list controls are collected here*/}
                        <button id="saveListButton" className="listControlButton font-bold py-2 px-4 rounded">Save List</button>
                        <button id="loadListButton" className="listControlButton font-bold py-2 px-4 rounded">Load List</button>
                        <button id="clearListButton" className="listControlButton font-bold py-2 px-4 rounded">Clear List</button>
                    </div>
                    <div id="listContentsWrapper">
                        <ul id="listContents" className="">
                            {list.map((key) => {
                                const item = Inventory[key];
                                return (
                                    <li key={item.id}>
                                        <button
                                            className="bg-transparent hover:bg-red-300 text-black py-2 px-4 border border-black rounded"
                                            onClick={() => removeItem(key)}
                                        >
                                            <span id="itemNameDisplayed">{item.name + ' '}</span>
                                            <span>{item.location || item.category}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}