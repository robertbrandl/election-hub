import { React, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Popup from "../../components/Popup/Popup";

// GeoJSON data for US states
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Map = ({ stateColors, stateAverages }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleStateClick = (stateName) => {
    if (stateName === "Nebraska") {
      // Check for both Nebraska-0 and Nebraska-2 in stateAverages if Senate
      const nebraskaRaces = [];
      if (!stateAverages["Nebraska"]){

      if (stateAverages["Nebraska-0"]) {
        nebraskaRaces.push({
          seat: "Seat 1",
          candidates: Object.entries(stateAverages["Nebraska-0"]).map(
            ([name, data]) => ({
              name,
              party: data.party,
              average: data.average,
            })
          ),
        });
      }

      if (stateAverages["Nebraska-2"]) {
        nebraskaRaces.push({
          seat: "Seat 2",
          candidates: Object.entries(stateAverages["Nebraska-2"]).map(
            ([name, data]) => ({
              name,
              party: data.party,
              average: data.average,
            })
          ),
        });
      }
      }
      else{
        nebraskaRaces.push({
          seat: "Statewide",
          candidates: Object.entries(stateAverages["Nebraska"]).map(
            ([name, data]) => ({
              name,
              party: data.party,
              average: data.average,
            })
          ),
        });
        if (stateAverages["Nebraska CD-2"]) {
          nebraskaRaces.push({
            seat: "District 2",
            candidates: Object.entries(stateAverages["Nebraska CD-2"]).map(
              ([name, data]) => ({
                name,
                party: data.party,
                average: data.average,
              })
            ),
          });
        }
      }
      

      setSelectedState({
        name: stateName,
        races: nebraskaRaces,
      });
    } else if (stateName === "Maine" && stateAverages["Maine CD-1"]) {
      const maineRaces = [];
      maineRaces.push({
        seat: "Statewide",
        candidates: Object.entries(stateAverages["Maine"]).map(
          ([name, data]) => ({
            name,
            party: data.party,
            average: data.average,
          })
        ),
      });
      if (stateAverages["Maine CD-1"]) {
        maineRaces.push({
          seat: "District 1",
          candidates: Object.entries(stateAverages["Maine CD-1"]).map(
            ([name, data]) => ({
              name,
              party: data.party,
              average: data.average,
            })
          ),
        });
      }
      if (stateAverages["Maine CD-2"]) {
        maineRaces.push({
          seat: "District 2",
          candidates: Object.entries(stateAverages["Maine CD-2"]).map(
            ([name, data]) => ({
              name,
              party: data.party,
              average: data.average,
            })
          ),
        });
      }
      setSelectedState({
        name: stateName,
        races: maineRaces,
      });
      

    }
    else if (stateAverages[stateName]) {
      setSelectedState({
        name: stateName,
        races: [
          {
            candidates: Object.entries(stateAverages[stateName]).map(
              ([name, data]) => ({
                name,
                party: data.party,
                average: data.average,
              })
            ),
          },
        ],
      });
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "auto" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const fillColor = stateColors[stateName] || "#EEE"; // Default color if no data provided

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFF"
                  strokeWidth={0.5}
                  onClick={() => handleStateClick(stateName)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {showPopup && selectedState && (
        <Popup stateName={selectedState.name} races={selectedState.races} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default Map;
