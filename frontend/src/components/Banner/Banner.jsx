import React from "react";
import bannerImg from "../../assets/banner.png";
import "./Banner.css";
import { useSelector } from "react-redux";

import { Button } from "primereact/button";

import { useNavigate } from "react-router-dom";

function Banner() {
  const btnTransparent = {
    backgroundColor: "transparent",
    color: "#fff",
  };
  const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <>
      {userData !== null ? (
        <header style={{ paddingLeft: 0 }} className="hero">
          <img className="cover" src={bannerImg} alt="" />
          <div className="textcover">
            <h1 className="mb-3 htext">
              Jobs for Unemployed Youth No Experience? No Problem
            </h1>
            <Button
              className="btn btn-outline-light btn-lg"
              style={btnTransparent}
              onClick={()=>navigate('/jobs')}
            >
              find jobs
            </Button>
          </div>
        </header>
      ) : (
        <header style={{ paddingLeft: 0 }} className="hero">
          <img className="cover" src={bannerImg} alt="" />
          <div className="textcover">
            <h1 className="mb-3 htext">
              Jobs for Unemployed Youth No Experience? No Problem
            </h1>
            <Button
              label="Signup"
              severity="success"
              onClick={() => {
                navigate("/signup");
              }}
            />
          </div>
        </header>
      )}
    </>
  );
}

export default Banner;
