import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import styled from "styled-components";
import Walls from "./components/Walls";
import WorldMap from "./components/WorldMap";

const App = () => (
  <div>
    <WorldMap className="map" />
    <Walls className="wall" />
  </div>
);

{
  /* <MapPageWrapper>
{/* <StyledSVG
  viewBox={"0 0 " + svgDimensions.width + " " + svgDimensions.height}
>
  <g />
</StyledSVG> */
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
