import { Bell, Search } from "lucide-react";

export default function Header() {
    return (
        <header className="header">
            <div>
                <h1>Patient Progress Tracker</h1>
                <p>Monitor patient health and progress</p>
            </div>

            <div className="header-actions">
                <div className="search-box">
                    <Search size={18} />
                    <input placeholder="Search patients..." />
                </div>

                <button className="icon-button">
                    <Bell size={20} />
                </button>

                <div className="profile">
                    <div className="profile-avatar">DR</div>
                    <div>
                        <strong>Dr. User</strong>
                        <span>Healthcare Provider</span>
                    </div>
                </div>
            </div>
        </header>
    );
}