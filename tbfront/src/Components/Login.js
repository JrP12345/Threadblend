import React, { useState } from "react";
import axios from "axios";
import "../Styles/Login.css";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

function Login() {
  const { handleLoginn } = useCart(); // Ensure you are using isCartOpen and closeCart

  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const switchForm = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true); // Set showLogin to true when registration is successful
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/login",
        loginData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Login successful, you can handle the success here
        console.log("Login successful");
        // Assuming the server sends a token in the response
        const token = response.data.token;

        // Store the token in a cookie or localStorage
        // You may want to use a more secure method for production
        localStorage.setItem("token", token);
        handleLoginn();
        // Redirect to the home page or wherever you want
        navigate("/home");
      } else {
        // Login failed, handle the errors
        const errorData = Array.isArray(response.data.errors)
          ? response.data.errors.reduce((acc, error) => {
              acc[error.param || "global"] = error.msg;
              return acc;
            }, {})
          : { global: "An error occurred during login" };

        console.error("Login failed");
        setErrors(errorData);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      const errorData = Array.isArray(error.response.data.errors)
        ? error.response.data.errors.reduce((acc, error) => {
            acc[error.param || "global"] = error.msg;
            return acc;
          }, {})
        : { global: "Username or Password Is Incorrect" };
      console.log("Formatted errorData:", errorData);
      setErrors(errorData);
    }
  };

  return (
    <>
      <div className="loginbackground">
        <div className="logincontainer">
          <div className="nametitle">ThreadBlend</div>
          <div className="loginbox">
            {showLogin ? (
              <>
                <h1 className="logintitle">Login</h1>
                <form action="" className="loginform" onSubmit={handleLogin}>
                  <input
                    className="loginfields"
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                  <input
                    className="loginfields"
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                  <button className="loginbtn" type="submit">
                    Submit
                  </button>
                </form>
                {errors.global && (
                  <p className="error-message">{errors.global}</p>
                )}
              </>
            ) : null}
            {!showLogin ? (
              <>
                <h1 className="logintitle">Register</h1>
                <Register onRegisterSuccess={handleRegisterSuccess} />
              </>
            ) : null}
            <div className="signuptxt" onClick={switchForm}>
              {showLogin
                ? "Don't Have An Account? Sign Up"
                : "Already have an account? Login"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
