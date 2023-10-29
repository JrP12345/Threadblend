// import React, { useEffect, useState } from "react";
// import "../Styles/Toppicks.css";
// import { onChildAdded, ref as dbRef } from "firebase/database";
// import db from "../firebase";
// import PicContainer from "./PicContainer";

// function Toppicks() {
//   const [imageData, setImageData] = useState([]);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const topPicksRef = dbRef(db, "topPicksImages");

//         onChildAdded(topPicksRef, (snapshot) => {
//           const newImage = snapshot.val();
//           setImageData((prevData) => {
//             const updatedData = [...prevData, newImage];
//             return updatedData;
//           });
//         });
//       } catch (error) {
//         console.error("Error fetching images from the database:", error);
//       }
//     };

//     fetchImages();
//   }, []);

//   return (
//     <>
//       <div className="heading">
//         <h1>Top Picks</h1>
//       </div>
//       <PicContainer imageData={imageData} />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import db from "../firebase";
import PicContainer from "./PicContainer";

function TopPicks() {
  const [imageData, setImageData] = useState([]);
  const [fetchedAndStored, setFetchedAndStored] = useState(false);

  useEffect(() => {
    const fetchTopPriceProducts = () => {
      try {
        // Check if products are stored in local storage and not already fetched
        const storedProducts = localStorage.getItem("topPriceProducts");

        if (!fetchedAndStored && storedProducts) {
          // If products are stored and not fetched, use them
          setImageData(JSON.parse(storedProducts));
          setFetchedAndStored(true);
        } else {
          // Otherwise, fetch and store top 3 products based on price
          const productsRef = db.ref("products");
          productsRef.once("value", (snapshot) => {
            const productsData = snapshot.val();
            if (productsData) {
              const productsArray = Object.entries(productsData).map(
                ([key, value]) => ({
                  id: key,
                  ...value,
                })
              );

              // Sort the productsArray based on price in descending order
              const sortedProducts = productsArray.sort(
                (a, b) => b.price - a.price
              );

              // Select the top 3 products
              const top3Products = sortedProducts.slice(0, 3);

              // Map the top 3 products to the format expected by PicContainer
              const formattedData = top3Products.map((product) => ({
                id: product.id,
                imageUrl: product.imageUrl, // Change this to the actual image URL property
                // Add other properties as needed
              }));

              // Store the top 3 products in local storage
              localStorage.setItem(
                "topPriceProducts",
                JSON.stringify(formattedData)
              );

              setImageData(formattedData);
              setFetchedAndStored(true);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching products from the database:", error);
      }
    };

    fetchTopPriceProducts();
  }, [fetchedAndStored]);

  return (
    <>
      <div className="heading">
        <h1>Premium Picks</h1>
      </div>
      <PicContainer imageData={imageData} />
    </>
  );
}

export default TopPicks;
