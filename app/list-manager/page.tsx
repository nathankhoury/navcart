"use client";

/*
  React imports:
  - useState: stores component state
  - useMemo: memoizes filtered results
  - useEffect: loads/saves data from localStorage
*/
import { useState, useMemo, useEffect } from "react";


// Reusable top bar component for the NavCart header

import TopBar from "../topbar";


// Main stylesheet currently being used by this page

import "../css/styles.css";

/*
  Inventory dataset
  Assumes data_final.js exports an object named Inventory
*/
import Inventory from "../DATA/data_final.js";

/*
  Type for saved lists:
  key = saved list name
  value = object holding the saved items and an optional description
*/
type SavedListMap = Record<string, { items: string[]; description: string }>;


//  Main List Manager page

export default function ListManager() {
    
    //  Search text for the LEFT panel inventory search
    
    const [query, setQuery] = useState("");

    /*
      Current active grocery list being edited on the RIGHT side
      Stores item keys that correspond to Inventory[key]
    */
    const [list, setList] = useState<string[]>([]);

    
    //  Name used when saving a list
    
    const [listName, setListName] = useState("");

    
    //  Optional description used when saving a list
    
    const [description, setDescription] = useState("");

    
    //  Search text for the RIGHT panel "search within my list"
    
    const [listSearch, setListSearch] = useState("");

    /*
      Controls what appears on the LEFT panel:
      - default = search items
      - save = save list form + saved lists
      - load = load saved lists
    */
    const [leftMode, setLeftMode] = useState<"default" | "save" | "load">("default");

    
    //  Stores all named saved lists
    
    const [savedLists, setSavedLists] = useState<SavedListMap>({});

    /*
      Toast / popup message shown near the bottom of the page
      Example: "Item added", "Item removed", "List saved"
    */
    const [toastMessage, setToastMessage] = useState("");

    
    //  Loads the current active list from localStorage when the page first opens
    
    useEffect(() => {
        const saved = localStorage.getItem("navcart-current-list");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setList(Array.isArray(parsed) ? parsed : []);
            } catch {
                localStorage.removeItem("navcart-current-list");
            }
        }
    }, []);

    /*
      Saves the current active list to localStorage every time it changes
      This keeps the current list persistent across refresh/navigation
    */
    useEffect(() => {
        localStorage.setItem("navcart-current-list", JSON.stringify(list));
    }, [list]);

    
    //  Loads saved named lists from localStorage on page load
    
    useEffect(() => {
        const storedLists = localStorage.getItem("navcart-saved-lists");

        if (storedLists) {
            try {
                const parsedLists = JSON.parse(storedLists);
                setSavedLists(parsedLists && typeof parsedLists === "object" ? parsedLists : {});
            } catch {
                localStorage.removeItem("navcart-saved-lists");
            }
        }
    }, []);

    /*
      Automatically clears the toast message after a short delay
      This creates the popup/toast behavior
    */
    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage("");
        }, 2200);

        return () => clearTimeout(timer);
    }, [toastMessage]);

    /*
      Filters the full inventory for the LEFT-side search bar
      Matches:
      - item name
      - item category
      - item location
    */
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return [];

        return Object.entries(Inventory).filter(([key, item]: [string, any]) =>
            item.name.toLowerCase().includes(q) ||
            (item.category && item.category.toLowerCase().includes(q)) ||
            (item.location && item.location.toLowerCase().includes(q))
        );
    }, [query]);

    /*
      Filters only the items currently in the user's active list
      Used by the RIGHT-side search bar
    */
    const filteredList = useMemo(() => {
        const q = listSearch.trim().toLowerCase();

        if (!q) return list;

        return list.filter((key) => {
            const item = Inventory[key as keyof typeof Inventory];
            return (
                item.name.toLowerCase().includes(q) ||
                (item.category && item.category.toLowerCase().includes(q)) ||
                (item.location && item.location.toLowerCase().includes(q))
            );
        });
    }, [listSearch, list]);

    /*
      Adds an item from the LEFT-side inventory search into the current list
      Also clears the inventory search box and shows a toast message
    */
    const addItem = (key: string) => {
        if (!list.includes(key)) {
            setList((prev) => [...prev, key]);
            setQuery("");
            setToastMessage("Item added to list");
        } else {
            setToastMessage("Item is already in your list");
        }
    };

    
    //  Removes an item from the current list and shows a toast message
    
    const removeItem = (key: string) => {
        setList((prev) => prev.filter((k) => k !== key));
        setToastMessage("Item removed from list");
    };

    /*
      Saves the current list under the entered name
      If the name is blank, a default name is generated
      Also saves optional description
    */
    const saveList = () => {
        
        //  If the user leaves name blank, generate a fallback name
        
        const generatedName = `List ${Object.keys(savedLists).length + 1}`;
        const name = listName.trim() || generatedName;

        const updatedSavedLists: SavedListMap = {
            ...savedLists,
            [name]: {
                items: list,
                description: description.trim(),
            },
        };

        setSavedLists(updatedSavedLists);
        localStorage.setItem("navcart-saved-lists", JSON.stringify(updatedSavedLists));

        setListName("");
        setDescription("");
        setToastMessage(`List saved as "${name}"`);
    };

    /*
      Loads a saved list into the current active list
      Then returns the left panel to default mode
    */
    const loadList = (name: string) => {
        const selected = savedLists[name];

        if (selected) {
            setList(selected.items);
            localStorage.setItem("navcart-current-list", JSON.stringify(selected.items));
            setLeftMode("default");
            setToastMessage(`Loaded "${name}"`);
        }
    };

    
    //  Deletes a saved list after confirmation
    
    const deleteSavedList = (name: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);

        if (!confirmed) return;

        const updated = { ...savedLists };
        delete updated[name];

        setSavedLists(updated);
        localStorage.setItem("navcart-saved-lists", JSON.stringify(updated));
        setToastMessage(`Deleted "${name}"`);
    };

    /*
      Clears the current active list after confirmation
      Only clears the list being edited, not all saved lists
    */
    const clearCurrentList = () => {
        const confirmed = window.confirm("Are you sure you want to clear the list you are currently editing?");

        if (!confirmed) return;

        setList([]);
        localStorage.removeItem("navcart-current-list");
        localStorage.setItem("navcart-current-list", JSON.stringify(list));   // store empty list to maintain persistence after refresh
        setToastMessage("Current list cleared");
    };

    return (
        <div id="lm-page-wrapper" className="bg-white text-black">
            {/* Top navigation bar */}
            <TopBar />

            {/* Main 2-column layout */}
            <div id="lm-content-wrapper">
                {/* ========================= LEFT PANEL ========================= */}
                <div id="left" className="list-management-panel">
                    {/* DEFAULT MODE: search items from inventory */}
                    {leftMode === "default" && (
                        <>
                            <h1 className="panel-header text-4xl font-bold text-heading">
                                Search Items
                            </h1>

                            <p className="tracking-widest text-lg text-gray-600">
                                Click or drag to add items to your list
                            </p>

                            <div id="searchWrapper">
                                <input
                                    id="searchBox"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type a grocery item to search!"
                                />

                                <ul id="searchResults" className="list-none pl-0">
                                    {results.map(([key, item]: [string, any]) => (
                                        <li key={item.id}>
                                            <button
                                                className="list-item-button search-result-button"
                                                onClick={() => addItem(key)}
                                            >
                                                <span id="itemNameDisplayed">{item.name + " "}</span>
                                                <span id="itemLoc">{item.location || item.category}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* SAVE MODE: save form + saved lists */}
                    {leftMode === "save" && (
                        <>
                            <h1 className="panel-header text-4xl font-bold text-heading">
                                Save List
                            </h1>

                            <div className="save-panel-card">
                                <label className="save-label">List Name</label>
                                <input
                                    type="text"
                                    value={listName}
                                    onChange={(e) => setListName(e.target.value)}
                                    placeholder="A creative list name!"
                                    className="save-input"
                                />

                                <label className="save-label">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Some description of list contents/purpose"
                                    className="save-textarea"
                                />

                                <button className="save-panel-button" onClick={saveList}>
                                    Save
                                </button>
                            </div>

                            <h2 className="saved-lists-title">Saved Lists</h2>

                            <div className="saved-lists-stack">
                                {Object.keys(savedLists).length === 0 ? (
                                    <p className="empty-saved-text">No saved lists yet.</p>
                                ) : (
                                    Object.entries(savedLists).map(([name, data]) => (
                                        <div key={name} className="saved-list-card">
                                            <button
                                                className="saved-list-main"
                                                onClick={() => loadList(name)}
                                            >
                                                <div className="saved-list-name">{name}</div>
                                                <div className="saved-list-desc">
                                                    {data.description || "No description"}
                                                </div>
                                            </button>

                                            <button
                                                className="saved-list-delete"
                                                onClick={() => deleteSavedList(name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {/* LOAD MODE: just show saved lists for loading */}
                    {leftMode === "load" && (
                        <>
                            <h1 className="panel-header text-4xl font-bold text-heading">
                                Load a List
                            </h1>

                            <p className="tracking-widest text-lg text-gray-600">
                                Click a saved list to load the list&apos;s contents in place of your current items
                            </p>

                            <div className="saved-lists-stack">
                                {Object.keys(savedLists).length === 0 ? (
                                    <p className="empty-saved-text">No saved lists yet.</p>
                                ) : (
                                    Object.entries(savedLists).map(([name, data]) => (
                                        <div key={name} className="saved-list-card">
                                            <button
                                                className="saved-list-main"
                                                onClick={() => loadList(name)}
                                            >
                                                <div className="saved-list-name">{name}</div>
                                                <div className="saved-list-desc">
                                                    {data.description || "No description"}
                                                </div>
                                            </button>

                                            <button
                                                className="saved-list-delete"
                                                onClick={() => deleteSavedList(name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* ========================= RIGHT PANEL ========================= */}
                <div id="right" className="list-management-panel">
                    <h1 className="panel-header text-4xl font-bold text-headingr">
                        Your List
                    </h1>

                    <p className="tracking-widest text-lg text-gray-600">
                        Click or drag to remove items
                    </p>

                    {/* In default mode, show the list control buttons + search-in-list */}
                    {leftMode === "default" ? (
                        <>
                            <div>
                                <button
                                    id="saveListButton"
                                    className="listControlButton font-bold py-2 px-4 rounded"
                                    onClick={() => setLeftMode("save")}
                                >
                                    Save List
                                </button>

                                <button
                                    id="loadListButton"
                                    className="listControlButton font-bold py-2 px-4 rounded"
                                    onClick={() => setLeftMode("load")}
                                >
                                    Load List
                                </button>

                                <button
                                    id="clearListButton"
                                    className="listControlButton font-bold py-2 px-4 rounded"
                                    onClick={clearCurrentList}
                                >
                                    Clear List
                                </button>
                            </div>

                            <div id="searchWrapper">
                                <input
                                    id="searchBox"
                                    type="text"
                                    value={listSearch}
                                    onChange={(e) => setListSearch(e.target.value)}
                                    placeholder="Search for an item in your list"
                                />
                            </div>
                        </>
                    ) : (
                        /* In save/load mode, show return button */
                        <button
                            className="return-button"
                            onClick={() => setLeftMode("default")}
                        >
                            Return to List Manager
                        </button>
                    )}

                    {/* Current list display */}
                    <div id="listContentsWrapper">
                        <ul id="listContents" className="list-none pl-0">
                            {filteredList.map((key) => {
                                const item = Inventory[key as keyof typeof Inventory];
                                return (
                                    <li key={item.id}>
                                        <button
                                            className="list-item-button current-list-button"
                                            onClick={() => removeItem(key)}
                                        >
                                            <span id="itemNameDisplayed">{item.name + " "}</span>
                                            <span>{item.location || item.category}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Toast / popup message */}
            {toastMessage && (
                <div className="toast-message">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}