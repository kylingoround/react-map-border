import React, { Component } from "react";
import styled from "styled-components";
import jsonp from "@tmcw/jsonp";
import * as Rc from "recharts";

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
  outline: 1px solid #111;
`;
const LowerHalf = styled.div`
  width: 100%;
  height: 50%;
  outline: 1px solid #111;
`;

function getData(country_code, indicator) {
  let api_url =
    "https://api.worldbank.org/v2/country/" +
    country_code +
    "/indicator/" +
    indicator +
    "?format=jsonp";

  console.log(api_url);

  jsonp(api_url, { param: "prefix" }).then(
    res => console.log(res[1])
    // (datastore = res)
  );
}

function getListofData(country_code) {
  let list_of_indicators = [
    { name: "GDP", code: "NY.GDP.MKTP.CD" },
    { name: "Life Expectancy", code: "SP.DYN.LE00.IN" }
  ];

  list_of_indicators.map((d, i) => getData(country_code, d.code));
}

class ImAChart extends Component {
  state = {
    country_code: "",
    list_of_indicators: [
      { name: "GDP", code: "NY.GDP.MKTP.CD" },
      { name: "Life Expectancy", code: "SP.DYN.LE00.IN" }
    ]
  };
  componentDidMount() {}
  render() {
    return <div>nonono</div>;
  }
}

class Details extends Component {
  state = {
    entity_1_name: "",
    entity_1_code: "BRA",
    entity_2_name: "",
    entity_2_code: "",
    list_of_indicators: [
      { name: "GDP", code: "NY.GDP.MKTP.CD" },
      { name: "Life Expectancy", code: "SP.DYN.LE00.IN" }
    ]
  };
  componentDidMount() {
    // get data and setState({data})
    getListofData("BRA");
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
            <ImAChart country_code={this.state.entity_1_code} />
          </UpperHalf>
          <LowerHalf>
            <div>Entity 2 Information</div>
            <div>it's the same chart</div>
          </LowerHalf>
        </MidDiv>
        <RightDiv>
          <div>
            <div>
              set of buttons on the right that depends on categories - economic
            </div>
            <button>GDP</button>
            <button>Life Expectancy</button>
            <button>something else</button>
          </div>
          <div>
            <div>migrant data</div>
            <button>GDP</button>
            <button>Life Expectancy</button>
            <button>something else</button>
          </div>
        </RightDiv>
      </PageWrapper>
    );
  }
}

export default Details;
