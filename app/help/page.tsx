import TopBar from "../topbar";
import "../css/help.css";

/*
    Description:
    Help page that explains what NavCart is and how to use its main features.

    Contributors for this file:
    Camila Salinas (last modified: 3/22/2026)
*/

export default function Help() {
    return (
        <div className="help-wrapper">
            <TopBar />
            <main className="help-main">
                <div className="help-container">

                    {/* Header */}
                    <h1 className="help-title">Help</h1>
                    <p className="help-subtitle">
                        Learn how to use NavCart to make your grocery shopping faster and easier.
                    </p>

                    {/* What is NavCart */}
                    <section className="help-section">
                        <h2 className="help-section-title">What is NavCart?</h2>
                        <p className="help-section-text">
                            NavCart is a grocery navigation app designed to help you shop smarter.
                            Build your shopping list, and NavCart will show you the most efficient
                            route through the store so you never have to backtrack.
                        </p>
                    </section>

                    <hr className="help-divider" />

                    {/* Grocery List */}
                    <section className="help-section">
                        <h2 className="help-section-title">📋 Grocery List</h2>
                        <p className="help-section-text">
                            The grocery list appears on the left side of the store map.
                            It shows all the items you have added, grouped by category.
                            You can tap any item to check it off as you pick it up.
                            Checked items are crossed out and faded so you always know what is left.
                            You can also collapse a category by tapping its header to keep the list tidy.
                        </p>
                    </section>

                    <hr className="help-divider" />

                    {/* Store Map */}
                    <section className="help-section">
                        <h2 className="help-section-title">🗺️ Store Map</h2>
                        <p className="help-section-text">
                            The store map shows the layout of your selected store and highlights
                            the most optimal route to collect all your items with the least amount
                            of walking. The route updates automatically based on what is in your list.
                        </p>
                    </section>

                    <hr className="help-divider" />

                    {/* Manage List */}
                    <section className="help-section">
                        <h2 className="help-section-title">✏️ Manage List</h2>
                        <p className="help-section-text">
                            The Manage List page is where you build your grocery list.
                            Search for any item by name or category, then click it to add it to your list.
                            You can also remove individual items by clicking them in your list,
                            or use the buttons at the top to save your list for later, load a
                            previously saved list, or clear everything and start fresh.
                        </p>
                    </section>

                    <hr className="help-divider" />

                    {/* Profile */}
                    <section className="help-section">
                        <h2 className="help-section-title">👤 Profile & Settings</h2>
                        <p className="help-section-text">
                            The Profile page lets you manage your account and customize your experience.
                        </p>
                    </section>

                    <hr className="help-divider" />

                    {/* Store Location */}
                    <section className="help-section">
                        <h2 className="help-section-title">📍 Store Location</h2>
                        <p className="help-section-text">
                            Use the dropdown in the top navigation bar to select your store location.
                            Aisle information and the store map are specific to each location,
                            so make sure to select the right store before you start shopping.
                        </p>
                    </section>

                </div>
            </main>
        </div>
    );
}