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

import Widget from "../parts/Widget";

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
            {/* <>{console.log(d.purpose)}</> */}
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

  findIndicator = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indicator_name === this.state.currentIndicator) {
        // console.log(arr[i]);
        return arr[i];
      }
    }
    // return object.indicator_name === this.state.currentIndicator;
  };

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
      barrierData,
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
            <Globe barrierData={barrierData} />
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
            <Widget
              widgetChartData1={widgetChartData1}
              widgetChartData2={widgetChartData2}
              visualSvgBoxStats={visualSvgBoxStats}
              rectPrimeStats={rectPrimeStats}
              mockupData={mockupData}
              widgetDisplayData={widgetDisplayData}
              handleCloseWidget={this.handleCloseWidget}
              findIndicator={this.findIndicator}
            />
          )}
        </PageParent>
      </>
    );
  }
};

export default RectWall;
