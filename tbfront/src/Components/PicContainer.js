import React from "react";
import { Link } from "react-router-dom";
import "../Styles/PicContainer.css"; // Import your CSS file

function PicContainer({ imageData }) {
  return (
    <div className="pickscontainer">
      {imageData && imageData.length > 0 ? (
        imageData.map((data, index) => (
          <div key={index} className="picitems">
            <img
              className="pickiteming"
              src={data.imageUrl}
              alt={`Top Pick ${index + 1}`}
            />
            <h3 className="itemtxt">{data.title}</h3>
            <div className="btncontainer">
              {/* Link to the product details page */}
              <Link to={`/product/${data.id}`} className="abbtn">
                Explore
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default PicContainer;
