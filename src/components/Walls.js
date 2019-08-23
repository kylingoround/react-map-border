import React, { Component } from "react";
import styled from "styled-components";

import barrier_data from "../data/barrier_data_updated.json";

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* background-color: teal; */
  position: fixed;
`;

const InfoDivWrapper = styled.div``;

const Img = styled.img`
  max-width: 200px;
`;

const InfoDiv = props => (
  <InfoDivWrapper>
    {console.log(props.data.border_name)}
    <div>Barrier Tooltip Information</div>
    <div>
      Border Name:{" "}
      {props.data.border_name === undefined ? (
        <>Not Selected</>
      ) : (
        <>{props.data.border_name}</>
      )}
    </div>
    <div>
      Built Status:{" "}
      {props.data.border_name === undefined ? (
        <>Not Selected</>
      ) : (
        <>{props.data.built_status}</>
      )}
    </div>
    <div>
      Length: xxx km{" "}
      {props.data.border_name === undefined ? (
        <>Not Selected</>
      ) : (
        <>{props.data.length}</>
      )}
    </div>
    <div>
      Description:{" "}
      {props.data.border_name === undefined ? (
        <>Not Selected</>
      ) : (
        <>{props.data.description}</>
      )}
    </div>
    <div>
      Country A:{" "}
      {props.data.border_name === undefined ? (
        <>Not Selected</>
      ) : (
        <>{props.data.entity_1}</>
      )}
    </div>
    <div>
      Country B:{" "}
      {props.data.border_name === undefined ? (
        <>Not Selected</>
      ) : (
        <>{props.data.entity_2}</>
      )}
    </div>
    {props.data.thumbnail === undefined ? (
      <Img
        alt="placeholder"
        src="https://thenypost.files.wordpress.com/2019/02/190223-border-wall-prototypes.jpg?quality=90&strip=all&w=618&h=410&crop=1"
      />
    ) : props.data.thumbnail === "" ? (
      <Img
        alt="placeholder"
        src="https://thenypost.files.wordpress.com/2019/02/190223-border-wall-prototypes.jpg?quality=90&strip=all&w=618&h=410&crop=1"
      />
    ) : (
      <Img alt="barrier" src={props.data.thumbnail} />
    )}
    {/* <div>{props.data.thumbnail}</div> */}
    {/* <Img src="${props.data.border_name == undefined ? "hello": props.data.thumbnail}"/> */}
    {/* <div>Resources Link</div> */}
    <button>See more</button>
  </InfoDivWrapper>
);

// border_id: "Chinese–Korean-border-fence"
// visibility: false
// border_name: "Chinese–Korean border fence"
// built-status: Array[1]
// built-year: "N/A"
// coordinates: Object
// length: "1416"
// purpose: Array[1]
// description: "Fences more than 13ft high, topped with barbed wire, are now being erected along an eight-mile stretch of the Yalu river around the Chinese city of Dandong. This is a popular escape point for North Korea refugees seeking food or better lives, Korea's Yonhap news agency reported."
// entity_1: "China"
// entity_2: "Korea"
// technologies: Array[1]
// resources: Array[1]
// thumbnail: "https://secure.i.telegraph.co.uk/multimedia/archive/01860/china-fence-korea_1860133c.jpg"

class Walls extends Component {
  state = {
    arr: ["1", "2", "3", "4"],
    barrier_data: null,
    svgDimensions: {
      width: 960,
      height: 700
    },
    rectStats: {
      width: 20,
      height: 20,
      gap: 5,
      offset: 0
    },
    displayToolTip: false,
    toolTipData: "placeholder"
  };
  componentDidMount() {
    this.setState({ barrier_data: barrier_data }, () =>
      this.calculateGap(this.state.barrier_data)
    );
  }

  handleRectClick = data => {
    console.log(data);
    this.setState({ toolTipData: data });
  };

  calculateGap(data) {
    console.log(this.state);
    let prevState = this.state.rectStats;
    let num = this.state.barrier_data.length;
    let svgWidth = this.state.svgDimensions.width;
    let rectWidth = this.state.rectStats.width;
    let gap = this.state.rectStats.gap;

    let offset = (svgWidth - (num * rectWidth + (num - 1) * gap)) / 2 - gap * 2;

    prevState.offset = offset;
    this.setState({ rectStats: prevState }, () => console.log(this.state));
  }

  render() {
    const { svgDimensions, barrier_data, rectStats } = this.state;

    return (
      <>
        <Svg
          viewBox={"0 0 " + svgDimensions.width + " " + svgDimensions.height}
        >
          <g>
            {barrier_data &&
              barrier_data.map((data, i) => (
                // <div>{console.log(data)}</div>
                <rect
                  x={
                    i * (rectStats.width + rectStats.gap) +
                    10 +
                    rectStats.offset
                  }
                  y={svgDimensions.width / 2}
                  width={rectStats.width}
                  height={rectStats.height}
                  fill="purple"
                  onClick={() => this.handleRectClick(data)}
                />
              ))}
          </g>
          <g />
        </Svg>
        {}
        <InfoDiv data={this.state.toolTipData} />
      </>
    );
  }
}

export default Walls;
