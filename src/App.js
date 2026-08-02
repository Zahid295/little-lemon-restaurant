import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
// import Hero from "./components/Hero/Hero";
// import Highlights from "./components/Highlights/Highlights";
// import Testimonials from "./components/Testimonials/Testimonials";
// import About from "./components/About/About";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
