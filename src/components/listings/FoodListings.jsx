/* eslint-disable react/prop-types */
import { 
  Button,
  Card,
  CardBody, 
  CardFooter,
  ButtonGroup,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

const FoodListings = ({
  title,
  hostName,
  portionPrice,
  hostFoodRating,
  isFavourite,
  onToggleFavourite,
}) => {
  return (
    <>
      <Card maxW="sm">
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" // Placeholder image
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>Hosted by {hostName}</Text>
          <Text>Rating: {hostFoodRating}</Text>
          <Text color="blue.600" fontSize="2xl">
            ${portionPrice}/pax
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="center">
        <ButtonGroup spacing="2">
          <Button variant="MMPrimary">
            View more
          </Button>
          <Button onClick={onToggleFavourite}>
            {isFavourite ? "🩷" : "🤍"}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
    </>
  );
};

export default FoodListings;
