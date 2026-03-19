import GroceryList from "./grocerylist";
import TopBar from "./topbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white text-black overflow-hidden">
      <TopBar />
      <main className="flex flex-1 min-h-0">
        <GroceryList />
        {/* map / rest of content goes here */}
      </main>
    </div>
  );
}