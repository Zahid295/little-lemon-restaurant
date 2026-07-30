export default function Nav() {
    return (
        <nav className="navbar">
            <div className="logo">
                <a href="/">
                    <img 
                    src="images/logo.jpg" 
                    alt="logo" 
                    className="logo-img"
                    />
                </a>
            </div>
            <ul className="nav-links">
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