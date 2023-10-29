import React from "react";
import { useCart } from "./CartContext";
import "../Styles/Cart.css"; // Import a CSS file for styling

function Cart({ onClose }) {
  const { cart, clearCart, updateQuantity, checkout, userDetails } = useCart();
  const { isCartOpen, closeCart, removeFromCart } = useCart(); // Ensure you are using isCartOpen and closeCart

  // Filter cart items based on user ID
  const userCart = cart.filter((item) => item.userId === userDetails?._id);

  const calculateTotalPrice = () => {
    if (!userCart || userCart.length === 0) {
      return 0;
    }

    const totalPrice = userCart.reduce(
      (total, product) => total + product.quantity * parseInt(product.price),
      0
    );

    return totalPrice;
  };
  const handleClose = () => {
    // console.log("Closing cart");
    closeCart(); // Close the cart using the closeCart function
    if (onClose && typeof onClose === "function") {
      onClose(); // Call the onClose function provided through props if it's a function
    }
  };
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };
  if (!isCartOpen) {
    return null; // Return null if the cart is not open
  }
  const handleRemove = (productId) => {
    removeFromCart(productId);
  };
  return (
    <div className="cart-modal">
      <div className="cart-content">
        <div className="firstcontainer">
          <h2 className="carttxt">CART</h2>
          <h3 onClick={handleClose}>
            <i className="fa-solid fa-xmark cancelicon"></i>
          </h3>
        </div>
        <div className="secondcontainer">
          <div className="cartitem">
            {userCart && userCart.length > 0 ? (
              userCart.map((product) => (
                <div key={product.id} className="cart-item">
                  <img
                    className="cartimg"
                    src={product.imageUrl}
                    alt={product.productName}
                  />
                  <div className="deatilcartconatiner">
                    <div className="deatil1container">
                      <p className="titletxt">{product.productName}</p>
                      <p className="btxt">Rs.{product.price}</p>
                    </div>
                    <div className="detail2container">
                      <div className="firtshalf">
                        <div className="sizcolcontainer">
                          <p className="btxt">Size </p>
                          <p className="value">{product.size}</p>
                        </div>
                        <div className="sizcolcontainer">
                          <p className="btxt">Color</p>
                          <p className="value">{product.color}</p>
                        </div>
                      </div>
                      <div className="secondhalf">
                        <div className="quantity-container">
                          <div className="quantity-input">
                            <button
                              className="qbtn"
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  product.quantity - 1
                                )
                              }
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>
                            <p className="qtxt">{product.quantity}</p>
                            <button
                              className="qbtn"
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  product.quantity + 1
                                )
                              }
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                            <button
                              className="remove-btn"
                              onClick={() => handleRemove(product.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
        </div>
        <div className="thirdcontainer">
          <button onClick={clearCart} className="clearbtn">
            Clear Cart
          </button>
          <p className="totaltxt">Total Price : Rs.{calculateTotalPrice()}</p>
        </div>
        <div className="fourtcontainer">
          <button className="checkoutbtn" onClick={checkout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
