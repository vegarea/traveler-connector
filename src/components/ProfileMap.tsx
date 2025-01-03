import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const ProfileMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Inicializar el mapa
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHMzcDN2NW0wMWF5MmpvNWR2dWd0ZXJ0In0.Q2nZvVh7TCrUXgAB_0USZA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5
    });

    // Añadir controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Añadir marcadores para cada país visitado
    visitedCountries.forEach((country) => {
      const marker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(country.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-bold">${country.name}</h3>
              <p class="text-sm text-gray-500">${country.region}</p>
            `)
        )
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ProfileMap;