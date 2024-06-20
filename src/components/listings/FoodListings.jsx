/* eslint-disable react/prop-types */
import { Button } from "@chakra-ui/react";

const FoodListings = ({ title, hostName, portionPrice, hostFoodRating, isFavourite, onToggleFavourite }) => {
  return (
    <div style={{ width: 'calc(33.33% - 16px)' }}>
      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px' }}>
        <h3>{title}</h3>
        <h2>Host: {hostName}</h2>
        <div>Price: ${portionPrice}</div>
        <h2>Rating: {hostFoodRating}</h2>
        <Button onClick={onToggleFavourite}>
          {isFavourite ? "🩷" : "🤍"}
        </Button>
      </div>
    </div>
  );
};

export default FoodListings;
