import { ENQUIRY, MENU } from '@/lib/constants';
import theme from '@/theme';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

const HomeBanner = ({ referralRef }: any) => {
	const router = useRouter();

	return (
		<Grid
			container
			spacing={2}
			sx={{ width: '100%' }}
			alignItems='center'
			justifyContent='center'
		>
			{/* Left Component - Lunch Delivery */}
			<Grid
				item
				xs={12}
				lg={7}
			>
				<Box
					sx={{
						position: 'relative',
						width: '100%',
						height: { xs: 'auto', md: '400px' },
						bgcolor: '#073F1F',
						borderRadius: theme.shape.borderRadius,
						overflow: 'hidden',
						display: 'flex',
						p: { xs: 3, md: 4 },
						minHeight: { xs: '400px', md: 'auto' }
					}}
				>
					{/* Content */}
					<Box
						sx={{
							position: 'relative',
							zIndex: 2,
							width: { xs: '100%', md: '60%' },
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'start'
						}}
					>
						<Typography
							variant='h2'
							sx={{
								fontSize: {
									xs: '2em',
									sm: '2.4em',
									md: '2.6em',
									lg: '2.8em'
								},
								lineHeight: 1.2,
								mb: 2,
								color: 'white',
								fontWeight: 'bold'
							}}
						>
							LUNCH, DELIVERED YOUR WAY JUST A CLICK AWAY
						</Typography>
						<Typography
							variant='body1'
							sx={{
								mb: 3,
								color: 'white',
								opacity: 0.9,
								fontSize: { xs: '0.9rem', md: '1rem' }
							}}
						>
							With our daily meal box and corporate catering program, you and your team can enjoy healthy,
							delicious lunches at the office every day.
						</Typography>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							sx={{ width: { xs: '100%', sm: 'auto' } }}
						>
							<Button
								variant='outlined'
								sx={{
									color: 'white',
									borderColor: 'white',
									px: 3,
									'&:hover': {
										borderColor: 'white',
										bgcolor: 'rgba(255, 255, 255, 0.1)'
									}
								}}
								onClick={() => router.push(ENQUIRY)}
							>
								ENQUIRE NOW
							</Button>
							<Button
								variant='contained'
								sx={{
									bgcolor: 'white',
									color: theme.palette.primary.main,
									px: 3,
									'&:hover': {
										bgcolor: 'rgba(255, 255, 255, 0.9)'
									}
								}}
								onClick={() => router.push(MENU)}
							>
								ORDER NOW
							</Button>
						</Stack>
					</Box>

					{/* Image */}
					<Box
						sx={{
							position: 'absolute',
							right: 0,
							top: 0,
							width: '55%',
							height: '100%',
							display: { xs: 'none', md: 'block' }
						}}
					>
						<Box
							component='img'
							src='/assets/images/new-banner-img-1.png'
							alt='Stacked meal boxes'
							sx={{
								width: '100%',
								height: '100%',
								objectFit: 'contain',
								objectPosition: 'center right'
							}}
						/>
					</Box>
				</Box>
			</Grid>

			{/* Right Component - Referral Program */}
			<Grid
				item
				xs={12}
				lg={2.5}
			>
				<Box
					sx={{
						position: 'relative',
						width: '100%',
						height: { xs: 'auto', md: '400px' },
						bgcolor: theme.palette.primary.main,
						borderRadius: theme.shape.borderRadius,
						p: { xs: 3, md: 4 },
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						minHeight: { xs: '300px', md: 'auto' },
						overflow: 'hidden'
					}}
				>
					{/* Content Box */}
					<Box
						sx={{
							position: 'relative',
							zIndex: 2,
							height: '45%'
						}}
					>
						<Typography
							variant='h3'
							sx={{
								color: 'white',
								mb: 2,
								fontSize: { xs: '1.5rem', md: '2rem' },
								fontWeight: 'bold'
							}}
						>
							REFERRAL PROGRAM
						</Typography>
						<Typography
							variant='body1'
							sx={{
								color: 'white',
								mb: 3,
								fontSize: { xs: '0.9rem', md: '1rem' }
							}}
						>
							Get a 50% discount for each friend you refer.
						</Typography>
						<Button
							variant='outlined'
							sx={{
								color: 'white',
								borderColor: 'white',
								px: 3,
								'&:hover': {
									borderColor: 'white',
									bgcolor: 'rgba(255, 255, 255, 0.1)'
								}
							}}
							onClick={() => referralRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
						>
							REFER NOW
						</Button>
					</Box>

					{/* Food Images */}
					<Box
						sx={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							width: '100%',
							height: '54%',
							display: 'block',
							zIndex: 1
						}}
					>
						<Box
							component='img'
							src='/assets/images/new-banner-img-2.png'
							alt='Food'
							sx={{
								width: { xs: '100%', md: '110%' },
								height: { xs: '100%', md: '110%' },
								objectFit: 'contain',
								objectPosition: 'center bottom',
								transform: { xs: 'none', md: 'translateX(-5%)' },
								m: 0
							}}
						/>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default HomeBanner;
