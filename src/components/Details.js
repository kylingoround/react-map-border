import React, { Component } from "react";
import styled from "styled-components";
import jsonp from "@tmcw/jsonp";
// import * as Rc from "recharts";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const PageWrapper = styled.div`
  width: 100vw;
  height: 95vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LeftDiv = styled.div`
  width: 10vw;
  background: #eee;
`;
const MidDiv = styled.div`
  width: 50vw;
  background: #999;
  height: 95%;
  display: flex;
  flex-direction: column;
`;

const RightDiv = styled.div`
  width: 10vw;
  background: #eee;
`;

const UpperHalf = styled.div`
  width: 100%;
  height: 50%;
  background: #222;
  outline: 1px solid #111;
`;
const LowerHalf = styled.div`
  width: 100%;
  height: 50%;
  outline: 1px solid #111;
`;

const StyledLineChart = styled(LineChart)`
  width: 100%;
  height: 100%;
`;

// function getData(country_code, indicator) {
//   let api_url =
//     "https://api.worldbank.org/v2/country/" +
//     country_code +
//     "/indicator/" +
//     indicator +
//     "?format=jsonp";

//   // console.log(api_url);

//   jsonp(api_url, { param: "prefix" }).then(
//     res => console.log(res[1])
//     // (datastore = res)
//   );
// }

const ImAChart = props => <div>Simple chart the just reads data</div>;

const list_of_indicators = [
  { name: "GDP", code: "NY.GDP.MKTP.CD" },
  { name: "Life Expectancy", code: "SP.DYN.LE00.IN" }
];

class Details extends Component {
  state = {
    entity_1_name: "",
    entity_1_code: "BRA",
    entity_2_name: "",
    entity_2_code: "",
    chart_1_data: {},
    test: {}
  };

  // getData(country_code, indicator) {
  //   let api_url =
  //     "https://api.worldbank.org/v2/country/" +
  //     country_code +
  //     "/indicator/" +
  //     indicator +
  //     "?format=jsonp";

  //   let result = jsonp(api_url, { param: "prefix" }).then(res =>
  //     this.setState({ test: res[1] })
  //   );
  // }

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
    this.setState({ chart_1_data: await Promise.all(data) });
  }

  handleDataSwitch(indicator_name) {
    console.log(this.state);
    console.log(indicator_name);
  }

  componentDidMount() {
    console.log(this.props);
    this.getDataAsync("BRA");
  }

  componentDidUpdate() {
    // console.log(this.state);
  }

  render() {
    return (
      <PageWrapper>
        <LeftDiv>
          <div>left columns</div>
          <button>economic data</button>
          <button>migrant data</button>
        </LeftDiv>
        <MidDiv>
          <UpperHalf>
            <div>Entity 1 Information</div>
            <div>it's a chart</div>
            {/* <ImAChart country_code={this.state.entity_1_code} /> */}
            {this.state.chart_1_data[0] && (
              <ResponsiveContainer width="100%" height="80%">
                <StyledLineChart
                  // width={400}
                  // height={200}
                  data={this.state.chart_1_data[0].chartData}
                >
                  {console.log(this.state.chart_1_data[0].chartData)}
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </StyledLineChart>
              </ResponsiveContainer>
            )}
          </UpperHalf>
          <LowerHalf>
            <div>Entity 2 Information</div>
            <div>it's the same chart</div>
            {this.state.chart_1_data[0] && (
              <ResponsiveContainer width="100%" height="80%">
                <StyledLineChart
                  // width={400}
                  // height={200}
                  data={this.state.chart_1_data[0].chartData}
                >
                  {console.log(this.state.chart_1_data[0].chartData)}
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </StyledLineChart>
              </ResponsiveContainer>
            )}
          </LowerHalf>
        </MidDiv>
        <RightDiv>
          <div>
            <div>different views od data</div>
            {list_of_indicators.map((d, i) => (
              <button onClick={() => this.handleDataSwitch(d.name)}>
                {d.name}
              </button>
            ))}
            {/* <button>GDP</button> */}
            {/* <button>Life Expectancy</button> */}
            {/* <button>something else</button> */}
          </div>
        </RightDiv>
      </PageWrapper>
    );
  }
}

export default Details;
