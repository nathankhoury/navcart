"use client";

import { useState } from "react";
import Link from "next/link";
import "./css/grocerylist.css";

export default function GroceryList() {
    return (
        <aside className="gl-sidebar">
            <div className="gl-sticky-top">
                <div className="gl-header">
                    <h2 className="gl-title">Grocery List</h2>
                </div>
                <Link href="/list-manager" className="gl-manage-btn">
                    Manage List
                </Link>
            </div>
            <div className="gl-list">
            </div>
        </aside>
    );
}