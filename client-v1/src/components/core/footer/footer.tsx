'use client';

import React from 'react';
import { Box, Container, Typography, Link, Stack, useMediaQuery, useTheme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant'; // Import an icon for the logo
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { FACEBOOK, INSTAGRAM, LINKEDIN } from '@/lib/constants';
import { LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
	const theme = useTheme();
	const { formatMessage } = useIntl();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

	return (
		<Box sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.background.default, py: 5 }}>
			<Container>
				<Stack
					direction={isMobile ? 'column' : 'row'}
					spacing={isMobile || isTablet ? 4 : 4}
					justifyContent={'space-between'}
				>
					{/* Section 1: Icon, Copyright, and Social Links */}
					<Stack
						flex={1.1}
						spacing={2}
						alignItems='flex-start'
					>
						<Image
							src='/assets/icons/logo-white.svg'
							alt='Mittag-Dabbas Logo'
							width={200}
							height={50}
							style={
								{
									// backgroundColor: theme.palette.background.default,
								}
							}
						/>

						<Stack
							direction='row'
							spacing={1}
						>
							<Typography variant='body1'>{formatMessage({ id: 'footer.social.media' })}</Typography>
							<Box>
								<Link
									href={FACEBOOK}
									color='inherit'
									sx={{ mx: 1 }}
									target='_blank'
								>
									<Image
										src='/assets/icons/fb.svg'
										alt='Facebook'
										width={20}
										height={20}
									/>
								</Link>
								<Link
									href={INSTAGRAM}
									color='inherit'
									sx={{ mx: 1 }}
									target='_blank'
								>
									<Image
										src='/assets/icons/instagram.svg'
										alt='Instagram'
										width={20}
										height={20}
									/>
								</Link>
								<Link
									href={LINKEDIN}
									color='inherit'
									sx={{ mx: 1, mt: 3 }}
									target='_blank'
								>
									<LinkedIn fontSize={'medium'} />
								</Link>
							</Box>
						</Stack>
					</Stack>

					{/* Section 2: About and Services */}
					<Stack
						flex={1}
						direction={'column'}
						spacing={2}
					>
						<Stack
							// flex={1}
							spacing={1}
						>
							<Typography variant='h6'>{formatMessage({ id: 'footer.about.title' })}</Typography>
							<Link
								href='#about-us'
								color='inherit'
								underline='hover'
							>
								<Typography variant='body2'>{formatMessage({ id: 'footer.about.us' })}</Typography>
							</Link>
						</Stack>
						<Stack
							// flex={1}
							spacing={1}
						>
							<Typography
								variant='h6'
								sx={{ mt: 2 }}
							>
								{formatMessage({ id: 'footer.services.title' })}
							</Typography>
							<Link
								href='#'
								color='inherit'
								underline='hover'
							>
								<Typography variant='body2'>
									{formatMessage({ id: 'footer.services.service1' })}
								</Typography>
							</Link>
							<Link
								href='#'
								color='inherit'
								underline='hover'
							>
								<Typography variant='body2'>
									{formatMessage({ id: 'footer.services.service2' })}
								</Typography>
							</Link>
						</Stack>
					</Stack>

					{/* Section 3: Timings */}
					<Stack
						flex={1}
						spacing={2}
					>
						<Typography variant='h6'>{formatMessage({ id: 'footer.timings.title' })}</Typography>
						<Typography variant='body2'>
							{formatMessage({ id: 'footer.timings.service1' })}
							<br />
							{formatMessage({ id: 'footer.timings.service2' })}
							<br />
							<strong>{formatMessage({ id: 'footer.service12.timing' })}</strong>
						</Typography>

						<Typography variant='body2'>
							{formatMessage({ id: 'footer.timings.service3' })}
							<br />
							<strong>{formatMessage({ id: 'footer.service3.timing' })}</strong>
						</Typography>
					</Stack>

					{/* Section 4: Support */}
					<Stack
						flex={1}
						spacing={2}
					>
						<Typography variant='h6'>{formatMessage({ id: 'footer.support.title' })}</Typography>
						<Link
							href='https://lieferservice-tandoorinachte.de/imprint'
							target='_black'
							color='inherit'
							underline='hover'
						>
							<Typography variant='body2'>{formatMessage({ id: 'footer.support.imprint' })}</Typography>
						</Link>
						<Link
							href='https://lieferservice-tandoorinachte.de/terms-of-use'
							target='_black'
							color='inherit'
							underline='hover'
						>
							<Typography variant='body2'>
								{formatMessage({ id: 'footer.support.terms.and.conditions' })}
							</Typography>
						</Link>
						<Link
							href='https://lieferservice-tandoorinachte.de/privacy-promise'
							target='_black'
							color='inherit'
							underline='hover'
						>
							<Typography variant='body2'>
								{formatMessage({ id: 'footer.support.privacy.policy' })}
							</Typography>
						</Link>
						<Link
							href='https://lieferservice-tandoorinachte.de/cookie-policy'
							target='_black'
							color='inherit'
							underline='hover'
						>
							<Typography variant='body2'>
								{formatMessage({ id: 'footer.support.cookies.policy' })}
							</Typography>
						</Link>
					</Stack>

					{/* Section 5: Connect Us and Delivery Location */}
					<Stack
						flex={1}
						spacing={2}
					>
						<Typography variant='h6'>{formatMessage({ id: 'footer.connect.us' })}</Typography>

						{/* Email Section */}
						<Stack
							direction='row'
							alignItems='center'
							spacing={1}
						>
							<Image
								src='/assets/icons/email.svg'
								alt='Email'
								width={20}
								height={20}
							/>
							<Link
								href='mailto:mittagdabbas@tandoori-naechte.com'
								color='inherit'
								sx={{ textDecoration: 'none' }}
							>
								<Typography variant='body2'>
									{formatMessage({ id: 'footer.connect.us.email' })}
								</Typography>
							</Link>
						</Stack>

						{/* Phone Section */}
						<Stack
							direction='row'
							alignItems='center'
							spacing={1}
						>
							<Image
								src='/assets/icons/phone.svg'
								alt='Phone'
								width={20}
								height={20}
							/>
							<Link
								href='tel:+917891569584'
								color='inherit'
								sx={{ textDecoration: 'none' }}
							>
								<Typography variant='body2'>
									{formatMessage({ id: 'footer.connect.us.phone' })}
								</Typography>
							</Link>
						</Stack>

						<Typography
							variant='h6'
							sx={{ mt: 2 }}
						>
							{formatMessage({ id: 'footer.delivery.location.title' })}
						</Typography>
						<Typography variant='body2'>
							{formatMessage({ id: 'footer.delivery.location.location1' })}
						</Typography>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
};

export default Footer;
