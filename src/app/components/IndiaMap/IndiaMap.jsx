import React, { useEffect, useRef } from "react";
import { VectorMap } from "react-jvectormap";
import "./IndiaMap.scss";

const map = [
  { code: "IN-RJ", value: 10000 },
  { code: "IN-MP", value: 800 },
  { code: "IN-DL", value: 900 },
  { code: "IN-KL", value: 500 },
  { code: "IN-MH", value: 500 },
  { code: "IN-KA", value: 1500 },
  { code: "IN-BR", value: 11098 },
  { code: "IN-AP", value: 11800 },
];

const getdata = (key) => {
  const countryData = {};
  map.forEach((obj) => {
    countryData[obj.code] = obj.value;
  });
  return countryData[key];
};

const getalldata = () => {
  const countryData = {};
  map.forEach((obj) => {
    countryData[obj.code] = obj.value;
  });
  return countryData;
};

const handleshow2 = (e, el, code) => {
  el.html(el.html() + ` <br> Statics: ${getdata(code)}`);
};

const IndiaMap = () => {
  const mapRendered = useRef(false); // Track if the map has already been initialized
  
  useEffect(() => {
    if (!mapRendered.current) {
      mapRendered.current = true;
    }
  }, []);
  
  if (mapRendered.current) {
    return null; // Prevent re-rendering
  }
  
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontSize: "1.5vw",
          color: "#202671",
          padding: "1vw",
        }}
      >
        Students Active Across India
      </h1>
      <VectorMap
        map={"in_mill"}
        backgroundColor="transparent"
       
        focusOn={{
          x: 0.5,
          y: 0.5,
          scale: 0,
          animate: false,
        }}
        zoomOnScroll={true}
        containerStyle={{
          width: "90%",
          height: "320px",
        }}
        onRegionClick={(e, countryCode) => console.log(countryCode)}
        onRegionTipShow={handleshow2}
        containerClassName="map"
        regionStyle={{
          initial: {
            fill: "#e4e4e4",
            "fill-opacity": 0.9,
            stroke: "none",
            "stroke-width": 0,
            "stroke-opacity": 0,
          },
          hover: {
            "fill-opacity": 0.8,
            cursor: "pointer",
          },
          selected: {
            fill: "#2938bc", // onClick color of state
          },
        }}
        regionsSelectable={false}
        series={{
          regions: [
            {
              values: getalldata(),
              scale: ["#6e2e6a", "#202671"],
              normalizeFunction: "polynomial",
            },
          ],
        }}
      />
    </div>
  );
};

export default IndiaMap;
