import React, { Component } from "react";
import styled from "styled-components";
import { BarChart, Bar, YAxis, Tooltip } from "recharts";

const WidgetWrapper = styled.div`
  box-sizing: border-box;
  width: 80vw;
  height: 80vh;
  background-color: #1a1a1a;
  z-index: 50;
  border: 5px solid #ffb800;
  position: fixed;
`;

const CloseBtn = styled.button`
  background-color: #ffb800;
  text-align: center;
  border: none;
  text-decoration: none;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
  position: float;
`;

const ScrollableContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 2vh;
  max-height: 42.7rem;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  ::-webkit-scrollbar {
    background: #1a1a1a;
  }
  ::-webkit-scrollbar-thumb {
    background: #6c1107;
    border-radius: 10px;
  }
`;

const BigHead = styled.div`
  width: 500px;
`;

const Ghost = styled.div`
  width: 10px;
  height: 7vh;
`;

const StyledWhatever = styled.div`
  position: relative;
  transform: rotateX(3.142rad);
`;

const StyledBack = styled.g`
  transform: rotateX(3.142rad);
`;

const ContentTextWrapper = styled.div`
  height: auto;
  max-width: 35rem;
`;

const ContentTextTitle = styled.div`
  padding-top: 2rem;
  font-size: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #dadada;
  text-align: center;
`;

const ContentTextBody = styled.div`
  padding-top: 2rem;
  font-size: 1rem;
  font-weight: 300;
  font-family: "Overpass", "Roboto", sans-serif;
  color: #dadada;
`;

const BoldSpan = styled.span`
  font-weight: 900;
  font-family: "Overpass", "Roboto", sans-serif;
`;

const WidgetImg = styled.img`
  width: 100%;
`;

const Widget = props => {
  const {
    widgetChartData1,
    widgetChartData2,
    visualSvgBoxStats,
    rectPrimeStats,
    mockupData,
    widgetDisplayData,
    handleCloseWidget,
    findIndicator
  } = props;
  return (
    <>
      <WidgetWrapper>
        <CloseBtn onClick={handleCloseWidget}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 141 142"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M61.4558 70.8955L0.00341797 132.348L8.94189 141.286L70.3943 79.8335L131.847 141.286L140.785 132.348L79.3329 70.8955L140.785 9.44287L131.847 0.504395L70.3943 61.957L8.94189 0.504395L0.00341797 9.44287L61.4558 70.8955Z"
              fill="black"
            />
          </svg>
        </CloseBtn>
        <ScrollableContainer>
          <Ghost />
          {findIndicator(widgetChartData1) && (
            <BarChart
              width={350}
              height={40}
              data={findIndicator(widgetChartData1).chartData}
            >
              <Bar dataKey="value" fill="#8884d8" />
              <YAxis type="number" domain={[0, 782483466666.667]} hide={true} />
              <Tooltip cursor={false} />
            </BarChart>
          )}
          <BigHead>
            <svg
              viewBox={
                "0 0 " +
                visualSvgBoxStats.width +
                " " +
                visualSvgBoxStats.height
              }
            >
              <def>
                <g id="rectPrime">
                  <rect
                    width={rectPrimeStats.width - 2}
                    height={rectPrimeStats.height}
                    x={0}
                    y={0}
                    fill={"#F62919"}
                  />
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => (
                    <rect
                      key={"rectPrime-" + i}
                      width={rectPrimeStats.width / 17}
                      height={rectPrimeStats.height * 0.8}
                      x={
                        (rectPrimeStats.width / 17) * i * 2 +
                        rectPrimeStats.width / 17
                      }
                      y={rectPrimeStats.height * 0.1}
                      fill={"#1A1A1A"}
                    />
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((d, i) => (
                    <circle
                      key={"circle-" + i}
                      cx={
                        (i * rectPrimeStats.width) / 6 / 2 +
                        rectPrimeStats.width / 12
                      }
                      cy={0}
                      r={rectPrimeStats.width / 12}
                      fill={"none"}
                      stroke={"#F62919"}
                      strokeWidth="4"
                    />
                  ))}
                </g>
              </def>
              {mockupData.map((d, i) => (
                <use
                  key={"wall-group-" + i}
                  className="wall_body"
                  xlinkHref="#rectPrime"
                  x={
                    i * rectPrimeStats.width +
                    (visualSvgBoxStats.width -
                      rectPrimeStats.width * mockupData.length) /
                      2
                  }
                  y={
                    (visualSvgBoxStats.height - rectPrimeStats.height) / 2 + 30
                  }
                />
              ))}
            </svg>
          </BigHead>

          {findIndicator(widgetChartData2) && (
            <StyledWhatever>
              <BarChart
                width={350}
                height={40}
                data={findIndicator(widgetChartData2).chartData}
              >
                <Bar dataKey="value" fill="#8884d8" />
                <YAxis
                  type="number"
                  domain={[0, 782483466666.667]}
                  hide={true}
                />
                {/* <StyledBack> */}
                {/* <Tooltip cursor={false} /> */}
                {/* </StyledBack> */}
              </BarChart>
            </StyledWhatever>
          )}

          <ContentTextWrapper>
            {/* <ContentTextTitle>US-Mexico Barrier</ContentTextTitle> */}
            {widgetDisplayData.border_name && (
              <ContentTextTitle>
                {widgetDisplayData.border_name}
              </ContentTextTitle>
            )}
            <ContentTextBody>
              {widgetDisplayData.built_status && (
                <div>
                  <BoldSpan> Status:</BoldSpan> {widgetDisplayData.built_status}
                </div>
              )}
              {widgetDisplayData["built-year"] && (
                <div>
                  <BoldSpan>Built Year:</BoldSpan>{" "}
                  {widgetDisplayData["built-year"]}
                </div>
              )}

              {widgetDisplayData.length && (
                <div>
                  <BoldSpan>Length:</BoldSpan> {widgetDisplayData.length} km
                </div>
              )}

              {widgetDisplayData.purpose && (
                <div>
                  <BoldSpan> Purpose:</BoldSpan> {widgetDisplayData.purpose}
                </div>
              )}

              {widgetDisplayData.description && (
                <div>{widgetDisplayData.description}</div>
              )}
              {widgetDisplayData.thumbnail && (
                <WidgetImg src={widgetDisplayData.thumbnail} />
              )}
            </ContentTextBody>
          </ContentTextWrapper>
        </ScrollableContainer>
      </WidgetWrapper>
    </>
  );
};

export default Widget;
