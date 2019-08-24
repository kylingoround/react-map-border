import React, { Component } from "react";
import styled from "styled-components";

import barrier_data from "../data/barrier_data_updated.json";

// todos
// drag map / svg, infinite scrolling (horizental)
// transition
// add map
// sort the data by ???

// close and open div
// map
// another wall

// detail page

// complete dataset

// optimize window open / close behavior

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
  /* z-index: -1; */
  z-index: 0;
`;

const WallPageWrapper = styled.div`
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background: teal; */
  z-index: 2;
`;

const InfoDivWrapper = styled.div``;

const Img = styled.img`
  /* max-width: 300px; */
  /* margin-top: 1rem; */
  margin-bottom: 1rem;
  width: 100%;
  height: auto;
  outline: 3px solid black;
`;

const Title = styled.div`
  font-size: 2.4rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  padding-bottom: 1rem;
`;

const BigBoldText = styled.div`
  font-size: 1rem;
  font-family: "Overpass", "Roboto", sans-serif;
  font-weight: 800;
`;

const BodyText = styled.div`
  font-size: 1rem;
  font-family: "Overpass", "Roboto", sans-serif;
  font-weight: 300;
  /* font-family: "Montserrat", sans-serif; */
`;

const CardWrapper = styled.div`
  /* margin: 0; */
  padding: 1rem;
  max-width: 27rem;
  /* height: 50vh; */
  height: auto;
  background-color: #eee;
  margin-left: 5rem;
  outline: 3px solid black;
  z-index: 2;
  pointer-events: auto;
`;

const RectClickable = styled.rect`
  pointer-events: auto;
`;

function checkNull(data, customPlaceholder) {
  if (data === null || data === undefined) {
    if (customPlaceholder === undefined) {
      return "data is not defined or null";
    } else {
      return customPlaceholder;
    }
  } else {
    return data;
  }
}

const Card = props => (
  <CardWrapper>
    <Img
      src={checkNull(
        props.thumbnail,
        "https://thenypost.files.wordpress.com/2019/02/190223-border-wall-prototypes.jpg?quality=90&strip=all&w=618&h=410&crop=1"
      )}
    />
    {/* <Title>US - Mexico Border</Title> */}
    <Title>{checkNull(props.border_name)}</Title>
    {/* <BodyText>Status: Built</BodyText> */}
    <BodyText>Status: {checkNull(props.built_status)}</BodyText>
    {/* <BodyText>Length: 275 km</BodyText> */}
    <BodyText>Length: {checkNull(props.length)} km</BodyText>
    {/* <BodyText>Country(s): US, Mexico</BodyText> */}
    <BodyText>
      Country(s): {checkNull(props.entity_1)}, {checkNull(props.entity_2)}
    </BodyText>
    {/* <Img src="https://thenypost.files.wordpress.com/2019/02/190223-border-wall-prototypes.jpg?quality=90&strip=all&w=618&h=410&crop=1" /> */}
    {/* <Img
      src={checkNull(
        props.thumbnail,
        "https://thenypost.files.wordpress.com/2019/02/190223-border-wall-prototypes.jpg?quality=90&strip=all&w=618&h=410&crop=1"
      )} 
    />*/}
    {/* <BodyText>
      The Mexico–United States border (Spanish: frontera México–Estados Unidos)
      is an international border separating Mexico and the United States,
      extending from the Pacific Ocean in the west to the Gulf of Mexico in the
      east. The border traverses a variety of terrains, ranging from urban areas
      to deserts. The Mexico–United States border is the most frequently crossed
      border in the world,[1][2][3] with approximately 350 million documented
      crossings annually.
    </BodyText> */}
    <BodyText>{checkNull(props.description)}</BodyText>
    <button onClick={props.handleTooltipClose}>CLOSE ME</button>
    <button>SEE MORE</button>
  </CardWrapper>
);

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
    isDisplayingToolTip: false,
    toolTipData: "placeholder"
  };
  componentDidMount() {
    this.setState({ barrier_data: barrier_data }, () =>
      this.calculateGap(this.state.barrier_data)
    );
  }

  handleRectClick = data => {
    this.setState(prevState => ({
      isDisplayingToolTip: !prevState.isDisplayingToolTip
    }));

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

  toggleTooltip() {
    this.setState(prevState => ({
      isDisplayingToolTip: !prevState.isDisplayingToolTip
    }));
  }

  render() {
    const { svgDimensions, barrier_data, rectStats } = this.state;

    return (
      <div>
        <WallPageWrapper>
          {this.state.isDisplayingToolTip && (
            <Card
              {...this.state.toolTipData}
              handleTooltipClose={() => this.toggleTooltip()}
            />
          )}
          {/* <InfoDiv data={this.state.toolTipData} /> */}
        </WallPageWrapper>

        <Svg
          viewBox={"0 0 " + svgDimensions.width + " " + svgDimensions.height}
        >
          <g>
            {barrier_data &&
              barrier_data.map((data, i) => (
                // <div>{console.log(data)}</div>
                <RectClickable
                  x={
                    i * (rectStats.width + rectStats.gap) +
                    10 +
                    rectStats.offset
                  }
                  y={svgDimensions.height / 2}
                  width={rectStats.width}
                  height={rectStats.height}
                  fill="purple"
                  onClick={() => this.handleRectClick(data)}
                />
              ))}
          </g>
          <g />
        </Svg>
      </div>
    );
  }
}

export default Walls;
