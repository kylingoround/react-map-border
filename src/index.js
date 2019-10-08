import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

// import styled from "styled-components";
// import Walls from "./components/Walls";
// import WorldMap from "./components/WorldMap";
import RectWall from "./components/wall_new";
// import Globe from "./components/globe";

const App = () => (
  <div>
    {/* <WorldMap className="map" /> */}
    <RectWall className="wall" />
    {/* <Globe /> */}
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
