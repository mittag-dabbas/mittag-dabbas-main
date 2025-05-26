import { Testimonial } from '@/types';
import { Card, Box, Avatar, Typography, Rating, CardContent, Stack } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type Props = {
	testimonial: Testimonial;
};

const TestimonialCard = (props: Props) => {
	return (
		<Card
			sx={{ maxWidth: 400, p: 2, bgcolor: 'background.bg4' }}
			elevation={0}
		>
			<Box
				display='flex'
				alignItems='center'
				mb={2}
			>
				<Avatar
					alt={
						props.testimonial.attributes.Name && props.testimonial.attributes
							? props.testimonial.attributes.Name
							: ''
					}
					src={
						props.testimonial.attributes.ProfilePicture && props.testimonial.attributes.ProfilePicture.data
							? props.testimonial.attributes.ProfilePicture.data?.attributes?.formats?.medium?.url
							: ''
					}
					sx={{ width: 56, height: 56, mr: 2 }}
				/>
				<Box>
					<Typography
						variant='h6'
						fontWeight='bold'
					>
						{props.testimonial.attributes.Name}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
					>
						{props.testimonial.attributes.City}, {props.testimonial.attributes.Country}
					</Typography>
				</Box>
				<Box
					ml='auto'
					display='flex'
					alignItems='center'
				>
					<Image
						src='/assets/icons/star.svg'
						alt='star'
						width={20}
						height={20}
					/>
					<Typography
						variant='body2'
						ml={1}
					>
						{props.testimonial.attributes.Rating}
					</Typography>
				</Box>
			</Box>
			<CardContent sx={{ p: 0 }}>
				<Typography
					variant='body2'
					color='text.secondary'
				>
					{props.testimonial.attributes.Description}
				</Typography>
			</CardContent>

			<Stack
				direction='row'
				justifyContent='flex-end'
				alignItems='center'
				mt={2}
			>
				<Image
					src='/assets/icons/quotes.svg'
					alt='quote'
					width={48}
					height={36}
				/>
			</Stack>
		</Card>
	);
};

export default TestimonialCard;
