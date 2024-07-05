/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

const GoogleMaps = ({ lat, long }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            const LatLong = { lat: lat, lng: long};

            const map = new window.google.maps.Map(mapRef.current, {
                center: LatLong,
                zoom: 17,
            });

            new window.google.maps.Marker({
                position: LatLong,
                map: map,
                title: 'Hello Singapore!',
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [lat, long]);

    return (
        <div
            ref={mapRef}
            style={{ height: '80vh', width: '100%', borderRadius: '10px'}}
        />
    );
};

export default GoogleMaps;
