import React from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const WorldMap = () => (
  <Wrapper>
    <ComposableMap
      // projection={geoAlbersUsa}
      projectionConfig={{
        scale: 205,
        rotation: [-11, 0, 0]
      }}
      width={980}
      height={551}
      style={{
        width: "100%",
        height: "auto"
      }}
    >
      <ZoomableGroup center={[-97, 40]} disablePanning>
        <Geographies
          geography={"https://unpkg.com/world-atlas@1/world/50m.json"}
        >
          {(geographies, projection) =>
            geographies.map((geography, i) => (
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
                    strokeWidth: 1,
                    outline: "none"
                  },
                  pressed: {
                    fill: "#FF5722",
                    stroke: "#607D8B",
                    strokeWidth: 1,
                    outline: "none"
                  }
                }}
              />
            ))
          }
        </Geographies>
        <Markers>
          <Marker
            marker={{ coordinates: [-153.2917758, 67.75961636] }}
            style={{
              default: { fill: "#FF5722" },
              hover: { fill: "#FFFFFF" },
              pressed: { fill: "#FF5722" }
            }}
          >
            <circle
              cx={0}
              cy={0}
              r={5}
              style={{
                stroke: "#FF5722",
                strokeWidth: 3,
                opacity: 0.9
              }}
            />
          </Marker>
        </Markers>
      </ZoomableGroup>
    </ComposableMap>
  </Wrapper>
);

export default WorldMap;
