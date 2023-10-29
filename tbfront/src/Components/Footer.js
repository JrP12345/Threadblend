// Footer.js

import React from "react";
import "../Styles/Footer.css"; // Import your CSS file for styling

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Discover the world of ThreadBlend and explore our unique products.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@threadblend.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 ThreadBlend. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
