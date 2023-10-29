import React, { useState } from "react";
import axios from "axios";
import "../Styles/Login.css";

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/register",
        formData
      );
      console.log(response);
      if (response.data.success) {
        // Registration successful, you can handle the success here
        onRegisterSuccess(true);
        console.log("Registration successful");
      } else {
        // Registration failed, handle the errors
        const errorData = Array.isArray(response.data.errors)
          ? response.data.errors.reduce((acc, error) => {
              acc[error.param] = error.msg;
              return acc;
            }, {})
          : { global: "An error occurred during registration" };

        setErrors(errorData);
        console.error("Registration failed");
      }
    } catch (error) {
      console.log("Error response from server:", error.response.data);
      const errorData = Array.isArray(error.response.data.errors)
        ? error.response.data.errors.reduce((acc, error) => {
            acc[error.param || "global"] = error.msg;
            return acc;
          }, {})
        : { global: "An error occurred during registration" };
      console.log("Formatted errorData:", errorData);
      setErrors(errorData);
      console.error("Registration failed");
    }
  };

  return (
    <>
      <form action="" className="loginform" onSubmit={handleSubmit}>
        <input
          className="loginfields"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          className="loginfields"
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          className="loginfields"
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
        />

        <input
          className="loginfields"
          type="text"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="loginbtn" type="submit">
          Submit
        </button>
      </form>
      {errors.global && <p className="error-message">{errors.global}</p>}
    </>
  );
}

export default Register;
