import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./AppRoutes";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
    <CartProvider>
    <Router>
      <Navbar />
      <AppRoutes />
      <Footer />
    </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;

