import React, { Component } from "react";
import styled from "styled-components";
import { csv } from "d3";
// import Floater from "react-floater";
import ReactTooltip from "react-tooltip";

import barrier_data from "../data/barrier_data_updated.json";

// const WallPageWrapper = styled.div`
//   pointer-events: none;
//   width: 100vw;
//   /* height: 100vh; */
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   /* background: teal; */
//   z-index: 2;
//   position: fixed;
// `;

const PageParent = styled.div`
  overflow: hidden;
  /* width: 100vw; */
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WidgetWrapper = styled.div`
  box-sizing: border-box;
  padding: 2px;

  width: 80vw;
  height: 80vh;
  /* background-color: teal; */
  background-color: #1a1a1a;
  z-index: 50;
  border: 5px solid #ffb800;
`;

const ScrollableContainer = styled.div`
  overflow-y: auto;
  margin-top: 2vh;
  margin-bottom: 2vh;
  max-height: 76vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;
const BigHead = styled.div`
  padding-top: 2rem;
  width: 300px;
  height: 700px;
  background-color: teal;
`;

const ContentTextWrapper = styled.div`
  height: auto;
  max-width: 35rem;
  /* background-color: teal; */
`;

const ContentTextTitle = styled.div`
  padding-top: 2rem;
  font-size: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #dadada;
  text-align: center;
`;

const ContentTextBody = styled.div`
  padding-top: 2rem;
  font-size: 1rem;
  font-weight: 300;
  font-family: "Overpass", "Roboto", sans-serif;
  color: #dadada;
`;

const StyledSVG = styled.svg`
  /* pointer-events: auto; */
  pointer-events: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #1a1a1a;
  /* position: fixed; */
  /* z-index: 1; */
`;

const StyledRect = styled.rect`
  pointer-events: auto;
`;

class RectwithState extends Component {
  render() {
    const { x, y, width, height, fill, updateTooltipData, d } = this.props;
    return (
      <StyledRect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        // onClick={() => this.handleClick()}
        // onClick={() => updateTooltipData("secret")}
        onMouseEnter={() => updateTooltipData(d)}
        // onMouseEnter={() => this.handleHover()}
      />
    );
  }
}

class RectwithStateData extends Component {
  render() {
    const {
      rectStats,
      svgDimensions,
      migrantStockChange,
      d,
      i,
      isUp,
      smallRectGap,
      entity,
      updateTooltipData
    } = this.props;
    const msChangeRate = parseFloat(
      migrantStockChange.find(x => x.destination === d[entity])["2015-2017"]
    );
    const absMSChangeRate = Math.abs(msChangeRate);
    const isPositive = msChangeRate > 0;

    const calculatedY = isUp
      ? svgDimensions.height / 2 -
        rectStats.height / 2 -
        smallRectGap -
        absMSChangeRate * rectStats.height
      : svgDimensions.height / 2 -
        rectStats.height / 2 +
        smallRectGap +
        rectStats.height;

    return (
      <StyledRect
        x={i * (rectStats.width + rectStats.gap) + 10 + rectStats.offset}
        y={calculatedY}
        width={rectStats.width}
        height={absMSChangeRate * rectStats.height}
        fill={isPositive ? "#FFB800" : "#1a1a1a"}
        stroke={isPositive ? "none" : "#FFB800 "}
        strokeDasharray={isPositive ? "none" : "4,4"}
        onMouseEnter={() => updateTooltipData(d, isUp, migrantStockChange)}
      />
    );
  }
}

const RectGroup = props => {
  const {
    barrierData,
    rectStats,
    svgDimensions,
    migrantStockChange,
    migrantStockTotal,
    isUp,
    updateTooltipData
  } = props;

  const smallRectGap = 10;
  // console.log("pineapple");
  // console.log(props);

  return (
    <g>
      {/* <>{console.log(migrantStockChange)}</> */}
      {/* <>{console.log(migrantStockChange.find(x => x.destination === "China"))}</> */}
      {barrierData.map((d, i) => (
        <g key={i}>
          {migrantStockChange.find(x => x.destination === d.entity_1) && (
            <RectwithStateData
              isUp={true}
              i={i}
              rectStats={rectStats}
              svgDimensions={svgDimensions}
              smallRectGap={smallRectGap}
              migrantStockChange={migrantStockChange}
              entity={"entity_1"}
              d={d}
              updateTooltipData={updateTooltipData}
            />
          )}

          <RectwithState
            x={i * (rectStats.width + rectStats.gap) + 10 + rectStats.offset}
            y={svgDimensions.height / 2 - rectStats.height / 2}
            width={rectStats.width}
            height={rectStats.height}
            d={d}
            fill="#F62919"
            updateTooltipData={updateTooltipData} // second children
          />

          {migrantStockChange.find(x => x.destination === d.entity_2) && (
            <RectwithStateData
              isUp={false}
              i={i}
              rectStats={rectStats}
              svgDimensions={svgDimensions}
              smallRectGap={smallRectGap}
              migrantStockChange={migrantStockChange}
              entity={"entity_2"}
              d={d}
              updateTooltipData={updateTooltipData}
            />
          )}
        </g>
      ))}
    </g>
  );
};

const RectWall = class RectWall extends Component {
  state = {
    loadingFinished: false,
    migrantStockChange: [],
    migrantStockTotal: [],
    rectRenderData: [],
    barrierData: [],
    rectStats: {
      width: 20,
      height: 20,
      gap: 10,
      offset: 0
    },
    svgDimensions: {
      width: 960,
      height: 700
    },
    rectHoverTooltipData: [],
    isDisplayingHoverTip: false,
    tooltipData: { name: "Jack", profession: "ripper" }
  };

  calculateGap(data) {
    // console.log(this.state);
    let prevState = this.state.rectStats;
    let num = this.state.barrier_data.length;
    let svgWidth = this.state.svgDimensions.width;
    let rectWidth = this.state.rectStats.width;
    let gap = this.state.rectStats.gap;

    let offset = (svgWidth - (num * rectWidth + (num - 1) * gap)) / 2 - gap;

    prevState.offset = offset;
    this.setState({ rectStats: prevState }, () => console.log(this.state));
  }

  testClick() {
    this.setState(prevState => ({
      isDisplayingHoverTip: !prevState.isDisplayingHoverTip
    }));
    console.log("hover click");
  }

  updateTooltipData = data => {
    // console.log(data);
    // let tooltipData = this.state.tooltipData;
    // tooltipData.name = data;
    // // console.log(this);
    // this.setState({ tooltipData: tooltipData });
    console.log(data);
    this.state.loadingFinished && this.setState({ tooltipData: data });
  };

  componentDidMount() {
    // migrant stock change rate

    csv(
      "https://gist.githubusercontent.com/kylingoround/dce41cf554acef2180990bd23c5f749d/raw/e892b94de57131d82f76bc3b337af7206b1916c3/MigrantStockChangeRate.csv"
    )
      // .then(res => console.log(res))
      .then(res => this.setState({ migrantStockChange: res }))
      // .then(() => console.log(this.state))
      .then(() =>
        csv(
          "https://gist.githubusercontent.com/kylingoround/dce41cf554acef2180990bd23c5f749d/raw/e892b94de57131d82f76bc3b337af7206b1916c3/MigrantStockChangeRate.csv"
        )
      )
      // .then(res => console.log(res))
      .then(res => this.setState({ migrantStockTotal: res }))
      .then(() => this.setState({ barrierData: barrier_data }))
      .then(() =>
        this.setState({ barrier_data: barrier_data }, () =>
          this.calculateGap(this.state.barrier_data)
        )
      )

      // .then(() => console.log(this.state))
      .then(() => this.setState({ loadingFinished: true }))
      .then(() => console.log(this.state));
  }
  render() {
    const { svgDimensions, loadingFinished } = this.state;
    return (
      <>
        <StyledSVG
          viewBox={"0 0 " + svgDimensions.width + " " + svgDimensions.height}
          ref={ref => (this.fooRef = ref)}
          data-tip="tooltip"
        >
          >
          {loadingFinished && (
            <RectGroup
              barrierData={this.state.barrierData}
              rectStats={this.state.rectStats}
              svgDimensions={this.state.svgDimensions}
              migrantStockChange={this.state.migrantStockChange}
              migrantStockTotal={this.migrantStockTotal}
              updateTooltipData={this.updateTooltipData} // give it to first children
              onMouseOver={() => {
                ReactTooltip.hide(this.fooRef);
              }}
            />
          )}
        </StyledSVG>
        {/* <p ref={ref => (this.fooRef = ref)} data-tip="hello">
          <div>what is this?</div>
        </p> */}
        <ReactTooltip>
          {/* <div>{this.state.tooltipData.name}</div> */}
          {this.state.tooltipData && (
            <div>
              <div>Border Name: {this.state.tooltipData.border_name}</div>
              <div>Status: {this.state.tooltipData.built_status}</div>
              <div>Length: {this.state.tooltipData.length}</div>
              <div>Entity 1: {this.state.tooltipData.entity_1}</div>
              <div>Entity 2: {this.state.tooltipData.entity_2}</div>
              <div>Purpose: {this.state.tooltipData.purpose}</div>
            </div>
          )}
        </ReactTooltip>
        <PageParent>
          <WidgetWrapper>
            <ScrollableContainer>
              <BigHead>
                <svg viewBox={"0 0 800 500"}>
                  {/* <g>data group: top group / down group</g> */}
                  <g>{/* middle expandable group */}</g>
                  <g>{/* <rect>customizable group</rect> */}</g>
                </svg>
              </BigHead>

              <ContentTextWrapper>
                <ContentTextTitle>US-Mexico Barrier</ContentTextTitle>
                <ContentTextBody>
                  <div>
                    Moby-Dick; or, The Whale is an 1851 novel by American writer
                    Herman Melville. The book is sailor Ishmael's narrative of
                    the obsessive quest of Ahab, captain of the whaling ship
                    Pequod, for revenge on Moby Dick, the giant white sperm
                    whale that on the ship's previous voyage bit off Ahab's leg
                    at the knee. A contribution to the literature of the
                    American Renaissance, the work's genre classifications range
                    from late Romantic to early Symbolist. Moby-Dick was
                    published to mixed reviews, was a commercial failure, and
                    was out of print at the time of the author's death in 1891.
                    Its reputation as a "Great American Novel" was established
                    only in the 20th century, after the centennial of its
                    author's birth. William Faulkner confessed he wished he had
                    written the book himself,[1] and D. H. Lawrence called it
                    "one of the strangest and most wonderful books in the world"
                    and "the greatest book of the sea ever written".[2] Its
                    opening sentence, "Call me Ishmael", is among world
                    literature's most famous.[3]
                  </div>
                  <div>
                    Melville began writing Moby-Dick in February 1850, and would
                    eventually take 18 months to write the book, a full year
                    more than he had first anticipated. Writing was interrupted
                    by his making the acquaintance of Nathaniel Hawthorne in
                    August 1850, and by the creation of the "Mosses from an Old
                    Manse" essay as a first result of that friendship. The book
                    is dedicated to Hawthorne, "in token of my admiration for
                    his genius".
                  </div>
                  <div>
                    The basis for the work is Melville's 1841 whaling voyage
                    aboard the Acushnet. The novel also draws on whaling
                    literature, and on literary inspirations such as Shakespeare
                    and the Bible. The white whale is modeled on the notoriously
                    hard-to-catch albino whale Mocha Dick, and the book's ending
                    is based on the sinking of the whaleship Essex in 1820. The
                    detailed and realistic descriptions of whale hunting and of
                    extracting whale oil, as well as life aboard ship among a
                    culturally diverse crew, are mixed with exploration of class
                    and social status, good and evil, and the existence of God.
                    In addition to narrative prose, Melville uses styles and
                    literary devices ranging from songs, poetry, and catalogs to
                    Shakespearean stage directions, soliloquies, and asides.
                  </div>
                  <div>
                    The basis for the work is Melville's 1841 whaling voyage
                    aboard the Acushnet. The novel also draws on whaling
                    literature, and on literary inspirations such as Shakespeare
                    and the Bible. The white whale is modeled on the notoriously
                    hard-to-catch albino whale Mocha Dick, and the book's ending
                    is based on the sinking of the whaleship Essex in 1820. The
                    detailed and realistic descriptions of whale hunting and of
                    extracting whale oil, as well as life aboard ship among a
                    culturally diverse crew, are mixed with exploration of class
                    and social status, good and evil, and the existence of God.
                    In addition to narrative prose, Melville uses styles and
                    literary devices ranging from songs, poetry, and catalogs to
                    Shakespearean stage directions, soliloquies, and asides.
                  </div>
                </ContentTextBody>
              </ContentTextWrapper>
            </ScrollableContainer>
          </WidgetWrapper>
        </PageParent>
      </>
    );
  }
};

export default RectWall;

// border_id: "Turkey–Syria border barrier"
// border_name: "Turkey–Syria border barrier"
// built-year: "N/A"
// built_status: ["Under Construction"]
// coordinates: {raw: "36.870718^N,38.468054^E", lat: "36.870718", long: "38.468054"}
// description: "The Syria–Turkey barrier is a border wall and fence under construction along the Syria–Turkey border aimed at preventing illegal crossings and smuggling from Syria into Turkey"
// entity_1: "Turkey"
// entity_2: "Syria"
// length: "828"
// purpose: (2) ["anti-terrorism", "anti-illegal immigration"]
// resources: []
// technologies: (2) ["concrete wall", "razor wire"]
// thumbnail: "https://cdnuploads.aa.com.tr/uploads/C
