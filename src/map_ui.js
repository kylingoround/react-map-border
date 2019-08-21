import React, { Component } from "react";
// map related modules
import { geoMercator, geoPath } from "d3-geo";
// even more projections if needed
import { geoMiller } from "d3-geo-projection";
import { feature } from "topojson-client";

import _ from "lodash";

// import DatGui, {
//   DatBoolean,
//   DatColor,
//   DatNumber,
//   DatString
// } from "react-dat-gui";
// import "react-dat-gui/build/react-dat-gui.css";

import * as dg from "dis-gui";

// CSS-in-JS styling
import styled from "styled-components";

// draggable map example:
// https://bl.ocks.org/piwodlaiwo/73f7a0e28c53d26c04f30a754de49085

// want to use hooks!
// no time for tuts :(

////////////////////////////////////////////////////////////////
// styled div declirations

const SvgWrapper = styled.svg`
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: -1;
`;

////////////////////////////////////////////////////////////////
// helper functions

function mapProjection(x) {
  return geoMercator()
    .scale(100)
    .translate([800 / 2, 450 / 2])
    .rotate([x, 0, 0]);
}

function getNameByCode(code, data) {
  _.find(data, function(o) {
    return o.country - code === code;
  });
}

// deal with this later
function addCountryNameToData(world_data, country_code_data) {
  let dataHolder = world_data;
  dataHolder.forEach(i => {
    i.countryName = getNameByCode(i, country_code_data);
  });
  console.log("yo");
  console.log(dataHolder);
  // this.setState({ worldData: dataHolder });
}

////////////////////////////////////////////////////////////////
// business

const MapGroup = props => (
  <g className="countries">
    {/* {console.log(props)} */}
    {props.worldData.map((d, i) => (
      <path
        key={`path-${i}`}
        d={geoPath().projection(mapProjection(props.x))(d)}
        // fill={`rgba(38,50,56,${(1 / props.worldData.length) * i})`}
        fill={"#EEE"}
        strokeWidth={0.5}
        stroke="#FFFFFF"
        onClick={() => props.handleCountryClick(i)}
      />
    ))}
  </g>
);

const MarkerGroup = props => <g />;

const MapSVG = props => (
  <SvgWrapper viewBox="0 0 800 450">
    <MapGroup {...props} />
    <MarkerGroup />
  </SvgWrapper>
);

class MapContainer extends Component {
  state = {
    worldData: [],
    countryCode: [],
    x: 150
  };
  cities = [
    {
      name: "Tokyo",
      coordinates: [139.6917, 35.6895],
      population: 37843000
    },
    {
      name: "Jakarta",
      coordinates: [106.865, -6.1751],
      population: 30539000
    },
    {
      name: "Delhi",
      coordinates: [77.1025, 28.7041],
      population: 24998000
    },
    {
      name: "Manila",
      coordinates: [120.9842, 14.5995],
      population: 24123000
    },
    {
      name: "Seoul",
      coordinates: [126.978, 37.5665],
      population: 23480000
    },
    {
      name: "Shanghai",
      coordinates: [121.4737, 31.2304],
      population: 23416000
    },
    {
      name: "Karachi",
      coordinates: [67.0099, 24.8615],
      population: 22123000
    },
    {
      name: "Beijing",
      coordinates: [116.4074, 39.9042],
      population: 21009000
    },
    {
      name: "New York",
      coordinates: [-74.0059, 40.7128],
      population: 20630000
    },
    {
      name: "Guangzhou",
      coordinates: [113.2644, 23.1291],
      population: 20597000
    },
    {
      name: "Sao Paulo",
      coordinates: [-46.6333, -23.5505],
      population: 20365000
    },
    {
      name: "Mexico City",
      coordinates: [-99.1332, 19.4326],
      population: 20063000
    },
    {
      name: "Mumbai",
      coordinates: [72.8777, 19.076],
      population: 17712000
    },
    {
      name: "Osaka",
      coordinates: [135.5022, 34.6937],
      population: 17444000
    },
    {
      name: "Moscow",
      coordinates: [37.6173, 55.7558],
      population: 16170000
    },
    {
      name: "Dhaka",
      coordinates: [90.4125, 23.8103],
      population: 15669000
    },
    {
      name: "Greater Cairo",
      coordinates: [31.2357, 30.0444],
      population: 15600000
    },
    {
      name: "Los Angeles",
      coordinates: [-118.2437, 34.0522],
      population: 15058000
    },
    {
      name: "Bangkok",
      coordinates: [100.5018, 13.7563],
      population: 14998000
    },
    {
      name: "Kolkata",
      coordinates: [88.3639, 22.5726],
      population: 14667000
    },
    {
      name: "Buenos Aires",
      coordinates: [-58.3816, -34.6037],
      population: 14122000
    },
    {
      name: "Tehran",
      coordinates: [51.389, 35.6892],
      population: 13532000
    },
    {
      name: "Istanbul",
      coordinates: [28.9784, 41.0082],
      population: 13287000
    },
    { name: "Lagos", coordinates: [3.3792, 6.5244], population: 13123000 },
    {
      name: "Shenzhen",
      coordinates: [114.0579, 22.5431],
      population: 12084000
    },
    {
      name: "Rio de Janeiro",
      coordinates: [-43.1729, -22.9068],
      population: 11727000
    },
    {
      name: "Kinshasa",
      coordinates: [15.2663, -4.4419],
      population: 11587000
    },
    {
      name: "Tianjin",
      coordinates: [117.3616, 39.3434],
      population: 10920000
    },
    { name: "Paris", coordinates: [2.3522, 48.8566], population: 10858000 },
    {
      name: "Lima",
      coordinates: [-77.0428, -12.0464],
      population: 10750000
    }
  ];

  componentDidMount() {
    fetch("https://unpkg.com/visionscarto-world-atlas/world/110m.json").then(
      response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`);
          return;
        }
        response.json().then(worldData => {
          console.log(worldData);
          this.setState({
            worldData: feature(worldData, worldData.objects.countries).features
          });
        });
      }
    );

    fetch(
      "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json"
    ).then(response => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then(countryCode => {
        console.log(countryCode);
        this.setState({
          countryCode
          // worldData: feature(worldData, worldData.objects.countries).features
        });
      });
    });
  }

  handleCountryClick(countryIndex) {
    console.log("Clicked on country: ", this.worldData[countryIndex]);
  }
  handleMarkerClick(markerIndex) {}

  handleUpdate = data => this.setState({ data });

  handleMousePan(value) {
    this.setState({ x: value });
    console.log(this.state.x);
  }

  handleUpdateData() {
    console.log(this.state);
    addCountryNameToData(this.state.worldData, this.state.countryCode);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.handleUpdateData()}>
          update the data!
        </button>
        <dg.GUI>
          <dg.Number
            label="Scroll"
            value={150}
            min={-300}
            max={300}
            step={1}
            onChange={value => this.handleMousePan(value)}
          />
        </dg.GUI>
        <MapSVG
          {...this.state}
          handleCountryClick={this.handleCountryClick}
          handleMarkerClick={this.handleMarkerClick}
        />
      </div>
    );
  }
}

const MapUI = () => (
  <div>
    <MapContainer />
    <div>
      Svg map UI
      <div>Configuration UI</div>
    </div>
  </div>
);

export default MapUI;
