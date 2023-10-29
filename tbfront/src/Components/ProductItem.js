import React from "react";

function ProductItem({ products, handleBuyNow }) {
  return (
    <>
      <div className="itemproductcontainer">
        {products.map((product, index) => (
          <div className="productitemcontainer" key={product.id}>
            <div className="indexitemicon">
              {product.imageUrl && (
                <img
                  key={product.id}
                  src={product.imageUrl}
                  className="productimg"
                  alt="no"
                />
              )}
            </div>
            <div className="indexitemicon">
              <h3>{product.productName}</h3>
            </div>
            <div className="indexitemicon">
              <h3>{product.price}</h3>
            </div>

            <div className="productbtncontiner">
              <button
                className="productdeletebtn"
                onClick={() => handleBuyNow(product.id)}
              >
                BuyNow
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductItem;
