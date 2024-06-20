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
  images,
}) => {
  return (
    <>
      <Card maxW="sm">
      <CardBody>
        <Image
          src={images}
          alt="Food listing image"
          borderRadius="lg"
          minWidth={"100%"}
          maxHeight={"108px"}
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
