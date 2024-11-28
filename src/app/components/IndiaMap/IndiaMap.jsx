import React, { useEffect, useState } from "react";
import { VectorMap } from "react-jvectormap";
import "./IndiaMap.scss";
const token = localStorage.getItem('authToken');
const stateToRegionCode = {
  "Andhra Pradesh": "IN-AP",
  "Arunachal Pradesh": "IN-AR",
  "Assam": "IN-AS",
  "Bihar": "IN-BR",
  "Chhattisgarh": "IN-CT",
  "Delhi": "IN-DD",
  "Goa": "IN-GA",
  "Gujarat": "IN-GJ",
  "Himachal Pradesh": "IN-HP",
  "Haryana": "IN-HR",
  "Jharkhand": "IN-JH",
  "Jammu and Kashmir": "IN-JK",
  "Karnataka": "IN-KA",
  "Kerala": "IN-KL",
  "Madhya Pradesh": "IN-MP",
  "Maharashtra": "IN-MH",
  "Manipur": "IN-ML",
  "Meghalaya": "IN-MG",
  "Mizoram": "IN-MZ",
  "Nagaland": "IN-NL",
  "Odisha": "IN-OR",
  "Punjab": "IN-PB",
  "Rajasthan": "IN-RJ",
  "Sikkim": "IN-SK",
  "Tamil Nadu": "IN-TN",
  "Tripura": "IN-TR",
  "Uttar Pradesh": "IN-UP",
  "Uttarakhand": "IN-UT",
  "West Bengal": "IN-WB"
};

const initialMapData = {
  "IN-AP": 0,
  "IN-AR": 0,
  "IN-AS": 0,
  "IN-BR": 0,
  "IN-CT": 0,
  "IN-DD": 0,
  "IN-DN": 0,
  "IN-GA": 0,
  "IN-GJ": 0,
  "IN-HP": 0,
  "IN-HR": 0,
  "IN-JH": 0,
  "IN-JK": 0,
  "IN-KA": 0,
  "IN-KL": 0,
  "IN-LA": 0,
  "IN-LD": 0,
  "IN-MH": 0,
  "IN-ML": 0,
  "IN-MN": 0,
  "IN-MP": 0,
  "IN-MZ": 0,
  "IN-NL": 0,
  "IN-OR": 0,
  "IN-PB": 0,
  "IN-PY": 0,
  "IN-RJ": 0,
  "IN-SK": 0,
  "IN-TG": 0,
  "IN-TN": 0,
  "IN-TR": 0,
  "IN-UP": 0,
  "IN-UT": 0,
  "IN-WB": 0
};

// Function to format map data for VectorMap
const formatMapData = (data) => {
  const mapData = { ...initialMapData };

  // Iterate over the states in the API data and map them to region codes
  for (const state in data["India"]) {
    if (stateToRegionCode[state]) {
      const regionCode = stateToRegionCode[state];
      mapData[regionCode] = data["India"][state]; // Set value for the corresponding region code
    }
  }

  return mapData;
};

const IndiaMap = () => {
  const [mapData, setMapData] = useState(formatMapData({})); // Initialize with empty data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadsPerState = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/Home/Graph/NumberOfLeadsInAState/", {
          method: "GET", // Specify the method if necessary (GET is the default)
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Optional: Specify content type if needed
          }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setMapData(formatMapData(data)); // Format and update the map data
      } catch (error) {
        console.error("Error fetching leads per state:", error);
        setMapData(formatMapData({})); // In case of error, set empty data
      } finally {
        setLoading(false); // Finish loading state
      }
    };

    fetchLeadsPerState();
  }, []);

  const handleshow2 = (e, el, code) => {
    el.html(`${el.html()} <br> Leads: ${mapData[code] || 0}`); // Show leads count on hover
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "1.5vw", color: "#202671", padding: "1vw" }}>
        Leads Across India
      </h1>
      <VectorMap
        map={"in_mill"}
        backgroundColor="transparent"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        focusOn={{ x: 0.5, y: 0.5, scale: 0, animate: false }}
        zoomOnScroll={true}
        containerStyle={{ width: "85%", height: "320px" }}
        onRegionClick={(e, countryCode) => console.log(countryCode)}
        onRegionTipShow={handleshow2}
        containerClassName="map"
        regionStyle={{
          initial: {
            fill: "#e4e4e4",
            "fill-opacity": 0.9,
            stroke: "none",
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
