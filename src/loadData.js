import React, { Component } from "react";
import fetchJsonp from "fetch-jsonp";
import jsonp from "@tmcw/jsonp";
// world bank

function getJSONP() {
  let url =
    "http://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD?format=jsonp";

  let data = jsonp(url, {
    param: "prefix"
  });

  let vanilla = "https://api.worldbank.org/v2/incomeLevels/LIC/countries";
  let pop = "http://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD";
  let baba = "http://api.worldbank.org/v2/country/BRA";
  let cake =
    "https://api.worldbank.org/countries/kor;aus;btn;mac/indicators/NE.IMP.GNFS.ZS?date=1995:2017";

  let jsonpp = "?format=jsonp";

  let popko =
    "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=jsonP&prefix=Getdata";
  let pipiku =
    "https://api.worldbank.org/countries/kor;aus;btn;mac/indicators/NE.IMP.GNFS.ZS?date=1995:2017&format=jsonp&prefix=test";

  let pie = "https://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD";

  jsonp(
    "https://api.worldbank.org/v2/incomeLevels/LIC/countries/?format=jsonp",
    {
      param: "prefix"
    }
  ).then(res => console.log("hohoho"));

  jsonp(
    "https://api.worldbank.org/v2/country/BRA/indicator/1.1.PGap.Poor4uds?format=jsonp",
    {
      param: "prefix"
    }
  ).then(res => console.log(res[1]));
}

function getData(country_code, indicator) {
  let list_of_indicators = [
    { name: "GDP", code: "NY.GDP.MKTP.CD" },
    { name: "Life Expectancy", code: "SP.DYN.LE00.IN" }
  ];
  let api_url =
    "https://api.worldbank.org/v2/country/" +
    country_code +
    "/indicator/1.1.PGap.Poor4uds";
  let json_format = "?format=jsonp";
  jsonp(api_url + json_format, { param: "prefix" }).then(res =>
    console.log(res)
  );
}

// missing people
// function getHumanitarianData(coountry_id) {}

class LoadData extends Component {
  componentDidMount() {
    // getEconomicData("BRA");
    // getJSONP();
    getData("BRA");
  }
  render() {
    return <div>what</div>;
  }
}

export default LoadData;
