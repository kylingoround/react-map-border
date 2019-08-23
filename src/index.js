import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import Walls from "./components/Walls";
import "./styles.css";

const App = () => (
  <div>
    <Walls />
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
