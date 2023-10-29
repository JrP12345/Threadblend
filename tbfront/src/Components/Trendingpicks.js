// import React, { useEffect, useState } from "react";
// import "../Styles/Trendingpicks.css";
// import { onChildAdded, ref as dbRef } from "firebase/database";
// import db from "../firebase";
// import PicContainer from "./PicContainer";
// function Trendingpicks() {
//   const [imageData, setImageData] = useState([]);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const trendingStylesRef = dbRef(db, "trendingStylesImages");
//         onChildAdded(trendingStylesRef, (snapshot) => {
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
//   }, []); // Empty dependency array to run this effect only once on mount
//   return (
//     <>
//       <div className="heading">
//         <h1>Trending Picks</h1>
//       </div>
//       <PicContainer imageData={imageData} />
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import "../Styles/Trendingpicks.css";

import db from "../firebase";
import PicContainer from "./PicContainer";

function Trendingpicks() {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchRandomProducts = () => {
      try {
        // Check if products are stored in local storage
        const storedProducts = localStorage.getItem("selectedProducts");

        if (storedProducts) {
          // If products are stored, use them
          setImageData(JSON.parse(storedProducts));
        } else {
          // Otherwise, fetch and store random products
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

              // Shuffle the productsArray
              const shuffledProducts = productsArray.sort(
                () => Math.random() - 0.5
              );

              // Select the first 3 products
              const selectedProducts = shuffledProducts.slice(0, 3);

              // Map the selected products to the format expected by PicContainer
              const formattedData = selectedProducts.map((product) => ({
                id: product.id,
                imageUrl: product.imageUrl, // Change this to the actual image URL property
                // Add other properties as needed
              }));

              // Store the selected products in local storage
              localStorage.setItem(
                "selectedProducts",
                JSON.stringify(formattedData)
              );

              setImageData(formattedData);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching products from the database:", error);
      }
    };

    fetchRandomProducts();
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <div className="heading">
        <h1>Trending Picks</h1>
      </div>
      <PicContainer imageData={imageData} />
    </>
  );
}

export default Trendingpicks;
