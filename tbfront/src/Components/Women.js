import React, { useEffect, useState } from "react";
import "../Styles/Men.css";
import db from "../firebase";
import { useCart } from "./CartContext";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import { useSearch } from "./SearchContext";

function Women() {
  const { searchQuery } = useSearch();

  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("None"); // State for selected color
  const [selectedSize, setSelectedSize] = useState("None");
  const [selectedPrice, setSelectedPrice] = useState("None");
  const [selectedCategory, setselectedCategory] = useState("None");
  const [cart, setCart] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const { addToCart } = useCart();

  const handleBuyNow = (productId) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    addToCart(selectedProduct);
  };

  useEffect(() => {
    const fetchProducts = () => {
      setLoadingImages(true);
      const productsRef = db.ref("products");
      productsRef.on("value", (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsArray = Object.entries(productsData)
            .map(([key, value]) => ({
              id: key,
              ...value,
            }))
            .filter(
              (product) =>
                (product.gender === "female" || product.gender === "unisex") &&
                (selectedColor === "None" || product.color === selectedColor) &&
                (selectedSize === "None" || product.size === selectedSize) &&
                (selectedPrice === "None" ||
                  checkPriceRange(product.price, selectedPrice)) &&
                (selectedCategory === "None" ||
                  product.category === selectedCategory) &&
                product.quantityAvailable > 0 &&
                // Include search query in the filter
                product.productName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            ); // Include both male and unisex products
          setProducts(productsArray.reverse());
          setLoadingImages(false);
        }
      });
    };

    fetchProducts();
  }, [
    selectedColor,
    selectedSize,
    selectedPrice,
    selectedCategory,
    searchQuery,
  ]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };
  const handlePriceChange = (price) => {
    setSelectedPrice(price);
  };
  const handleCategoryChange = (category) => {
    setselectedCategory(category);
  };
  // Function to check if a product's price is within the selected range
  const checkPriceRange = (productPrice, selectedPrice) => {
    const [min, max] = selectedPrice.split("-").map(Number);
    return productPrice >= min && productPrice <= max;
  };
  useEffect(() => {
    // Load cart data from localStorage when the component mounts
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  useEffect(() => {
    // Update localStorage with the new cart data whenever cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <div className="mencontainer">
        <div className="menitemcontainer">
          <div className="filtercontainer">
            <div className="filteritemcontainer">
              <h2 className="filtertitle">Category</h2>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="category"
                  value="None"
                  checked={selectedCategory === "None"}
                  onChange={() => handleCategoryChange("None")}
                />{" "}
                None
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="category"
                  value="Tshirt"
                  checked={selectedCategory === "Tshirt"}
                  onChange={() => handleCategoryChange("Tshirt")}
                />{" "}
                Tshirt
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="category"
                  value="Shirt"
                  checked={selectedCategory === "Shirt"}
                  onChange={() => handleCategoryChange("Shirt")}
                />{" "}
                Shirt
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="category"
                  value="Kurta"
                  checked={selectedCategory === "Kurta"}
                  onChange={() => handleCategoryChange("Kurta")}
                />{" "}
                Kurta
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="category"
                  value="Hoodies"
                  checked={selectedCategory === "Hoodies"}
                  onChange={() => handleCategoryChange("Hoodies")}
                />{" "}
                Hoodies
              </label>
            </div>

            <div className="filteritemcontainer">
              <h2 className="filtertitle">Price</h2>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="price"
                  value="None"
                  checked={selectedPrice === "None"}
                  onChange={() => handlePriceChange("None")}
                />{" "}
                None
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="price"
                  value="Below500"
                  checked={selectedPrice === "Below500"}
                  onChange={() => handlePriceChange("Below500")}
                />{" "}
                Below Rs.500
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="price"
                  value="500-1000"
                  checked={selectedPrice === "500-1000"}
                  onChange={() => handlePriceChange("500-1000")}
                />{" "}
                Rs.500-1000
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="price"
                  value="1001-1500"
                  checked={selectedPrice === "1001-1500"}
                  onChange={() => handlePriceChange("1001-1500")}
                />{" "}
                Rs.1001-1500
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="price"
                  value="1501-2000"
                  checked={selectedPrice === "1501-2000"}
                  onChange={() => handlePriceChange("1501-2000")}
                />{" "}
                Rs.1501-2000
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="price"
                  value="2001-2500"
                  checked={selectedPrice === "2001-2500"}
                  onChange={() => handlePriceChange("2001-2500")}
                />{" "}
                Rs.2001-2500
              </label>
            </div>

            <div className="filteritemcontainer">
              <h2 className="filtertitle">Size</h2>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="size"
                  value="None"
                  checked={selectedSize === "None"}
                  onChange={() => handleSizeChange("None")}
                />{" "}
                None
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="size"
                  value="small"
                  checked={selectedSize === "small"}
                  onChange={() => handleSizeChange("small")}
                />{" "}
                Small
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="size"
                  value="medium"
                  checked={selectedSize === "medium"}
                  onChange={() => handleSizeChange("medium")}
                />{" "}
                Medium
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="size"
                  value="large"
                  checked={selectedSize === "large"}
                  onChange={() => handleSizeChange("large")}
                />{" "}
                Large
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="size"
                  value="xl"
                  checked={selectedSize === "xl"}
                  onChange={() => handleSizeChange("xl")}
                />{" "}
                XL
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="size"
                  value="xxl"
                  checked={selectedSize === "xxl"}
                  onChange={() => handleSizeChange("xxl")}
                />{" "}
                XXL
              </label>
            </div>

            <div className="filteritemcontainer">
              <h2 className="filtertitle">Color</h2>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="None"
                  checked={selectedColor === "None"}
                  onChange={() => handleColorChange("None")}
                />{" "}
                None
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="Black"
                  checked={selectedColor === "Black"}
                  onChange={() => handleColorChange("Black")}
                />{" "}
                Black
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="White"
                  checked={selectedColor === "White"}
                  onChange={() => handleColorChange("White")}
                />{" "}
                White
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="Blue"
                  checked={selectedColor === "Blue"}
                  onChange={() => handleColorChange("Blue")}
                />{" "}
                Blue
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="Red"
                  checked={selectedColor === "Red"}
                  onChange={() => handleColorChange("Red")}
                />{" "}
                Red
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="Yellow"
                  checked={selectedColor === "Yellow"}
                  onChange={() => handleColorChange("Yellow")}
                />{" "}
                Yellow
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="Orange"
                  checked={selectedColor === "Orange"}
                  onChange={() => handleColorChange("Orange")}
                />{" "}
                Orange
              </label>
              <label className="filterlbl">
                <input
                  type="radio"
                  name="color"
                  value="Gray"
                  checked={selectedColor === "Gray"}
                  onChange={() => handleColorChange("Gray")}
                />{" "}
                Gray
              </label>
            </div>
          </div>
          <div className="menproductcontainer">
            {loadingImages ? (
              <div className="loading-spinner-wrapper">
                <ReactLoading
                  type="bubbles"
                  color="black"
                  height={50}
                  width={50}
                />
              </div>
            ) : (
              products.map((product, index) => (
                <div className="productitemcontainer" key={product.id}>
                  <Link to={`/product/${product.id}`} className="productLink">
                    <div className="productimg-container">
                      {product.imageUrl && (
                        <>
                          <div className="loading-overlay"></div>
                          <img
                            key={product.id}
                            src={product.imageUrl}
                            className={`productimg ${
                              loadingImages ? "loading" : "loaded"
                            }`}
                            alt="no"
                            onLoad={() => setLoadingImages(false)}
                          />
                        </>
                      )}
                    </div>
                    <div className="indexitemicon">
                      <h3 className="ptxt">{product.productName}</h3>
                    </div>
                    <div className="indexitemicon">
                      <h3 className="ptxt">Rs.{product.price}</h3>
                    </div>
                  </Link>
                  <div className="productbtncontiner">
                    <button
                      className="pabtn"
                      onClick={() => handleBuyNow(product.id)}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Women;
