import React, { Component } from "react";
import styled from "styled-components";
import { geoMercator, geoPath, geoOrthographic } from "d3-geo";
import { scaleLinear } from "d3-scale";

import {
  ZoomableGlobe,
  ComposableMap,
  // ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps";

import { Motion, spring } from "react-motion";

import cities from "../data/world-most-populous-cities.json";

const populationScale = scaleLinear()
  .domain([10750000, 37843000])
  .range([5, 22]);

const GlobeWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  /* position: fixed; */
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto"
};

const ButtonWrapper = styled.div`
  position: fixed;
  top: 47vh;
  left: 2rem;
  display: flex;
  flex-direction: column;
`;

const GlobeBtn = styled.button``;
// const cities = [
//   { name: "Zurich", coordinates: [8.5417, 47.3769] },
//   { name: "Singapore", coordinates: [103.8198, 1.3521] },
//   { name: "San Francisco", coordinates: [-122.4194, 37.7749] },
//   { name: "Sydney", coordinates: [151.2093, -33.8688] },
//   { name: "Lagos", coordinates: [3.3792, 6.5244] },
//   { name: "Buenos Aires", coordinates: [-58.3816, -34.6037] },
//   { name: "Shanghai", coordinates: [121.4737, 31.2304] }
// ];

// need:
// onClick: give coordinates
// parent control child? sibling?

class AlbersUSA extends Component {
  state = {
    center: [-106.490558, 11.748966],
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
    this.setState({
      zoom: 2,
      center: city.coordinates
    });
  };
  handleBarrierClick = d => {
    console.log(d);
    this.setState({
      zoom: 2,
      center: [
        parseFloat(d.coordinates.long),
        parseFloat(d.coordinates.lat) - 20
      ]
    });
  };
  handleReset = () => {
    this.setState({
      center: [-106.490558, 11.748966],
      zoom: 1
    });
  };
  componentDidMount() {
    // this.props.hoverStatsfromDad != null &&
    //   this.setState({
    //     zoom: 2,
    //     center: this.props.hoverStatsfromDad
    //   });

    console.log("is there an update?");

    console.log(this.props);
  }
  componentDidUpdate() {
    console.log("is there an update?");
    console.log(this.props);
    this.props.hoverStatsfromDad !== this.state.center &&
      this.props.hoverStatsfromDad &&
      // <>
      //   <>{console.log("i shoudl update")}</>
      //   <>{console.log(this.props)}</>
      // </>
      this.setState({
        zoom: 2,
        center: this.props.hoverStatsfromDad
      });
  }
  render() {
    const { barrierData } = this.props;
    return (
      <>
        <ButtonWrapper>
          <button onClick={this.handleZoomIn}>{"Zoom in"}</button>
          <button onClick={this.handleZoomOut}>{"Zoom out"}</button>
          <button onClick={this.handleReset}>{"Reset"}</button>
        </ButtonWrapper>
        <div style={wrapperStyles}>
          <Motion
            defaultStyle={{
              zoom: 1,
              x: 0,
              y: 20
            }}
            style={{
              zoom: spring(this.state.zoom, { stiffness: 20, damping: 10 }),
              x: spring(this.state.center[0], { stiffness: 40, damping: 15 }),
              y: spring(this.state.center[1], { stiffness: 40, damping: 15 })
            }}
          >
            {({ zoom, x, y }) => (
              <ComposableMap
                projection="orthographic"
                projectionConfig={{
                  scale: 300
                }}
                width={1400}
                height={1400}
                style={{
                  width: "100%",
                  height: "auto"
                }}
              >
                <ZoomableGlobe
                  // center={[96, 32]}
                  center={[x, y]}
                  zoom={zoom}
                >
                  {/* <circle
                  cx={400}
                  cy={400}
                  r={300}
                  fill="transparent"
                  stroke="#eceff1"
                /> */}
                  <Geographies geography={this.props.data} disableOptimization>
                    {(geographies, projection) =>
                      geographies.map((geography, i) => {
                        return (
                          <Geography
                            key={i}
                            round
                            geography={geography}
                            projection={projection}
                            style={{
                              default: {
                                fill: "#000000",
                                // stroke: "#607D8B",
                                strokeWidth: 0.75,
                                outline: "none"
                              },
                              hover: {
                                fill: "#1a1a1a",
                                stroke: "#607D8B",
                                strokeWidth: 0.75,
                                outline: "none"
                              },
                              pressed: {
                                fill: "#eceff1",
                                stroke: "#607D8B",
                                strokeWidth: 0.75,
                                outline: "none"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  {/* <Marker marker={{ coordinates: [ 8.5, 47.3 ] }}> */}

                  <Markers>
                    {this.props.hoverStatsfromDad && (
                      <Marker
                        marker={{
                          coordinates: [
                            this.state.center[0],
                            this.state.center[1] + 20
                          ]
                        }}
                      >
                        {" "}
                        <circle cx={0} cy={0} r={5} fill="yellow" />
                      </Marker>
                    )}
                  </Markers>
                  <Markers>
                    {barrierData.map((d, i) => {
                      // console.log(d);
                      return (
                        <Marker
                          key={i}
                          marker={{
                            coordinates: [d.coordinates.long, d.coordinates.lat]
                          }}
                          style={{
                            default: { opacity: 0.8 },
                            hidden: { display: "none" }
                          }}
                          // onClick={this.handleCityClick}
                          onClick={() => this.handleBarrierClick(d)}
                        >
                          {" "}
                          <circle
                            cx={0}
                            cy={0}
                            r={5}
                            fill="rgba(255,0,0,0.5)"
                            // stroke="#FFF"
                          />
                          {/* <circle
                            cx={0}
                            cy={0}
                            r={5 + 2}
                            fill="transparent"
                            stroke="#FF5722"
                          /> */}
                        </Marker>
                      );
                    })}
                  </Markers>

                  <Markers>
                    {cities.map(city => {
                      const radius = populationScale(city.population);
                      return (
                        <Marker
                          key={city.name}
                          marker={city}
                          style={{
                            default: { opacity: 0.8 },
                            hidden: { display: "none" }
                          }}
                          onClick={this.handleCityClick}
                        >
                          {/* <circle
                            cx={0}
                            cy={0}
                            r={radius}
                            fill="#FF5722"
                            stroke="#FFF"
                          />
                          <circle
                            cx={0}
                            cy={0}
                            r={radius + 2}
                            fill="transparent"
                            stroke="#FF5722"
                          /> */}
                        </Marker>
                      );
                    })}
                  </Markers>
                </ZoomableGlobe>
              </ComposableMap>
            )}
          </Motion>
        </div>
      </>
    );
  }
}

class Globe extends Component {
  state = {
    topojson: null
  };

  componentDidMount() {
    console.log("globe initizing");
    fetch("https://unpkg.com/visionscarto-world-atlas/world/110m.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ topojson: data });
        console.log(data);
      })
      .catch(err => {
        console.log("Error Reading data " + err);
      });
  }

  render() {
    const { topojson } = this.state;
    const { barrierData } = this.props;
    return (
      <GlobeWrapper>
        {topojson && (
          <AlbersUSA
            data={topojson}
            barrierData={barrierData}
            hoverStatsfromDad={this.props.hoverStats}
          />
        )}
      </GlobeWrapper>
    );
  }
}

export default Globe;
