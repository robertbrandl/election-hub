import {React, useState} from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import Popup from "../../components/Popup/Popup";

// GeoJSON data for US states
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Map = ({ stateColors, stateAverages }) => {
    const [selectedState, setSelectedState] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
  
    const handleStateClick = (stateName) => {
      if (stateAverages[stateName]) {
        setSelectedState({
          name: stateName,
          candidates: Object.entries(stateAverages[stateName]).map(
            ([name, data]) => ({
              name,
              party: data.party,
              average: data.average,
            })
          ),
        });
        setShowPopup(true);
      }
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
                const fillColor = stateColors[stateName] || '#EEE'; // Default color if no data provided
  
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
          <Popup
            stateName={selectedState.name}
            candidates={selectedState.candidates}
            onClose={handleClosePopup}
          />
        )}
      </>
    );
  };

export default Map;
