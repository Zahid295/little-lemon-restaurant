import { useState } from "react";
import "./Navbar.css"
export default function Nav() {
    const [open, setOpen] = useState(false);


    return (
        <nav className="navbar">
                <a href="/" className="logo-link">
                    <img 
                    src="images/logo.jpg" 
                    alt="logo" 
                    className="logo-img"
                    />
                </a>
            
            <button className="hamburger" onClick={() => setOpen(!open)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`nav-links ${open ? "open": ""}`}>
                <li><a href="/">HOME</a></li>
                <li><a href="/about">ABOUT</a></li>
                <li><a href="/menu">MENU</a></li>
                <li><a href="/reservations">RESERVATIONS</a></li>
                <li><a href="order-online">ORDER ONLINE</a></li>
                <li><a href="login">LOGIN</a></li>
            </ul>
        </nav>
    );
}