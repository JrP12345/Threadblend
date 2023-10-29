// SearchResults.js
import React from "react";

const SearchResults = ({ results }) => {
  return (
    <div className="search-results-container">
      <h3>Top 5 Search Results</h3>
      {results.map((result) => (
        <div key={result.id} className="search-result-item">
          <img
            src={result.imageUrl}
            alt={result.productName}
            className="search-result-image"
          />
          <p>{result.productName}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
