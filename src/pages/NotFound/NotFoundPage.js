import matusColor from "../../assets/matuscolor.png";
import React from "react";

const NotFoundPage = () => {
  return(
    <div className="not-found-page">
      <div className="not-found-image">
        <img src={matusColor} alt="Matus" style={{width: 400, maxWidth: "100%"}}/>
      </div>
      <p className="not-found-404">404</p>
      <p className="not-found-title">Page Not Found</p>

      <p className="not-found-description">Something get wrong, please check your email and access to the correct
        link</p>
    </div>
  );
}

export default NotFoundPage;
