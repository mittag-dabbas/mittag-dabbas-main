import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Heading from './heading';

interface FeatureItem {
	icon: string;
	content: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	textAlign: 'center',
	height: '100%',
	backgroundColor: 'transparent',
	boxShadow: 'none'
}));

const featuresList: FeatureItem[] = [
	{
		icon: '/assets/icons/feature-2.svg',
		content: 'The ultimate platform for ordering delicious food straight to your office.'
	},
	{
		icon: '/assets/icons/feature-1.svg',
		content: 'Explore a curated selection of top local vendors, all hand-picked for quality.'
	},
	{
		icon: '/assets/icons/feature-3.svg',
		content: 'Enjoy seamless office food delivery powered by cutting-edge technology.'
	}
];

const Features = () => {
	return (
		<Box
			component='section'
			sx={{
				mb: 3
			}}
		>
			<Container maxWidth='lg'>
				<Box mb={2}>
					<Heading
						caption='Why Mittag Dabbas'
						captionAlign='center'
						title='Where the flavour inebriates you'
						titleAlign='center'
					/>
				</Box>

				<Typography
					variant='body1'
					color='text.secondary'
					textAlign='center'
					sx={{
						maxWidth: '800px',
						mx: 'auto',
						mb: 8
					}}
				>
					Elevate employee satisfaction with Mittag-Dabbas' corporate lunch delivery service, offering freshly
					prepared, sustainable meals that cater to diverse dietary preferences. Launched in 2024 by the team
					behind Berlin's renowned Tandoori Nächte restaurant, Mittag-Dabbas brings authentic global flavors
					directly to your workplace, ensuring a delightful dining experience that promotes well-being and
					productivity.
				</Typography>

				<Grid
					container
					spacing={4}
				>
					{featuresList.map((feature, index) => (
						<Grid
							item
							xs={12}
							md={4}
							key={index}
						>
							<StyledPaper>
								<Box
									sx={{
										width: 64,
										height: 64,
										mb: 2,
										position: 'relative'
									}}
								>
									<Image
										src={feature.icon}
										alt={feature.content}
										fill
										style={{ objectFit: 'contain' }}
									/>
								</Box>
								<Typography variant='body1'>{feature.content}</Typography>
							</StyledPaper>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Features;
