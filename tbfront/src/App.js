import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Men from "./Components/Men";
import ProductDetails from "./Components/ProductDetails ";
import Women from "./Components/Women";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import "./App.css";
import Cart from "./Components/Cart";
import BuyNow from "./Components/BuyNow";
import { CartProvider } from "./Components/CartContext";
import { SearchProvider } from "./Components/SearchContext";
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <SearchProvider>
        <CartProvider>
          {/* Use a conditional rendering for Navbar and Footer */}
          {location.pathname !== "/login" &&
            location.pathname !== "/register" && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/men" element={<Men />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/women" element={<Women />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/buy/:id" element={<BuyNow />} />
          </Routes>
          {location.pathname !== "/login" &&
            location.pathname !== "/register" && <Footer />}
          <Cart onClose={() => console.log()} />
        </CartProvider>
      </SearchProvider>
    </>
  );
}

export default App;
