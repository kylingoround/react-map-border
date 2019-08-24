import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import styled from "styled-components";
import Walls from "./components/Walls";

const App = () => (
  <div>
    <Walls />
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
