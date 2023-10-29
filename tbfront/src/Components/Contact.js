import React, { useState } from "react";
import db from "../firebase";
import "../Styles/ContactUs.css";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await db.ref("contacts").push({
        email,
        message,
      });

      setEmail("");
      setMessage("");
      setSuccessMessage("Message sent successfully!");

      console.log("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="mainconatiner">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="contact-input"
          />

          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="contact-input"
            rows={10}
          ></textarea>

          <button type="submit" className="contact-button">
            Submit
          </button>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
