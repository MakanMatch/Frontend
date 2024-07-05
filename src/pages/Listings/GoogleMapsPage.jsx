/* eslint-disable react/prop-types */
import GoogleMaps from "../../components/listings/GoogleMaps";
import { useSearchParams } from "react-router-dom";

const GoogleMapsPage = () => {
    const [searchParams] = useSearchParams();
    const latitude = Number(searchParams.get('latitude'));
    const longitude = Number(searchParams.get('longitude'));
    return (
        <GoogleMaps lat={latitude} long={longitude}/>
    );
}

export default GoogleMapsPage;
