import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import db from "../firebase";
import "../Styles/ProductDetail.css"; // Import your CSS file
import { useCart } from "./CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      const productRef = db.ref(`products/${id}`);

      try {
        const snapshot = await productRef.once("value");
        const productData = snapshot.val();

        if (productData) {
          setProduct({
            id,
            ...productData,
          });

          // Fetch related products based on the category
          if (productData.category) {
            const relatedProductsRef = db
              .ref("products")
              .orderByChild("category")
              .equalTo(productData.category)
              .limitToFirst(4);

            const relatedSnapshot = await relatedProductsRef.once("value");
            const relatedProductsData = relatedSnapshot.val();

            if (relatedProductsData) {
              const relatedProductsArray = Object.entries(
                relatedProductsData
              ).map(([key, value]) => ({
                id: key,
                ...value,
              }));

              // Filter out the current product from related products
              const filteredRelatedProducts = relatedProductsArray.filter(
                (relatedProduct) => relatedProduct.id !== id
              );

              setRelatedProducts(filteredRelatedProducts);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);
  if (loading) {
    return (
      <div className="product-details-container">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        No product details available for ID: {id}
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-details-container">
      <div className="details-row">
        <div className="details-column">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="product-image"
          />
        </div>
        <div className="details-column">
          <p>Name: {product.productName}</p>
          <p>Price: Rs.{product.price}</p>
          <p>Category: {product.category}</p>
          <p>Brand: {product.brand}</p>
          <p>Color: {product.color}</p>
          <p>Size: {product.size}</p>
          <p>Material: {product.material}</p>
          <p>Description: {product.description}</p>

          <div className="productbtncontiner">
            <button className="pabtn" onClick={handleAddToCart}>
              Add To Cart
            </button>
            <button onClick={handleAddToCart} className="buyconbtn">
              <Link to={`/buy/${product.id}`} className="buybtn">
                Buy Now
              </Link>
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-container">
          <h2>Related Products</h2>
          <div className="related-products">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="related-product">
                <Link
                  to={`/product/${relatedProduct.id}`}
                  className="productLink"
                >
                  <img
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.productName}
                    className="related-product-image"
                  />
                  <p>{relatedProduct.productName}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
