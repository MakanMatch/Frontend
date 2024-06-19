import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import server from '../../networking';

const FoodListings = ({ foodListings }) => {
  const [localFoodListings, setLocalFoodListings] = useState([]);

  useEffect(() => {
    const fetchHostNameAndRating = async () => {
      try {
        console.log('Fetching host info...');
        const response = await server.get('/listings/hostInfo');
        console.log('Host info fetched:', response.data);
        // Enhance each listing with hostName and hostFoodRating
        const enhancedListings = foodListings.map(listing => ({
          ...listing,
          hostName: response.data.username,
          hostFoodRating: response.data.foodRating,
          Favourite: false // Initialize favourite state for each listing
        }));
        setLocalFoodListings(enhancedListings);
      } catch (error) {
        console.error('Error fetching host info:', error);
      }
    };

    fetchHostNameAndRating();
  }, [foodListings]);

  const handleFavourite = (listingID) => {
    setLocalFoodListings(prevListings =>
      prevListings.map(listing =>
        listing.listingID === listingID ? { ...listing, Favourite: !listing.Favourite } : listing
      )
    );
  };

  const handleAddListing = () => {
    console.log('Add Listing Button Clicked');
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {localFoodListings.map(listing => (
          <div key={listing.listingID} style={{ width: 'calc(33.33% - 16px)' }}>
            <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px' }}>
              <h3>{listing.title}</h3>
              <h2>Host: {listing.hostName}</h2>
              <div>Price: ${listing.portionPrice}</div>
              <h2>Rating: {listing.hostFoodRating}</h2>
              <Button onClick={() => handleFavourite(listing.listingID)}>
                {listing.Favourite ? "🩷" : "🤍"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleAddListing} variant={"MMPrimary"}>
          Add Listing
        </Button>
      </div>
    </div>
  );
};

export default FoodListings;
