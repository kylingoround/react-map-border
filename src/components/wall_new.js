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

const WidgetImg = styled.img`
  width: 100%;
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
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 2vh;
  margin-bottom: 2vh;
  max-height: 42.7rem;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;
const BigHead = styled.div`
  margin-top: 2rem;
  width: 500px;
  /* height: 700px; */
  /* background-color: teal; */
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

const BoldSpan = styled.span`
  font-weight: 900;
  font-family: "Overpass", "Roboto", sans-serif;
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
    updateTooltipData,
    handleOpenWidget
  } = props;

  const smallRectGap = 10;
  // console.log("pineapple");
  // console.log(props);

  return (
    <g>
      {/* <>{console.log(migrantStockChange)}</> */}
      {/* <>{console.log(migrantStockChange.find(x => x.destination === "China"))}</> */}
      {barrierData.map((d, i) => (
        <g key={i} onClick={() => handleOpenWidget(d)}>
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
    tooltipData: { name: "Jack", profession: "ripper" },
    isDisplayingWidget: false,
    widgetDisplayData: {},
    isDisplayingWelcome: false
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

  handleCloseWidget = () => {
    this.setState({ isDisplayingWidget: false });
  };

  handleOpenWidget = data => {
    data && this.setState({ widgetDisplayData: data });
    this.setState({ isDisplayingWidget: true });
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
    const {
      svgDimensions,
      loadingFinished,
      isDisplayingWidget,
      widgetDisplayData
    } = this.state;
    const rectPrimeStats = {
      width: 250,
      height: 250
    };
    const visualSvgBoxStats = {
      width: 2500,
      height: 700
    };
    const mockupData = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <>
        <StyledSVG
          viewBox={"0 0 " + svgDimensions.width + " " + svgDimensions.height}
          ref={ref => (this.fooRef = ref)}
          data-tip="tooltip"
        >
          {loadingFinished && (
            <RectGroup
              barrierData={this.state.barrierData}
              rectStats={this.state.rectStats}
              svgDimensions={this.state.svgDimensions}
              migrantStockChange={this.state.migrantStockChange}
              migrantStockTotal={this.migrantStockTotal}
              updateTooltipData={this.updateTooltipData} // give it to first children
              handleOpenWidget={this.handleOpenWidget}
            />
          )}
        </StyledSVG>
        {/* <p ref={ref => (this.fooRef = ref)} data-tip="hello">
          <div>what is this?</div>
        </p> */}
        <ReactTooltip>
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
          {isDisplayingWidget && (
            <WidgetWrapper>
              <button onClick={this.handleCloseWidget}>close</button>
              <ScrollableContainer>
                <BigHead>
                  <svg
                    viewBox={
                      "0 0 " +
                      visualSvgBoxStats.width +
                      " " +
                      visualSvgBoxStats.height
                    }
                  >
                    <def>
                      <g id="rectPrime">
                        <rect
                          width={rectPrimeStats.width - 2}
                          height={rectPrimeStats.height}
                          x={0}
                          y={0}
                          fill={"#F62919"}
                        />
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => (
                          <rect
                            width={rectPrimeStats.width / 17}
                            height={rectPrimeStats.height * 0.8}
                            x={
                              (rectPrimeStats.width / 17) * i * 2 +
                              rectPrimeStats.width / 17
                            }
                            y={rectPrimeStats.height * 0.1}
                            fill={"#1A1A1A"}
                          />
                        ))}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((d, i) => (
                          <circle
                            cx={
                              (i * rectPrimeStats.width) / 6 / 2 +
                              rectPrimeStats.width / 12
                            }
                            cy={0}
                            r={rectPrimeStats.width / 12}
                            fill={"none"}
                            stroke={"#F62919"}
                            stroke-width="4"
                          />
                        ))}

                        {/* <rect
                          width={rectPrimeStats.width / 17}
                          height={rectPrimeStats.height * 0.8}
                          x={0}
                          y={0}
                          fill={"black"}
                        /> */}
                      </g>
                    </def>
                    {mockupData.map((d, i) => (
                      <use
                        xlinkHref="#rectPrime"
                        x={
                          i * rectPrimeStats.width +
                          (visualSvgBoxStats.width -
                            rectPrimeStats.width * mockupData.length) /
                            2
                        }
                        y={
                          (visualSvgBoxStats.height - rectPrimeStats.height) / 2
                        }
                      />
                    ))}
                    {/* <use xlinkHref="#rectPrime" x={10} y={10} /> */}

                    {/* <g>data group: top group / down group</g> */}
                    <g>{/* middle expandable group */}</g>
                    <g>{/* <rect>customizable group</rect> */}</g>
                  </svg>
                </BigHead>

                <ContentTextWrapper>
                  {/* <ContentTextTitle>US-Mexico Barrier</ContentTextTitle> */}
                  {widgetDisplayData.border_name && (
                    <ContentTextTitle>
                      {widgetDisplayData.border_name}
                    </ContentTextTitle>
                  )}
                  <ContentTextBody>
                    {widgetDisplayData.built_status && (
                      <div>
                        <BoldSpan> Status:</BoldSpan>{" "}
                        {widgetDisplayData.built_status}
                      </div>
                    )}
                    {widgetDisplayData["built-year"] && (
                      <div>
                        <BoldSpan>Built Year:</BoldSpan>{" "}
                        {widgetDisplayData["built-year"]}
                      </div>
                    )}

                    {widgetDisplayData.length && (
                      <div>
                        <BoldSpan>Length:</BoldSpan> {widgetDisplayData.length}{" "}
                        km
                      </div>
                    )}

                    {widgetDisplayData.purpose && (
                      <div>
                        <BoldSpan> Purpose:</BoldSpan>{" "}
                        {widgetDisplayData.purpose}
                      </div>
                    )}

                    {/* {widgetDisplayData && <div></div>} */}
                    {/* {widgetDisplayData && <div></div>} */}
                    {/* {widgetDisplayData && <div></div>} */}
                    {/* {widgetDisplayData && <div></div>} */}
                    {widgetDisplayData.description && (
                      <div>{widgetDisplayData.description}</div>
                    )}
                    {widgetDisplayData.thumbnail && (
                      <WidgetImg src={widgetDisplayData.thumbnail} />
                    )}

                    {/* <div></div> */}
                    {/* border_id: "Saudi–Yemen barrier"
                      border_name: "Saudi-Yemen barrier"
                      built-year: "2004"
                      built_status: ["built"]
                      coordinates: {raw: "17.433414^N, 44.718835^E", lat: "17.433414", long: "44.718835"}
                      description: "The Saudi–Yemen barrier is a physical barrier constructed by Saudi Arabia along part of its 1,800-kilometer (1,100 mi) border with Yemen. It is a structure made of pipeline three metres (10 ft) high filled with concrete, acting as a security barrier along sections of the now fully demarcated border with Yemen and fitted with electronic detection equipment."
                      entity_1: "Saudi Arabia"
                      entity_1_continent: "Asia"
                      entity_1_country_code: "SA"
                      entity_2: "Yemen"
                      entity_2_continent: "Asia"
                      entity_2_country_code: "YE"
                      length: "75"
                      purpose: ["anti-illegal immigration"]
                      resources: []
                      technologies: []
                      thumbnail: " */}
                  </ContentTextBody>
                </ContentTextWrapper>
              </ScrollableContainer>
            </WidgetWrapper>
          )}
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
