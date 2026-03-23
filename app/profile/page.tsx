import TopBar from "../topbar";

export default function Profile() {
    return (
        <div className="flex flex-col h-screen bg-white text-black overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <p className="text-gray-500">This is a placeholder profile page.</p>
            </main>
        </div>
    );
}