import React from "react";
import styled from "styled-components";
import { ComposableMap } from "react-simple-maps";

const FullScreenSvg = styled.svg`
  width: 100%;
  height: 100%;
  /* position: fixed; */
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: teal;
  pointer-events: none;
  float: left;
  clear: left;
`;

const Hugger = styled.div`
  overflow: hidden;
  clear: left;
`;

let arr = ["1", "2", "3", "4"];

function printSth() {
  console.log("yo");
}

class Monuments extends React.Component {
  state = {
    clicked: false,
    data: null
  };
  render() {
    return (
      <FullScreenSvg viewBox={"0 0 960 720"}>
        {arr.map((data, index) => (
          <rect
            key={index}
            data={data}
            width="100"
            height="100"
            stroke="blue"
            fill="purple"
            y={200}
            x={
              index * (100 + 20) -
              20 +
              (960 - (100 * arr.length + 20 * (arr.length - 1))) / 2 // (width - rect-width) / 2
            }
            onClick={() => console.log("yo")}
          />
        ))}
      </FullScreenSvg>
    );
  }
}

const WorldMap = () => (
  <>
    {" "}
    {/* <div onClick={printSth}>hello</div> */}
    {/* <div>world map svg</div> */}
    {/* <div>monuments</div> */}
    <Monuments />
  </>
);

export default WorldMap;
