import React, { useState, useEffect } from 'react';
import {Button, Box, Input, Flex, Text, Image, Textarea, Spacer, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormHelperText, Card
} from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import StarRating from './StarRatings';
import server from '../../networking';
import configureShowToast from '../../components/showToast';

const EditReview = ({
	reviewID,
	reviewFoodRating,
	reviewHygieneRating,
	reviewComments,
	reviewImages
}) => {
	const toast = useToast();
	const showToast = configureShowToast(toast);
	const [foodRating, setFoodRating] = useState(reviewFoodRating);
	const [hygieneRating, setHygieneRating] = useState(reviewHygieneRating);
	const [comments, setComments] = useState(reviewComments);
	const [images, setImages] = useState(reviewImages || []);
	const [fileFormatError, setFileFormatError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		setFoodRating(reviewFoodRating);
		setHygieneRating(reviewHygieneRating);
		setComments(reviewComments);
		if (typeof reviewImages != []) {
			let imagesList = []
			for (const image of reviewImages) {
				if (image instanceof File) {
					imagesList.push(image);
				} else {
					imagesList.push(getImageName(image));
				}
			}
			setImages(imagesList);
		} else {
			setImages(reviewImages || []);
		}
	}, [reviewFoodRating, reviewHygieneRating, reviewComments, reviewImages]);

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		if (images.length + files.length > 6) {
            setFileFormatError("You can upload a maximum of 6 images.");
            return;
        }
		let filesAccepted = false;
		for (const file of files) {
			const allowedTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/svg+xml",
				"image/heic"
			];
			if (allowedTypes.includes(file.type)) {
				filesAccepted = true;
			} else {
				filesAccepted = false;
				break;
			}
		}
		if (filesAccepted) {
			setImages((prevImages) => [...prevImages, ...files]);
			setFileFormatError("");
		} else {
			setFileFormatError("Invalid file format. Only JPEG, JPG, PNG, and SVG are allowed.");
		}
	};

	const handleRemoveImage = (index) => {
		setImages((prevImages) => prevImages.filter((image, imageIndex) => imageIndex !== index));
	};

	const handleEdit = async () => {
		setIsSubmitting(true);
		const formData = new FormData();
		formData.append('reviewID', reviewID);
		formData.append('foodRating', foodRating);
		formData.append('hygieneRating', hygieneRating);
		formData.append('comments', comments);
		images.forEach((file) => {
            formData.append('images', file);
        });

		try {
			const editReview = await server.put(`/manageReviews`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				transformRequest: formData => formData
			});
			if (editReview.status === 200) {
				showToast("Review edited successfully", "", 3000, true, "success");
				setIsSubmitting(false);
				window.location.reload();
				onClose();
			} else {
				showToast("Failed to edit review", "Please try again later", 3000, true, "error");
			}
		} catch (error) {
			setIsSubmitting(false);
			showToast("Failed to edit review", "Please try again later", 3000, true, "error");
			console.log('Failed to edit review:', error);
		}
	};

	const handleClose = () => {
		setFoodRating(reviewFoodRating);
		setHygieneRating(reviewHygieneRating);
		setComments(reviewComments);
		if (typeof reviewImages != []) {
			let imagesList = []
			for (const image of reviewImages) {
				if (image instanceof File) {
					imagesList.push(image);
				} else {
					imagesList.push(getImageName(image));
				}
			}
			setImages(imagesList);
		} else {
			setImages(reviewImages || []);
		}
		onClose();
	};

	const getImageName = (imagePath) => {
		if (!imagePath) {
			return "";
		} else {
			const parts = imagePath.split('&imageName=');
			return parts[1] || imagePath;
		}
	};

	return (
		<Box>
			<Button onClick={onOpen} variant={"MMPrimary"}><EditIcon /></Button>
			<Modal isOpen={isOpen} onClose={handleClose} motionPreset='slideInBottom' isCentered size="lg" scrollBehavior="inside">
				<ModalOverlay />
				<ModalContent overflow="hidden" maxH="90vh">
					<ModalHeader>Edit Your Review</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex direction='column' align="center" mb={4}>
							<Image
								borderRadius='full'
								boxSize='100px'
								src='https://bit.ly/dan-abramov'
								alt='Reviewer'
							/>
							<Text fontSize={{ base: '2xl', md: '3xl' }} textAlign='center' mt={{ base: 2, md: 0 }} ml={{ base: 0, md: 4 }}>
								Edit Your Review
							</Text>
						</Flex>
						<FormControl>
							<Flex direction={{ base: 'column', md: 'row' }} align="center">
								<Flex direction='column'>
									<Text mt='8px' mb='8px' textAlign={{ base: 'center', md: 'left' }}>Food Rating</Text>
									<StarRating maxStars={5} propRating={foodRating} onChange={setFoodRating} />
								</Flex>
								<Spacer display={{ base: 'none', md: 'block' }} />
								<Flex direction='column'>
									<Text mt="8px" mb="8px" textAlign={{ base: 'center', md: 'left' }}>Hygiene Rating</Text>
									<StarRating maxStars={5} propRating={hygieneRating} onChange={setHygieneRating} />
								</Flex>
							</Flex>
							<Text mt='16px' mb='8px' textAlign={{ base: 'center', md: 'left' }}>Comments</Text>
							<Textarea
								placeholder='Write something about the experience...'
								size='sm'
								resize='none'
								value={comments}
								onChange={(e) => setComments(e.target.value)}
							/>
							<Text mt='16px' mb='8px' textAlign={{ base: 'center', md: 'left' }}>Upload New Images</Text>
							<Input
								pt={1}
								type="file"
								size="md"
								onChange={handleFileChange}
								multiple
							/>
							{fileFormatError && (
								<FormHelperText color="red">
									{fileFormatError}
								</FormHelperText>
							)}
							{images && images.length > 0 && (
								<Box mt={2}>
									<Text>Selected images:</Text>
									{images.map((image, index) => (
										<Card key={index} mb={2} padding={"13px"} display="flex" flexDirection="row" justifyContent="space-between">
											<Text fontSize={"15px"} color={"green"} mt={2}>
												{image instanceof File ? image.name : getImageName(image)}
											</Text>
											<Button onClick={() => handleRemoveImage(index)}>
												<CloseIcon boxSize={3} />
											</Button>
										</Card>
									))}
								</Box>
							)}
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='red' borderRadius='10px' mr={3} onClick={handleClose}>
							Close
						</Button>
						{isSubmitting ? (
							<Button
								isLoading
								loadingText="Submitting..."
								borderRadius={"10px"}
							>
								Submitting...
							</Button>
						) : (
							<Button
								onClick={handleEdit}
								variant="MMPrimary"
							>
								Save
							</Button>
						)}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export default EditReview;
