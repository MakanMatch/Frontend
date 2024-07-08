/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";
import configureShowToast from "../../components/showToast";
import server from "../../networking";

const MarkeredGMaps = ({ addresses }) => {
  const mapRef = useRef(null);
  const toast = useToast();
  const showToast = configureShowToast(toast);

  useEffect(() => {
    if (addresses.length > 0) {
      console.log("Received the following addresses: ", addresses);

      const fetchCoordinates = async (address) => {
        const encodedAddress = encodeURIComponent(String(address));
        const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address="${encodedAddress}"&key=${apiKey}`;
        try {
          const response = await server.get(url);
          return response.data.results[0].geometry.location;
        } catch (error) {
          showToast("An error occured", "Failed to generate maps coordinates", "error", 3000);
          return null;
        }
      };

      const initializeMap = async (validCoordinates) => {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GMAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
        });
        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        if (validCoordinates.length === 0) {
          console.log("No valid coordinates found");
          new Map(mapRef.current, {
            center: { lat: 1.3521, lng: 103.8198 },
            zoom: 11,
            mapId: "DEMO_MAP_ID",
            mapTypeControl: false,
            streetViewControl: false,
          });
        } else {
          console.log(validCoordinates.length + " valid coordinates found");
          const map = new Map(mapRef.current, {
            center: validCoordinates[0],
            zoom: 11,
            mapId: "DEMO_MAP_ID",
            mapTypeControl: false,
            streetViewControl: false,
          });
          const demoCoordinates = { lat: 1.4284751, lng: 103.8359705 };
          new AdvancedMarkerElement({
            position: demoCoordinates,
            map: map,
          });
          validCoordinates.forEach(({ lat, lng }) => {
            new AdvancedMarkerElement({
              position: { lat, lng },
              map: map,
            });
          });
        }
      };

      Promise.all(addresses.map(fetchCoordinates))
        .then((coordinatesList) => {
          const validCoordinates = coordinatesList.filter(({ lat, lng }) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180);
          console.log("Consolidated valid coordinates:", validCoordinates);
          initializeMap(validCoordinates);
        })
        .catch((error) => {
          console.error("Error fetching address coordinates:", error);
        });
    }
  }, [addresses]);

  return (
    <div
      ref={mapRef}
      style={{ height: "83vh", width: "100%", borderRadius: "10px" }}
    />
  );
};

export default MarkeredGMaps;