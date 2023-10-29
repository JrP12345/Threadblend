import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import db from "../firebase";
import { useNavigate } from "react-router-dom";
import "../Styles/BuyNow.css";
const BuyNow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Initialize quantity with 1

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/userprofile", {
        method: "GET",
        credentials: "include",
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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productRef = db.ref(`products/${id}`);
        const snapshot = await productRef.once("value");
        const productData = snapshot.val();

        if (productData) {
          setProduct({
            id,
            ...productData,
          });
        } else {
          console.error(`No product details available for ID: ${id}`);
        }
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchUserDetails();
    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (event) => {
    // Ensure the quantity is a positive integer
    const newQuantity = Math.max(1, parseInt(event.target.value, 10) || 1);
    setQuantity(newQuantity);
  };

  const handlePayNow = () => {
    // Check if the quantity is NaN or not a positive integer
    if (isNaN(quantity) || quantity < 1) {
      console.error("Invalid quantity detected. Aborting update.");

      return;
    }

    const quantityAvailable = parseInt(product.quantityAvailable, 10) || 0;
    const newQuantity = Math.max(0, quantityAvailable - quantity);

    // Update the quantity directly in the database
    db.ref(`products/${product.id}/quantityAvailable`)
      .set(newQuantity)
      .then(() => {
        // console.log("Product quantity updated successfully.");

        // Store order information in the 'orders' database
        const orderData = {
          userId: userDetails._id, // Assuming userDetails contains user information
          username: userDetails.name, // Change this to the appropriate property in your userDetails
          email: userDetails.email,
          totalAmount: product.price * quantity, // Assuming totalPrice is calculated correctly
          product: {
            id: product.id,
            name: product.productName,
            quantity: quantity,
            price: product.price,
            totalPrice: product.price * quantity,
          },
        };

        // Assuming 'orders' is the correct path for your orders in Firebase
        const orderRef = db.ref("orders").push();
        return orderRef.set(orderData); // Return the promise for chaining
      })
      .then(() => {
        // console.log("Order data stored successfully.");
        navigate("/home");
      })
      .catch((error) => {
        console.error(
          "Error updating product quantity in Firebase:",
          error.message
        );
      });
  };

  return (
    <div className="product-details-container">
      <h1>{product && product.productName}</h1>
      {product && (
        <div className="details-row">
          <div className="details-column">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="product-image"
            />
          </div>
          <div className="details-column">
            <p>Price: Rs.{product.price}</p>
            <div className="quantity-container">
              <label htmlFor="quantity">Quantity : </label>
              <input
                type="number"
                id="quantity"
                className="quantity-input-field"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
            </div>
            <div className="productbtncontiner">
              <button className="pabtn" onClick={handlePayNow}>
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyNow;
