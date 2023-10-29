// CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import db from "../firebase";

import "firebase/compat/database";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [cartRef, setCartRef] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/userprofile", {
        method: "GET",
        credentials: "include", // Ensure credentials are sent with the request (cookies)
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.user);

        // Fetch cart data from Firebase when the user logs in
        if (data.user) {
          const userCartRef = db.ref(`carts/${data.user.id}`);
          setCartRef(userCartRef);

          userCartRef.once("value", (snapshot) => {
            const firebaseCart = snapshot.val();
            if (firebaseCart) {
              setCart(firebaseCart);
            }
          });
        }
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };
  useEffect(() => {
    // Check the current route
    const currentRoute = window.location.pathname;

    // Fetch user details and cart data on component mount, excluding /login and /register
    if (currentRoute !== "/login" && currentRoute !== "/register") {
      fetchUserDetails();
    }
  }, []);
  // Function to handle login
  const handleLoginn = () => {
    // Fetch user details and cart data when the user logs in
    fetchUserDetails();
  };
  useEffect(() => {
    // Set up Firebase reference when userDetails is available
    if (userDetails) {
      const userCartRef = db.ref(`carts/${userDetails._id}`);
      setCartRef(userCartRef);
      // console.log('userDetails:', userDetails);
      // console.log('userCartRef:', userCartRef);

      // Fetch existing cart data for the user
      userCartRef.once("value", (snapshot) => {
        const firebaseCart = snapshot.val();
        if (firebaseCart) {
          setCart(firebaseCart);
        }
      });
    }
  }, [userDetails]);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addToCart = (product) => {
    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update the quantity
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.totalPrice + parseInt(item.price),
            }
          : item
      );
      setCart(updatedCart);

      // Update cart data in Firebase
      if (cartRef) {
        cartRef.set(updatedCart).catch((error) => {
          console.error("Error updating cart data in Firebase:", error.message);
        });
      }
    } else {
      // If the product is not in the cart, add it as a new item
      const updatedProduct = {
        ...product,
        quantity: 1,
        totalPrice: parseInt(product.price) || 0,
        userId: userDetails && userDetails._id ? userDetails._id : null,
      };

      // Update local cart state
      const updatedCart = [...cart, updatedProduct];
      setCart(updatedCart);

      // Update cart data in Firebase
      if (cartRef) {
        cartRef.set(updatedCart).catch((error) => {
          console.error("Error updating cart data in Firebase:", error.message);
        });
      }
    }
  };

  const removeFromCart = (productId) => {
    // Remove the item from the local cart state
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);

    // Update cart data in Firebase
    if (cartRef) {
      cartRef.set(updatedCart).catch((error) => {
        console.error("Error updating cart data in Firebase:", error.message);
      });
    }
  };

  const checkout = () => {
    // Log the data before the update
    // console.log('Data to be updated:', cart);

    // Check if any quantity is NaN
    const hasNaNQuantity = cart.some((product) => isNaN(product.quantity));

    if (hasNaNQuantity) {
      console.error("Invalid quantity detected. Aborting update.");
      return;
    }

    // Assuming 'products' is the correct path in your Firebase
    cart.forEach((product) => {
      const quantityAvailable = parseInt(product.quantityAvailable, 10) || 0;
      const newQuantity = Math.max(0, quantityAvailable - product.quantity);

      // Update the quantity directly in the database
      db.ref(`products/${product.id}/quantityAvailable`).set(newQuantity);
    });

    // Store order information in the 'orders' database
    const totalAmount = cart.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    if (userDetails && userDetails._id) {
      const orderData = {
        userId: userDetails._id,
        username: userDetails.name, // Change this to the appropriate property in your userDetails
        email: userDetails.email,
        totalAmount,
        products: cart,
      };

      // Assuming 'orders' is the correct path for your orders in Firebase
      const orderRef = db.ref("orders").push();
      orderRef
        .set(orderData)
        .then(() => {
          // console.log('Order data stored successfully:', orderData);
        })
        .catch((error) => {
          console.error("Error storing order data in Firebase:", error.message);
        });
    }

    // For simulation purposes, clear the cart after checkout
    clearCart();
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((product) => {
        if (product.id === productId) {
          const quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
          const totalPrice = quantity * parseInt(product.price);

          // Convert quantityAvailable to a number
          const quantityAvailable =
            parseInt(product.quantityAvailable, 10) || 0;

          console.log("Updating quantity:", productId, quantity);
          console.log("Quantity available:", quantityAvailable);

          // Ensure quantity is a valid number and does not exceed quantityAvailable
          if (!isNaN(quantity) && quantity <= quantityAvailable) {
            console.log("Updating cart with new values:", {
              ...product,
              quantity,
              totalPrice,
            });
            return { ...product, quantity, totalPrice };
          } else {
            console.error("Invalid quantity:", newQuantity);
            return product;
          }
        } else {
          return product;
        }
      })
    );
  };

  const clearCart = () => {
    // Clear local cart state
    setCart([]);

    // Clear cart data in Firebase
    if (cartRef) {
      cartRef.set([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        clearCart,
        cart,
        checkout,
        userDetails,
        handleLoginn,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
