import TopBar from "../topbar";
import "../css/styles.css";

{/* 
    Considering for search bar:
    https://flowbite.com/docs/forms/search-input/
    https://www.material-tailwind.com/docs/html/input-search
    https://tomdekan.com/articles/react-search-bar?ref=r-react
*/}

{/*
    page.tsx is the file that defines the content of the page at the route /list-manager,
    think of it like the main body of the page, and other .tsx files in the same directory
    are supporting components that you can import and use in page.tsx
*/}

export default function ListManager() {
    {/* return one single parent div (or other element, but div wrapper seems to work best) */}
    return (
        <div id="lm-page-wrapper" className="bg-white text-black">
            {/* Drop in the top bar component */}
            <TopBar/>

            <div id="lm-content-wrapper">    
                {/* The left half of the screen is represented here */}
                <div id="left" className="list-management-panel">
                    <h1 className="panel-header text-4xl font-bold text-heading">Search Items</h1>
                    <p className="tracking-widest text-lg text-gray-600">Click items to add them to your list</p>
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
                </div>
            </div>
        </div>
    );
}