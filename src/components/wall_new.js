import React, { Component } from "react";
import styled from "styled-components";
import { csv } from "d3";
// import Floater from "react-floater";
import ReactTooltip from "react-tooltip";
import { Scrollbars } from "react-custom-scrollbars";

import barrier_data from "../data/barrier_data_updated.json";
import jsonp from "@tmcw/jsonp";

import { BarChart, Bar } from "recharts";
import Globe from "./globe";

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

// charts

const GlobeIndexWrapper = styled.div`
  z-index: 0;
`;
const StyledWhatever = styled.div`
  /* transform: rotate(180deg) scaleX(-1); */
  /* transform-style: preserve-3d; */
  position: relative;
  transform: rotateX(3.142rad);
`;

const list_of_indicators = [
  { name: "GDP", code: "NY.GDP.MKTP.CD" },
  { name: "Life Expectancy", code: "SP.DYN.LE00.IN" }
];

const PageParent = styled.div`
  overflow: hidden;
  /* width: 100vw; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
`;

const WidgetImg = styled.img`
  width: 100%;
`;

const CloseBtn = styled.button`
  background-color: #ffb800;
  text-align: center;
  border: none;
  text-decoration: none;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
`;

const WidgetWrapper = styled.div`
  box-sizing: border-box;
  /* padding: 2px; */

  width: 80vw;
  height: 80vh;
  /* background-color: teal; */
  background-color: #1a1a1a;
  z-index: 50;
  border: 5px solid #ffb800;
`;

const Ghost = styled.div`
  width: 10px;
  height: 7vh;
`;

const ScrollableContainer = styled.div`
  /* margin-top: 7vh; */
  position: fixed;
  overflow-x: hidden;
  overflow-y: auto;
  /* margin-top: 2vh; */
  margin-bottom: 2vh;
  max-height: 42.7rem;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  ::-webkit-scrollbar {
    background: #1a1a1a;
  }
  ::-webkit-scrollbar-thumb {
    background: #6c1107;
    border-radius: 10px;
  }
  z-index: 50;
`;

const StyledScrollbars = styled(Scrollbars)`
  max-height: 42.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const BigHead = styled.div`
  /* margin-top: 2rem; */
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
  /* background-color: #1a1a1a; */
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

  return (
    <g>
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
            // fill={}
            updateTooltipData={updateTooltipData} // second children
          >
            <>{console.log(d.purpose)}</>
          </RectwithState>

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
      // width: 960,
      width: 1800,
      height: 700
    },
    rectHoverTooltipData: [],
    isDisplayingHoverTip: false,
    tooltipData: { name: "Jack", profession: "ripper" },
    isDisplayingWidget: false,
    widgetDisplayData: {},
    isDisplayingWelcome: false,
    widgetChartData1: [],
    widgetChartData2: [],
    currentIndicator: "GDP (current US$)"
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
    // console.log("hover click");
  }

  updateTooltipData = data => {
    // console.log(data);
    this.state.loadingFinished && this.setState({ tooltipData: data });
  };

  handleCloseWidget = () => {
    this.setState({ isDisplayingWidget: false });
  };

  handleOpenWidget = data => {
    const code_1 = data.entity_1_country_code;
    const code_2 = data.entity_2_country_code;

    // The connection used to load resources from https://www.globalsecurity.org used TLS 1.0 or TLS 1.1, which are deprecated and will be disabled in the future. Once disabled, users will be prevented from loading these resources. The server should enable TLS 1.2 or later. See https://www.chromestatus.com/feature/5654791610957824 for more information.

    this.getDataAsync(code_1).then(
      res => this.setState({ widgetChartData1: res })
      // console.log(res)
    );
    this.getDataAsync(code_2).then(
      res => this.setState({ widgetChartData2: res })
      // console.log("nonono")
    );

    data && this.setState({ widgetDisplayData: data });
    this.setState({ isDisplayingWidget: true });
  };

  async getAsyncIndicatorData(country_code, indicator) {
    let api_url =
      "https://api.worldbank.org/v2/country/" +
      country_code +
      "/indicator/" +
      indicator +
      "?format=jsonp";

    let data = await jsonp(api_url, { param: "prefix" });
    let chartData = [];

    data[1]
      .reverse()
      .forEach((d, i) => (chartData[i] = { date: d.date, value: d.value }));

    let formulatedData = {
      indicator_name: data[1][0].indicator.value,
      chartData: chartData
    };
    // console.log(formulatedData);
    return formulatedData;
  }

  async getDataAsync(country_code) {
    let data = list_of_indicators.map(async (d, i) => {
      return this.getAsyncIndicatorData(country_code, d.code);
    });
    let dude = await Promise.all(data);
    console.log(dude);
    return dude;
    // this.setState({ chart_1_data: await Promise.all(data) });
  }

  getMax(data1, data2, data3, data4) {
    let max = Math.max(
      Math.max(data1),
      Math.max(data2),
      Math.max(data3),
      Math.max(data4)
    );
    console.log(max);
  }

  findIndicator(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indicator_name === this.state.currentIndicator) {
        // console.log(arr[i]);
        return arr[i];
      }
    }
    // return object.indicator_name === this.state.currentIndicator;
  }

  // widgetChartData1
  findMaxRange(data) {
    let arr_of_value = [];
    this.findIndicator(data).chartData.map(
      (d, i) => (arr_of_value[i] = d.value)
    );
    let maxVal = Math.max(...arr_of_value);
    console.log(maxVal);
  }

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

  componentDidUpdate() {
    console.log(this.state);
  }
  render() {
    const {
      svgDimensions,
      loadingFinished,
      isDisplayingWidget,
      widgetDisplayData,
      widgetChartData1,
      widgetChartData2
    } = this.state;
    const rectPrimeStats = {
      width: 250,
      height: 250
    };
    const visualSvgBoxStats = {
      width: 2500,
      height: 300
    };
    const mockupData = [1, 2, 3, 4, 5];
    const chartMockupData = ["10", "20", "30", "40"];
    const chartSpaceWidth = rectPrimeStats.width * 5;
    const chartSpaceHeight = rectPrimeStats.height * 1.5;
    const chartSpaceGap = 50;
    return (
      <>
        <PageParent>
          <GlobeIndexWrapper>
            <Globe />
          </GlobeIndexWrapper>
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
          {/* <PageParent> */}
          {isDisplayingWidget && (
            <WidgetWrapper>
              <CloseBtn onClick={this.handleCloseWidget}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 141 142"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M61.4558 70.8955L0.00341797 132.348L8.94189 141.286L70.3943 79.8335L131.847 141.286L140.785 132.348L79.3329 70.8955L140.785 9.44287L131.847 0.504395L70.3943 61.957L8.94189 0.504395L0.00341797 9.44287L61.4558 70.8955Z"
                    fill="black"
                  />
                </svg>
              </CloseBtn>
              <ScrollableContainer>
                <Ghost />
                {this.findIndicator(widgetChartData1) && (
                  <BarChart
                    width={150}
                    height={40}
                    data={this.findIndicator(widgetChartData1).chartData}
                  >
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                )}
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
                            key={"rectPrime-" + i}
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
                            key={"circle-" + i}
                            cx={
                              (i * rectPrimeStats.width) / 6 / 2 +
                              rectPrimeStats.width / 12
                            }
                            cy={0}
                            r={rectPrimeStats.width / 12}
                            fill={"none"}
                            stroke={"#F62919"}
                            strokeWidth="4"
                          />
                        ))}
                      </g>
                    </def>
                    {mockupData.map((d, i) => (
                      <use
                        key={"wall-group-" + i}
                        className="wall_body"
                        xlinkHref="#rectPrime"
                        x={
                          i * rectPrimeStats.width +
                          (visualSvgBoxStats.width -
                            rectPrimeStats.width * mockupData.length) /
                            2
                        }
                        y={
                          (visualSvgBoxStats.height - rectPrimeStats.height) /
                            2 +
                          30
                        }
                      />
                    ))}
                  </svg>
                </BigHead>
                {this.findIndicator(widgetChartData1) && (
                  <StyledWhatever>
                    <BarChart
                      width={150}
                      height={40}
                      data={this.findIndicator(widgetChartData1).chartData}
                    >
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </StyledWhatever>
                )}

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

                    {widgetDisplayData.description && (
                      <div>{widgetDisplayData.description}</div>
                    )}
                    {widgetDisplayData.thumbnail && (
                      <WidgetImg src={widgetDisplayData.thumbnail} />
                    )}
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
