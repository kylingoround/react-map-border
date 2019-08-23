import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  /* position: fixed; */
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: teal;
`;
const Rect = styled.rect``;

const Demo = () => (
  <div>
    <Svg>
      <rect
        x={10}
        y={10}
        width="100"
        height="100"
        stroke="blue"
        fill="purple"
        onClick={() => console.log("hello")}
      />
    </Svg>
  </div>
);

export default Demo;
