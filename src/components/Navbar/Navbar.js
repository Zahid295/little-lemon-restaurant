import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css"
export default function Nav() {
    const [open, setOpen] = useState(false);


    return (
        <nav 
        className="navbar"
        aria-label="Main navigation"
        >
                <Link to="/" className="logo-link">
                    <img 
                    src="images/logo.jpg" 
                    alt="Little Lemon logo" 
                    className="logo-img"
                    />
                </Link>
            
            <button 
            className="hamburger"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(!open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`nav-links ${open ? "open": ""}`}>
                <li><Link to="/">HOME</Link></li>
                <li><Link to="/about">ABOUT</Link></li>
                <li><Link to="/menu">MENU</Link></li>
                <li><Link to="/reservations">RESERVATIONS</Link></li>
                <li><Link to="/order-online">ORDER ONLINE</Link></li>
                <li><Link to="/login">LOGIN</Link></li>
            </ul>
        </nav>
    );
}