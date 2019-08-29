import React, { Component } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import _ from "lodash";
import * as dg from "dis-gui";
import barrier_data from "../barrier_data_updated.json";
import styled from "styled-components";

const SvgWrapper = styled.svg`
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: -1;
`;

function mapProjection(rotate, scale) {
  let s = 130;
  let r = 150;
  if (scale) {
    s = scale;
  }
  if (rotate) {
    r = rotate;
  }
  return geoMercator()
    .scale(s)
    .translate([800 / 2, 450 / 2])
    .rotate([r, 0, 0]);
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

const MapGroup = props => (
  <g className="countries">
    {/* {console.log(props)} */}
    {props.worldData.map((d, i) => (
      <path
        key={`path-${i}`}
        d={geoPath().projection(mapProjection(props.x, props.scale))(d)}
        // fill={`rgba(38,50,56,${(1 / props.worldData.length) * i})`}
        fill={"#EEE"}
        strokeWidth={0.5}
        stroke="#FFFFFF"
        onClick={() => props.handleCountryClick(i)}
      />
    ))}
  </g>
);

const Circle = props => (
  <circle
    key={`marker-${props.i}`}
    cx={mapProjection()(props.data.lat)}
    cy={mapProjection()(props.data.long)}
    r={10}
    fill="#E91E63"
    stroke="#FFFFFF"
  />
);

const BarrierCircle = props => <div>hello</div>;

const CityCirlces = props => (
  <circle
    key={`marker-${props.index.i}`}
    cx={mapProjection()(props.data.coordinates)[0]}
    cy={mapProjection()(props.data.coordinates)[1]}
    r={props.data.population / 3000000}
    fill="#E91E63"
    stroke="#FFFFFF"
    className="marker"
    onClick={() => this.handleMarkerClick(i)}
    data-rh="Top"
  />
);

const MarkerGroup = props => (
  <>
    <g>
      {props.data.map((barrier, i) => (
        <circle
          cx={
            mapProjection()([
              barrier.coordinates.lat,
              barrier.coordinates.long
            ])[0]
          }
          cy={
            mapProjection()([
              barrier.coordinates.lat,
              barrier.coordinates.long
            ])[1]
          }
          r={5}
          fill="#E91E63"
          stroke="#FFFFFF"
          className="marker"
          onClick={() => this.handleMarkerClick(i)}
          data-rh="Top"
        />
      ))}
    </g>
  </>
);

const MapSVG = props => (
  <SvgWrapper viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
    <MapGroup {...props} />
    <MarkerGroup data={props.barrierData} cities={props.cities} />
  </SvgWrapper>
);

class MapContainer extends Component {
  state = {
    worldData: [],
    countryCode: [],
    barrierData: [],
    x: 150,
    scale: 130
  };

  componentDidMount() {
    this.fetchCountries();
    this.fetchCities();
    this.fetchWalls();
  }

  fetchCountries() {
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
  }
  fetchCities() {
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
  fetchWalls() {
    this.setState({
      barrierData: barrier_data
    });
  }

  handleCountryClick(countryIndex) {
    console.log("Clicked on country: ", this.worldData[countryIndex]);
  }
  handleMarkerClick(markerIndex) {}

  handleUpdate = data => this.setState({ data });

  handleMousePan(value) {
    this.setState({ x: value });
    // console.log(this.state.x);
  }
  handleScaleUpdate(value) {
    this.setState({ scale: value });
  }

  handleUpdateData() {
    // console.log(this.state);
    addCountryNameToData(this.state.worldData, this.state.countryCode);
  }

  render() {
    return (
      <div>
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
            <dg.Number
              label="Scale"
              value={100}
              min={0}
              max={300}
              step={1}
              onChange={value => this.handleScaleUpdate(value)}
            />
          </dg.GUI>
        </div>
        <MapSVG
          {...this.state}
          handleCountryClick={this.handleCountryClick}
          handleMarkerClick={this.handleMarkerClick}
        />
      </div>
    );
  }
}

export default MapContainer;
