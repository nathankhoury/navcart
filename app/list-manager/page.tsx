"use client";
/*
  React hooks:
  - useState: stores interactive state
  - useMemo: memoizes filtered results
  - useEffect: handles localStorage and timed toast clearing
*/
import { useState, useMemo, useEffect } from "react";

/*
  Reusable top navigation bar
*/
import TopBar from "../topbar";

/*
  Main stylesheet for the list manager page
*/

import "../css/styles.css";

/*
  Inventory dataset.
  This assumes your data file uses a default export.
  Update the path only if your DATA folder is somewhere else.
*/
import Inventory from "../DATA/data_final.js";

/*
  Structure for saved named lists.
  Each saved list stores:
  - items: array of item keys
  - description: optional text description
*/
type SavedListMap = Record<string, { items: string[]; description: string }>;

/*
  Structure for the last action so the Undo button can reverse it.
*/
type LastAction =
    | { type: "add"; itemKey: string }
    | { type: "remove"; itemKey: string }
    | { type: "clear"; previousList: string[] }
    | null;

/*
  Main List Manager page
*/
export default function ListManager() {
    /*
      Left panel search input
    */
    const [query, setQuery] = useState("");

    /*
      Current active grocery list shown on the right side.
      Stores keys that match Inventory[key].
    */
    const [list, setList] = useState<string[]>([]);

    /*
      Save-list form fields
    */
    const [listName, setListName] = useState("");
    const [description, setDescription] = useState("");

    /*
      Search text for searching within the user's current list
    */
    const [listSearch, setListSearch] = useState("");

    /*
      Controls what appears on the left panel:
      - default: normal search + departments
      - save: save-list screen
      - load: load-list screen
    */
    const [leftMode, setLeftMode] = useState<"default" | "save" | "load">("default");
    const [lmTab, setLmTab] = useState<"search" | "list">("search");

    /*
      Saved named lists
    */
    const [savedLists, setSavedLists] = useState<SavedListMap>({});

    /*
      Toast / popup message shown near the bottom of the page
    */
    const [toastMessage, setToastMessage] = useState("");

    /*
      Last action for Undo support
    */
    const [lastAction, setLastAction] = useState<LastAction>(null);

    /*
      Currently selected department/category
    */
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [listLoaded, setListLoaded] = useState(false);

    /*
      Convert the Inventory object into an array of entries once.
      Each entry is [key, item].
    */
    const inventoryEntries = useMemo(() => {
        return Object.entries(Inventory) as [string, any][];
    }, []);

    /*
      Build department buttons dynamically from the dataset.
      This prevents hardcoding categories inside page.tsx.
      If the dataset changes, the buttons update automatically.
    */
    const departments = useMemo(() => {
        const uniqueCategories = new Set<string>();

        inventoryEntries.forEach(([key, item]) => {
            if (item.category && String(item.category).trim()) {
                uniqueCategories.add(String(item.category).trim());
            }
        });

        return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
    }, [inventoryEntries]);

    /*
      Load current active list from localStorage when page first opens
    */
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
        setListLoaded(true);
    }, []);

    /*
      Save current active list whenever it changes
    */
    useEffect(() => {
        if (!listLoaded) return;
        localStorage.setItem("navcart-current-list", JSON.stringify(list));
    }, [list, listLoaded]);

    /*
      Load named saved lists from localStorage on page load
    */
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
      Automatically hide the toast message after a short time
    */
    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage("");
        }, 2200);

        return () => clearTimeout(timer);
    }, [toastMessage]);

    /*
      Left-side search results from typed search.
      Matches item name, category, or location.
    */
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return [];

        return inventoryEntries.filter(([key, item]) =>
            String(item.name).toLowerCase().includes(q) ||
            String(item.category || "").toLowerCase().includes(q) ||
            String(item.location || "").toLowerCase().includes(q)
        );
    }, [query, inventoryEntries]);

    /*
      Right-side search within the current active list.
      Filters only items already added by the user.
    */
    const filteredList = useMemo(() => {
        const q = listSearch.trim().toLowerCase();

        if (!q) return list;

        return list.filter((key) => {
            const item = (Inventory as any)[key];

            return (
                String(item.name).toLowerCase().includes(q) ||
                String(item.category || "").toLowerCase().includes(q) ||
                String(item.location || "").toLowerCase().includes(q)
            );
        });
    }, [listSearch, list]);

    /*
      Department/category results.
      This reads directly from the dataset instead of using hardcoded item lists.
    */
    const departmentResults = useMemo(() => {
        if (!selectedDepartment) return [];

        return inventoryEntries.filter(([key, item]) =>
            String(item.category || "").trim().toLowerCase() ===
            selectedDepartment.trim().toLowerCase()
        );
    }, [selectedDepartment, inventoryEntries]);

    /*
      Add an item to the current active list
      - prevents duplicates
      - records action for Undo
      - clears left search input
      - shows toast message
    */
    const addItem = (key: string) => {
        if (!list.includes(key)) {
            setList((prev) => [...prev, key]);
            setLastAction({ type: "add", itemKey: key });
            setQuery("");
            setToastMessage("Item added to list");
        } else {
            setToastMessage("Item is already in your list");
        }
    };

    /*
      Remove an item from the current list
      - records action for Undo
      - shows toast message
    */
    const removeItem = (key: string) => {
        setList((prev) => prev.filter((k) => k !== key));
        setLastAction({ type: "remove", itemKey: key });
        setToastMessage("Item removed from list");
    };

    /*
      Save the current list as a named saved list.
      If the name is blank, generate a fallback name.
    */
    const saveList = () => {
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
      Load a saved list into the current active list
      and return the left panel to default mode
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

    /*
      Delete a saved list after confirmation
    */
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
      Clear the current active list after confirmation
      and save the previous list so Undo can restore it
    */
    const clearCurrentList = () => {
        const confirmed = window.confirm(
            "Are you sure you want to clear the list you are currently editing?"
        );

        if (!confirmed) return;

        setLastAction({ type: "clear", previousList: [...list] });
        setList([]);
        localStorage.removeItem("navcart-current-list");
        setToastMessage("Current list cleared");
    };

    /*
      Undo the last supported action:
      - undo add
      - undo remove
      - undo clear
    */
    const undoLastAction = () => {
        if (!lastAction) return;

        if (lastAction.type === "add") {
            setList((prev) => prev.filter((k) => k !== lastAction.itemKey));
            setToastMessage("Undo: item removed");
        }

        if (lastAction.type === "remove") {
            setList((prev) =>
                prev.includes(lastAction.itemKey) ? prev : [...prev, lastAction.itemKey]
            );
            setToastMessage("Undo: item restored");
        }

        if (lastAction.type === "clear") {
            setList(lastAction.previousList);
            setToastMessage("Undo: list restored");
        }

        setLastAction(null);
    };

    return (
        <div id="lm-page-wrapper">
            <TopBar />

            {/* Tab bar - always visible */}
            <div id="lm-tab-bar">
                <button
                    type="button"
                    className={lmTab === "search" ? "lm-tab-btn lm-tab-btn--active" : "lm-tab-btn"}
                    onClick={() => setLmTab("search")}
                >
                    🔍 Search Items
                </button>
                <button
                    type="button"
                    className={lmTab === "list" ? "lm-tab-btn lm-tab-btn--active" : "lm-tab-btn"}
                    onClick={() => setLmTab("list")}
                >
                    📋 Your List
                </button>
            </div>

            {/* Scrollable content area */}
            <div id="lm-content-wrapper">

                {/* ========================= LEFT PANEL ========================= */}
                <div id="left" className={`list-management-panel${lmTab === "search" ? " lm-panel--active" : " lm-panel--hidden"}`}>
                    {/* DEFAULT MODE: normal search + department browsing */}
                    {leftMode === "default" && (
                        <>
                            <h1 className="panel-header text-4xl font-bold text-heading">
                                Search Items
                            </h1>

                            <p className="tracking-widest text-lg text-gray-600">
                                Click or drag to add items to your list
                            </p>

                            {/* SEARCH BAR FIRST */}
                            <div id="searchWrapper">
                                <input
                                    id="searchBox"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type a grocery item to search!"
                                />

                                {/* Typed search results */}
                                <ul id="searchResults" className="list-none pl-0">
                                    {results.map(([key, item]) => (
                                        <li key={item.id}>
                                            <button
                                                className="list-item-button search-result-button"
                                                onClick={() => addItem(key)}
                                            >
                                                <span id="itemNameDisplayed">{item.name + " "}</span>
                                                <span id="itemLoc">
                                                    {item.location || item.category}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* DEPARTMENT BOXES BELOW SEARCH */}
                            <div className="department-section">
                                <h2 className="department-title">Browse by Department</h2>

                                <div className="department-grid">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept}
                                            className={`department-box ${
                                                selectedDepartment === dept 
                                                    ? "department-box-active" 
                                                    : ""
                                                }`}
                                            onClick={() => setSelectedDepartment(dept)}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>

                                {selectedDepartment && (
                                    <button 
                                        className="clear-department-button" 
                                        onClick={() => setSelectedDepartment("")}
                                        >
                                        Clear Department Filter
                                    </button>
                                )}
                            </div>

                            {/* Department-based results pulled directly from Inventory */}
                            {selectedDepartment && (
                                <div className="department-results-section">
                                    <h3 className="department-results-title">
                                        {selectedDepartment} Items
                                    </h3>

                                    <ul id="searchResults" className="list-none pl-0">
                                        {departmentResults.map(([key, item]) => (
                                            <li key={item.id}>
                                                <button
                                                    className="list-item-button search-result-button"
                                                    onClick={() => addItem(key)}
                                                >
                                                    <span id="itemNameDisplayed">{item.name + " "}</span>
                                                    <span id="itemLoc">
                                                        {item.location || item.category}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    {/* SAVE MODE */}
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

                    {/* LOAD MODE */}
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
                <div id="right" className={`list-management-panel${lmTab === "list" ? " lm-panel--active" : " lm-panel--hidden"}`}>
                    <h1 className="panel-header text-4xl font-bold text-headingr">
                        Your List
                    </h1>

                    <p className="tracking-widest text-lg text-gray-600">
                        Click or drag to remove items
                    </p>

                    {/* In default mode, show top action buttons + search within list */}
                    {leftMode === "default" ? (
                        <>
                            <div>
                                <button 
                                    id="saveListButton" 
                                    className="listControlButton font-bold py-2 px-4 rounded"
                                    onClick={() => { setLeftMode("save"); 
                                    setLmTab("search"); }}
                                >
                                    Save List
                                </button>

                                <button 
                                    id="loadListButton" 
                                    className="listControlButton font-bold py-2 px-4 rounded"
                                    onClick={() => { setLeftMode("load"); 
                                    setLmTab("search"); }}
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
                                <button 
                                    id="undoListButton" 
                                    className="listControlButton font-bold py-2 px-4 rounded"
                                    onClick={undoLastAction}
                                >
                                    Undo
                                </button>
                            </div>

                            {/* Search within the current active list */}
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
                        <button 
                            className="return-button" 
                            onClick={() => setLeftMode("default")}
                        >
                            Return to List Manager
                        </button>
                    )}

                    {/* Current active list items */}
                    <div id="listContentsWrapper">
                        <ul id="listContents" className="list-none pl-0">
                            {filteredList.map((key) => {
                                const item = (Inventory as any)[key];

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

            {/* Toast popup message */}
            {toastMessage && <div className="toast-message">{toastMessage}</div>}
        </div>
    );
}