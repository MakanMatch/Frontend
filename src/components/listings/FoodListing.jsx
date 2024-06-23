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

const FoodListing = ({
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
          src={images || "public/placeholderImage.png"}
          alt="Food listing image"
          borderRadius="lg"
          minWidth={"100%"}
          minHeight={"108px"}
          maxHeight={"108px"}
          objectFit="cover"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>Hosted by {hostName}</Text>
          <Text>Food Rating: {hostFoodRating}/5 ⭐️</Text>
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

export default FoodListing;
