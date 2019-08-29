import React, { Component } from "react";
import styled from "styled-components";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps";
import { Motion, spring } from "react-motion";
// import csv from "csvtojson";
// import CsvParse from "@vtex/react-csv-parse";
import { csv, path } from "d3";

import MapJSON from "../data/world-110m.json";

import barriers from "../data/barrier_data_updated.json";
// import missingCSV from "../data/missingdata.csv";

// console.log(missingCSV);

// console.log(MapJSON);

const MapZoomButtonDiv = styled.div`
  z-index: 10;
`;
const MapPageWrapper = styled.div`
  pointer-events: none;

  width: 100vw;
  height: 100vh;
  display: flex;

  /* z-index: 2; */
  /* position: fixed; */
`;

const StyledComposableMap = styled(ComposableMap)`
  pointer-events: auto;
  z-index: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* background-color: teal; */
  position: fixed;
`;

const StyledSVG = styled.svg`
  pointer-events: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: teal;
  position: fixed;
  z-index: 0;
`;

// const cities = [
//   { name: "Zurich", coordinates: [8.5417, 47.3769] },
//   { name: "Singapore", coordinates: [103.8198, 1.3521] },
//   { name: "San Francisco", coordinates: [-122.4194, 37.7749] },
//   { name: "Sydney", coordinates: [151.2093, -33.8688] },
//   { name: "Lagos", coordinates: [3.3792, 6.5244] },
//   { name: "Buenos Aires", coordinates: [-58.3816, -34.6037] },
//   { name: "Shanghai", coordinates: [121.4737, 31.2304] }
// ];

function parseNumArray(numString) {
  // parse to two numbers
  let stringArr = numString.split(", ");
  let numArr = stringArr.map(s => parseFloat(s));
  // console.log(numArr);
  return numArr;
}

class WorldMap extends Component {
  state = {
    svgDimensions: {
      width: 960,
      height: 700
    },
    topoJSONData: [],
    barrier_data: [],
    missingMigrantData: [],
    center: [0, 20],
    zoom: 1
  };
  handleZoomIn = () => {
    this.setState({
      zoom: this.state.zoom * 2
    });
  };
  handleZoomOut = () => {
    this.setState({
      zoom: this.state.zoom / 2
    });
  };
  handleCityClick = city => {
    console.log("city click");
    this.setState({
      zoom: 2,
      center: city.coordinates
    });
  };
  handleReset = () => {
    this.setState({
      center: [0, 20],
      zoom: 1
    });
  };

  generateJSON = () => {
    let json = {};
    // const { csvData, header } = this.state;
    const csvData = missingCSV;
    if (csvData !== "") {
      const rows = csvData.split("\n").map(row => {
        return this.RowParser(row);
      });
      const headerRow = rows[0];
      json = rows.slice(1, rows.length - 1).map(row => {
        let obj = {};
        row.map((cell, index) => {
          obj[headerRow[index]] = cell;
        });
        return obj;
      });
    }
    // let output = JSON.stringify(json, null, 2).replace(/\\r/g, "");
    console.log(json);
    this.setState({ missingData: json });
    // return JSON.stringify(json, null, 2).replace(/\\r/g, "");
  };

  RowParser = row => {
    const reg = /"(.*?)"/g;
    const matches = row.match(reg);
    if (matches) {
      return matches.map(value => {
        return value.substr(1, value.length - 2);
      });
    }
    return row.split(",");
  };

  componentDidMount() {
    // this.generateJSON();
    csv(
      "https://gist.githubusercontent.com/kylingoround/2c6d2ea76049be2697193d4f55e53103/raw/b339afce6d49244b9def98d96f82484a73b390fe/missingdata.csv"
    ).then(res => this.setState({ missingData: res }));

    parseNumArray("32.058118300000, -111.623576100000");
  }

  render() {
    const { svgDimensions, missingData } = this.state;
    return (
      <>
        {/* <MapZoomButtonDiv>
          <button onClick={this.handleZoomIn}>{"Zoom in"}</button>
          <button onClick={this.handleZoomOut}>{"Zoom out"}</button>
          <button onClick={this.handleReset}>{"Reset"}</button>
        </MapZoomButtonDiv> */}
        <Motion
          className="motion-ele"
          defaultStyle={{
            zoom: 1,
            x: 0,
            y: 20
          }}
          style={{
            zoom: spring(this.state.zoom, { stiffness: 210, damping: 20 }),
            x: spring(this.state.center[0], { stiffness: 210, damping: 20 }),
            y: spring(this.state.center[1], { stiffness: 210, damping: 20 })
          }}
        >
          {({ zoom, x, y }) => (
            <StyledComposableMap
              projectionConfig={{ scale: 205 }}
              width={980}
              height={551}
              style={{
                width: "100%",
                height: "auto"
              }}
            >
              <ZoomableGroup center={[x, y]} zoom={zoom}>
                <Geographies geography={MapJSON}>
                  {(geographies, projection) =>
                    geographies.map(
                      (geography, i) =>
                        geography.id !== "010" && (
                          <Geography
                            key={i}
                            geography={geography}
                            projection={projection}
                            style={{
                              default: {
                                fill: "#ECEFF1",
                                stroke: "#607D8B",
                                strokeWidth: 0.75,
                                outline: "none"
                              },
                              hover: {
                                fill: "#CFD8DC",
                                stroke: "#607D8B",
                                strokeWidth: 0.75,
                                outline: "none"
                              },
                              pressed: {
                                fill: "#FF5722",
                                stroke: "#607D8B",
                                strokeWidth: 0.75,
                                outline: "none"
                              }
                            }}
                          />
                        )
                    )
                  }
                </Geographies>
                <Markers>
                  {barriers.map((barrier, i) => (
                    <Marker
                      key={i}
                      // marker={{ coordinates: [8.5, 47.3] }
                      marker={{
                        coordinates: [
                          barrier.coordinates.long,
                          barrier.coordinates.lat
                        ]
                      }}
                      onClick={this.handleCityClick}
                    >
                      {/* {console.log(barrier)} */}
                      <circle
                        cx={0}
                        cy={0}
                        r={6}
                        fill="#FF5722"
                        stroke="#DF3702"
                      />
                    </Marker>
                  ))}
                </Markers>
                {/* <Markers>
                  {missingData &&
                    missingData.map(
                      (d, i) =>
                        // console.log(d)
                        // console.log(parseNumArray(d["Location Coordinates"]))
                        d["Location Coordinates"] && (
                          <Marker
                            key={i}
                            marker={{
                              coordinates: parseNumArray(
                                d["Location Coordinates"]
                              ).reverse()
                            }}
                            // onClick={this.handleCityClick}
                          >
                            <circle
                              cx={0}
                              cy={0}
                              r={1}
                              fill="#000"
                              stroke="#000"
                            />
                          </Marker>
                        )
                    )}
                </Markers> */}
              </ZoomableGroup>
            </StyledComposableMap>
          )}
        </Motion>
      </>
    );
  }
}

export default WorldMap;
