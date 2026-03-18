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
            <TopBar/>
            <div id="lm-content-wrapper">    
                <div id="left" className="list-management-panel">
                    <h1 className="panel-header text-4xl font-bold text-heading">Search Items</h1>
                    <p className="tracking-widest text-lg text-gray-600">Click items to add them to your list</p>
                </div>
                <div id="right" className="list-management-panel">
                    <h1 className="panel-header text-4xl font-bold text-headingr">Your List</h1>
                    <p className="tracking-widest text-lg text-gray-600">Click items to remove them from your list</p>
                </div>
            </div>
        </div>
    );
}