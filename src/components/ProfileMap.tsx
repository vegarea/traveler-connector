import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

const visitedCountries = [
  {
    name: "Spain",
    coordinates: [-3.7492, 40.4637],
    region: "Europe"
  },
  {
    name: "France",
    coordinates: [2.3522, 48.8566],
    region: "Europe"
  },
  {
    name: "Italy",
    coordinates: [12.4964, 41.9028],
    region: "Europe"
  },
  {
    name: "Japan",
    coordinates: [139.6917, 35.6895],
    region: "Asia"
  },
  {
    name: "Thailand",
    coordinates: [100.5018, 13.7563],
    region: "Asia"
  },
  {
    name: "Brazil",
    coordinates: [-47.8645, -15.7942],
    region: "South America"
  },
  {
    name: "Morocco",
    coordinates: [-6.8498, 34.0209],
    region: "Africa"
  },
  {
    name: "Australia",
    coordinates: [151.2093, -33.8688],
    region: "Oceania"
  }
];

// Cambiamos la URL al repositorio de Natural Earth Data, que es una fuente confiable y mantenida
const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const ProfileMap = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-card">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150
        }}
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#374151"
                  stroke="#6B7280"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: "#4B5563",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#374151",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {visitedCountries.map(({ name, coordinates, region }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={4} fill="#ef4444" />
              <title>{`${name} - ${region}`}</title>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default ProfileMap;