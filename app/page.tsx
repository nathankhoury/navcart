

import Link from "next/link";
import TopBar from "./topbar";
import "./css/home.css";


export default function Home() {
    return (
        <div className="home-wrapper">
            <TopBar />


            <main className="home-hero">
                <p className="home-eyebrow">NavCart</p>
                <h1 className="home-title">Shopping Made Simple</h1>
                <p className="home-subtitle">
                    Build your grocery list and get a personalized route through
                    the store!
                </p>


                <div className="home-get-started">
                    <p className="home-get-started-heading">Get Started</p>


                    <div className="home-card-row">


                        <Link href="/list-manager" className="home-card home-card--primary">
                            <div className="home-card-icon home-card-icon--green">🛒</div>
                            <p className="home-card-label">Create Shopping List</p>
                            <p className="home-card-desc">
                                Add items and organize your grocery run.
                            </p>
                            <span className="home-card-arrow">→</span>
                        </Link>


                        <Link href="/store-map" className="home-card">
                            <div className="home-card-icon home-card-icon--blue">🗺️</div>
                            <p className="home-card-label">View Store Map</p>
                            <p className="home-card-desc">
                                See the store layout and plan your route.
                            </p>
                            <span className="home-card-arrow">→</span>
                        </Link>


                    </div>
                </div>
            </main>
        </div>
    );
}
