// FoodListings Page to be put into App.jsx
import { useState, useEffect } from 'react'
import server from '../../networking'
import FoodListings from '../../components/listings/FoodListings'
import { Heading } from '@chakra-ui/react'

export default function FoodListingsPage() {
  const [foodListings, setFoodListings] = useState([]);
  const [hostName, setHostName] = useState("");
  const [hostFoodRating, setHostFoodRating] = useState("");

  useEffect(() => {
    const fetchFoodListings = async () => {
      try {
        console.log('Fetching food listings...');
        const response = await server.get('/listings');
        console.log('Food listings fetched:', response.data);
        setFoodListings(response.data);
      } catch (error) {
        console.error('Error fetching food listings:', error);
      }
    };

    const fetchHostName = async () => {
      try {
        console.log('Fetching host name...');
        const response = await server.get('/listings/hostInfo');
        console.log('Host name fetched:', response.data.username);
        setHostName(response.data.username);
      } catch (error) {
        console.error('Error fetching host name:', error);
      }
    }

    const fetchHostFoodRating = async () => {
      try {
        console.log("Fetching host's food rating...");
        const response = await server.get('/listings/hostInfo');
        console.log("Host's food rating fetched:", response.data.foodRating);
        setHostFoodRating(response.data.foodRating);
      } catch (error) {
        console.error("Error fetching host's food rating:", error);
      }
    }
  
    fetchFoodListings();
    fetchHostName();
    fetchHostFoodRating();
  }, []);
  return (
    <div>
      <Heading as={"h1"}>Food Listings</Heading>
      {<FoodListings foodListings={foodListings} hostName={hostName} hostFoodRating={hostFoodRating} />}
    </div>
  )
}