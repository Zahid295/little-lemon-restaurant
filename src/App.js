import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Highlights from "./components/Highlights/Highlights";
import Testimonials from "./components/Testimonials/Testimonials";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
    <header>
      <Navbar />
    </header>

    <main>
      <Hero />
      <Highlights />
      <Testimonials />
      <About />
      <Footer />
    </main>
    </>
  );
}

export default App;
