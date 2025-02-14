import React from "react";
import matusColor from "../../assets/matuscolor.png";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f7f7f7",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px", 
      }}
    >
      <img
        src={matusColor}
        alt="MatusColor"
        style={{
          width: "clamp(100px, 20%, 200px)", 
          height: "auto", 
          marginBottom: "20px", 
        }}
      />

      <h1
        style={{
          fontSize: "clamp(2rem, 10vw, 4rem)", 
          fontWeight: "bold",
          color: "#333",
          margin: "10px 0",
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: "clamp(1rem, 5vw, 1.5rem)", 
          color: "#666",
          margin: "10px 0",
        }}
      >
        Oops! Page not found.
      </p>

      <a
        href="/"
        style={{
          fontSize: "clamp(0.875rem, 4vw, 1rem)", 
          color: "#007bff",
          textDecoration: "none",
          border: "1px solid #007bff",
          padding: "10px 20px",
          borderRadius: "5px",
          transition: "background-color 0.3s, color 0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#007bff";
          e.target.style.color = "#fff";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#007bff";
        }}
      >
        Go back to the homepage
      </a>
    </div>
  );
};

export default NotFound;