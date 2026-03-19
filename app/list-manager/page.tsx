import TopBar from "../topbar";
import "../css/styles.css";

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
                    <p>left side of page</p>
                </div>
                <div id="right" className="list-management-panel">
                    <p>right side of page</p>
                </div>
            </div>
        </div>
    );
}