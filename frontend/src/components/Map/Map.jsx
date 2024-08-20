import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// GeoJSON data for US states
const geoUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

const Map = ({ stateColors }) => {
  return (
    <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "auto" }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            const stateName = geo.properties.name;
            const fillColor = stateColors[stateName] || '#EEE'; // Default color if no data provided

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillColor}
                stroke="#FFF"
                strokeWidth={0.5}
                onClick={() => alert(`Clicked on ${stateName}`)}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default Map;
