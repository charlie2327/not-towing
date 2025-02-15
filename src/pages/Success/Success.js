import matusColor from "../../assets/matuscolor.png";
import React from "react";

const Success = () => {
  return(
    <div className="not-found-page">
      <div className="not-found-image">
        <img src={matusColor} alt="Matus" style={{width: 400, maxWidth: "100%"}}/>
      </div>
      <p className="not-found-title margin-top">Congratulations!</p>
      <p className="not-found-description">Your appointment has been sent. An email confirmation will be send to you with
      the detail of your appointment</p>
    </div>
  );
}

export default Success;
