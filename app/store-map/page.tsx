import TopBar from "../topbar";
import "../css/styles.css";
import StoreMap from "./StoreMap";

export default function StoreMapPage() {
    return (
    <>
    <TopBar />
    
    <main className="min-h-screen bg-white p-6 text-black">
        <div className="mx-auto max-w-6xl">
            <h1 className="mb-3 text-3xl font-bold">
                Market Basket Store Map
            </h1>
            <p className="mb-6 text-gray-700">
                This page visualizes store sections and highlights where grocery 
                items are located based on the inventory dataset.
            </p>
            
            <StoreMap />
        </div>
    </main>
    </>
    );
}