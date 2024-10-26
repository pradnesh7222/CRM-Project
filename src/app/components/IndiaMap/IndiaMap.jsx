import React, { useEffect, useRef, useState } from "react";
import { VectorMap } from "react-jvectormap";
import "./IndiaMap.scss";

// Define the initial state mapping
const initialMapData = [

  { code: "IN-AP", value: 0 },
  { code: "IN-AR", value: 0 },
  { code: "IN-AS", value: 0 },
  { code: "IN-BR", value: 0 },
  { code: "IN-CT", value: 0 },
  { code: "IN-GA", value: 0 },
  { code: "IN-GJ", value: 0 },
  { code: "IN-HR", value: 0 },
  { code: "IN-HP", value: 0 },
  { code: "IN-JK", value: 0 },
  { code: "IN-JH", value: 0 },
  { code: "IN-KA", value: 0 },
  { code: "IN-KL", value: 0 },
  { code: "IN-MP", value: 0 },
  { code: "IN-MH", value: 0 },
  { code: "IN-MN", value: 0 },
  { code: "IN-ML", value: 0 },
  { code: "IN-MZ", value: 0 },
  { code: "IN-NL", value: 0 },
  { code: "IN-OR", value: 0 },
  { code: "IN-PB", value: 0 },
  { code: "IN-RJ", value: 0 },
  { code: "IN-SK", value: 0 },
  { code: "IN-TN", value: 0 },
  { code: "IN-TG", value: 0 },
  { code: "IN-TR", value: 0 },
  { code: "IN-UP", value: 0 },
  { code: "IN-UT", value: 0 },
  { code: "IN-WB", value: 0 },
  { code: "IN-AN", value: 0 },
  { code: "IN-CH", value: 0 },
  { code: "IN-DN", value: 0 },
  { code: "IN-DD", value: 0 },
  { code: "IN-LD", value: 0 },
  { code: "IN-PY", value: 0 },
  { code: "IN-LA", value: 0 }
];

// Mapping of API keys to map codes
const apiToMapCode = {

  ap: "IN-AP",
  ar: "IN-AR",
  as: "IN-AS",
  br: "IN-BR",
  ct: "IN-CT",
  ga: "IN-GA",
  gj: "IN-GJ",
  hr: "IN-HR",
  hp: "IN-HP",
  jk: "IN-JK",
  jh: "IN-JH",
  ka: "IN-KA",
  kl: "IN-KL",
  mp: "IN-MP",
  mh: "IN-MH",
  mn: "IN-MN",
  ml: "IN-ML",
  mz: "IN-MZ",
  nl: "IN-NL",
  or: "IN-OR",
  pb: "IN-PB",
  rj: "IN-RJ",
  sk: "IN-SK",
  tn: "IN-TN",
  tg: "IN-TG",
  tr: "IN-TR",
  up: "IN-UP",
  ut: "IN-UT",
  wb: "IN-WB",
  an: "IN-AN",
  ch: "IN-CH",
  dn: "IN-DN",
  dd: "IN-DD",
  ld: "IN-LD",
  py: "IN-PY",
  la: "IN-LA"
};


// Function to format map data for VectorMap
const formatMapData = (data) => {
  const formattedData = {};
  initialMapData.forEach((region) => {
    // Map API data to map region codes
    const apiKey = Object.keys(apiToMapCode).find(
      (key) => apiToMapCode[key] === region.code
    );
    formattedData[region.code] = Number(data[apiKey]) || 0;
  });
  console.log("Formatted Map Data:", formattedData); // Log formatted data
  return formattedData;
};

const IndiaMap = () => {
  const [mapData, setMapData] = useState(formatMapData({})); // Initialize with default values
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadsPerState = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/leads-per-state/");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from API");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setMapData(formatMapData(data)); // Format and set fetched data
      } catch (error) {
        console.error("Error fetching leads per state:", error);
        setMapData(formatMapData({})); // Use default data if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsPerState();
  }, []);

  const handleshow2 = (e, el, code) => {
    el.html(`${el.html()} <br> Leads: ${mapData[code] || 0}`);
  };

  if (loading) {
    return <div>Loading...</div>;
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
        Leads Across India
      </h1>
      <VectorMap
        map={"in_mill"}
        backgroundColor="transparent"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        focusOn={{
          x: 0.5,
          y: 0.5,
          scale: 0,
          animate: false,
        }}
        zoomOnScroll={true}
        containerStyle={{
          width: "85%",
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
            fill: "#2938bc",
          },
        }}
        regionsSelectable={false}
        series={{
          regions: [
            {
              values: mapData,
              scale: ["#ffd6fc", "#6e2e6a"],
              normalizeFunction: "polynomial",
            },
          ],
        }}
      />
    </div>
  );
};

export default IndiaMap;
