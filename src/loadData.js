import React, { Component } from "react";

// world bank
function getEconomicData(country_id) {
  let url =
    "http://api.worldbank.org/v2/country/" +
    country_id +
    "/indicator/NY.GDP.MKTP.CD?format=json";

  let url2 =
    "http://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD?format=json";
  console.log(url);

  let url3 = "https://randomuser.me/api/?results=10"

  // https://randomuser.me/
  // fetch(url2);
  fetch(url3)
    .then(res => console.log(res))
    .catch(error => console.log(error));
}

// missing people
// function getHumanitarianData(coountry_id) {}

class LoadData extends Component {
  componentDidMount() {
    getEconomicData("BRA");
  }
  render() {
    return <div>what</div>;
  }
}

export default LoadData;
