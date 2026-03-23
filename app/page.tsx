import TopBar from "./topbar";
import GroceryList from "./grocery-list/page";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white text-black overflow-hidden">
      <TopBar />
      <main className="flex flex-1 min-h-0">
        <GroceryList />
        {/* Placeholder for the store map */}
        <div className="flex-1 bg-zinc-50" />
      </main>
    </div>
  );
}