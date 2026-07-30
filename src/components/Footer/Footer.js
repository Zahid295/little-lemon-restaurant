export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <a href="/">
                    <img 
                    src="images/footer-logo.png" 
                    alt="logo" 
                    className="logo-img"
                    />
                 <span>Little Lemon</span>
                </a>
            </div>

            <nav>
                <h4>Navigation</h4>
                <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/menu">Menu</a></li>
                <li><a href="/reservations">Reservations</a></li>
                <li><a href="order-online">Order Online</a></li>
                <li><a href="login">Login</a></li></ul>
            </nav>

            <address className="footer-contact">
                <h4>Contact</h4>
                Address <br />
                Phone Number <br />
                Email
            </address>

            <nav className="footer-media">
                <h4>Social Media</h4>
                <ul>
                    <li><a href="/">Instagram</a></li>
                    <li><a href="/">Facebook</a></li>
                    <li><a href="/">Twitter</a></li>
                </ul>
            </nav>
        </footer>
    );
}