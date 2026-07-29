export default function Nav() {
    return (
        <nav>
            <div>
                <a href="/">
                    <img alt="logo"/>
                </a>
            </div>
            <ul>
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