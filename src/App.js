import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./AppRoutes";
import { CartProvider } from "./context/CartContext";
function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar />
      <AppRoutes />
      <Footer />
    </Router>
    </CartProvider>
  );
}

export default App;

