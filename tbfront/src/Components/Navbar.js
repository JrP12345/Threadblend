import React, { useState, useEffect, useRef } from "react";
import "../Styles/Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import db from "../firebase";
import { useSearch } from "./SearchContext";
const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchResultRef = useRef(null);
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/logout", {
        method: "DELETE",
        credentials: "include", // Ensure credentials are sent with the request (cookies)
      });

      if (response.ok) {
        // Perform any additional client-side cleanup or redirection if needed
        console.log("Logout successful");
        localStorage.removeItem("selectedProducts");
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(e.target)
      ) {
        setSearchQuery(""); // Reset search query when clicking outside the search result container
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [searchResultRef]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:4000/user/userprofile", {
          method: "GET",
          credentials: "include", // Ensure credentials are sent with the request (cookies)
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data.user);
        } else {
          console.error("Failed to fetch user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array ensures the effect runs only once on mount
  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      const productsRef = db.ref("products");
      productsRef.on("value", (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsArray = Object.entries(productsData).map(
            ([key, value]) => ({
              id: key,
              ...value,
            })
          );
          setProducts(productsArray.reverse());
        }
        setLoading(false);
      });
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const filteredProducts = products.filter((product) => {
    const productName = (product.productName || "").toLowerCase();
    return productName.includes(searchQuery.toLowerCase());
  });

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  // console.log("filteredProducts:", filteredProducts);

  const { openCart } = useCart();
  return (
    <>
      <nav>
        <div className="navcontainer">
          <div className="logocontainer">
            <h1 className="logotxt">
              <Link to="/home" className="nav-link">
                ThreadBlend
              </Link>
            </h1>
          </div>
          <div className="serchcontainer">
            <input
              type="text"
              className="searchinput"
              placeholder="Search For Tshirts"
              value={searchQuery}
              onChange={handleChange}
            />
          </div>
          <div className="navitemcontainer">
            <Link to="/home" className="nav-link">
              HOME
            </Link>
            <Link to="/men" className="nav-link">
              MEN
            </Link>
            <Link to="/women" className="nav-link">
              WOMEN
            </Link>
            <Link to="/about" className="nav-link">
              ABOUT
            </Link>
            <Link to="/contact" className="nav-link">
              CONTACT US
            </Link>
          </div>

          <div className="logcartcontainer">
            <div className="loginncontainer">
              {userDetails ? (
                <h3 className="cattext">{userDetails.name}</h3>
              ) : (
                <h2 className="cattext">Loading</h2>
              )}
            </div>
            <div className="logoutcontainer">
              <button onClick={handleLogout} className="logoutbtn">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
            <div className="cartcontainer" onClick={openCart}>
              <i className="fa-solid fa-cart-shopping" />
            </div>
          </div>
        </div>
      </nav>
      {!loading & !window.location.pathname.includes("/men") &&
        !window.location.pathname.includes("/women") && (
          <div
            className={`search-result-container ${
              searchQuery.trim() !== "" ? "visible" : ""
            }`}
            ref={searchResultRef}
          >
            {/* Render your products from filteredProducts */}
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                className="productLink"
                key={product.id}
              >
                <div key={product.id}>
                  {/* Render each product */}
                  <p>{product.productName}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
    </>
  );
};

export default Navbar;
