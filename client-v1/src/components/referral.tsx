import {
	Box,
	Container,
	Grid,
	Typography,
	Button,
	TextField,
	IconButton,
	useMediaQuery,
	useTheme,
	Tooltip,
	Divider,
	Stack,
	Link
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Facebook, WhatsApp, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import Heading from './heading';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import axios from 'axios'; // Import Axios for API requests
import moment from 'moment';
import { CustomerDetails, ReferralApiReturnType, ReferralData } from '@/types';

const Referral = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [referralLink, setReferralLink] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [allReferrals, setAllReferrals] = useState<ReferralApiReturnType>();
	const [existingUserDetails, setExistingUserDetails] = useState<CustomerDetails | null>(null);

	const { user } = useAppSelector(state => state.auth);
	const router = useRouter();
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (user) {
			getAllReferrals();
			getExistingUserDetails();
		}
	}, []);

	const getExistingUserDetails = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${user.uid}&populate=*`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch user details');
			}

			const data = await response.json();
			if (data?.data?.length > 0) {
				setExistingUserDetails(data.data[0]);
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	};

	const getAllReferrals = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals${process.env.NEXT_PUBLIC_STRAPI_FETCH_ALL_DATA_FLAG_QUERY}`
			);
			setAllReferrals(response.data);

			const referral = response.data?.data.find(
				(data: ReferralData) => data?.attributes?.referrer?.data?.attributes?.UiD === user?.uid
			);
			if (referral) {
				const generatedLink = `${window.location.origin}/referral?ref=${user.uid}`;
				setReferralLink(generatedLink);
			}
		} catch (error) {
			console.error('Error fetching all referrals:', error);
		}
	};

	const handleGenerateLink = async () => {
		if (!user || !user.uid || referralLink) return;

		try {
			setIsGenerating(true);

			const generatedLink = `${window.location.origin}/referral?ref=${user.uid}`;

			const generatedCoupon = await generateCoupon();

			const payload = {
				data: {
					referrer: existingUserDetails?.id,
					coupon: generatedCoupon?.id
				}
			};

			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				setReferralLink(generatedLink);
			}
		} catch (error) {
			console.error('Error generating referral link:', error);
		} finally {
			setIsGenerating(false);
		}
	};

	const generateCoupon = async () => {
		try {
			const lastFiveChars = user.uid.slice(-5);
			const payload = {
				data: {
					Expiry: moment().add(1, 'year').toISOString(),
					CouponCode: `REFERRAL-${lastFiveChars}`,
					TypeOfCoupon: [
						{
							__component: 'shared.discount-percentage',
							Discount: 50
						}
					]
				}
			};

			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/coupons`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error('Error generating coupon');
			}
			const data = await response.json();

			return data.data;
		} catch (error) {
			console.error('Error generating coupon:', error);
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(referralLink);
		setTooltipOpen(true);

		setTimeout(() => {
			setTooltipOpen(false);
		}, 1500); // 1.5 seconds
	};

	// Build the dynamic share URLs based on the generated referral link
	const shareUrls = {
		facebook: referralLink
			? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
			: '',
		whatsapp: referralLink ? `https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}` : '',
		twitter: referralLink ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}` : '',
		linkedin: referralLink
			? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
			: '',
		// Note: Instagram does not support direct URL sharing in the same way.
		// You could either disable it or point to your Instagram page.
		instagram: referralLink ? `https://www.instagram.com/?url=${encodeURIComponent(referralLink)}` : ''
	};

	return (
		<Container sx={{ py: 10 }}>
			<Grid
				container
				spacing={2}
				alignItems='center'
				justifyContent='space-between'
			>
				{/* Left Side */}
				<Grid
					item
					xs={12}
					md={6}
				>
					<Heading
						title='Get a 50% discount for each friend you refer'
						caption='Referral Program'
					/>

					<Box sx={{ mt: 2, mb: 1 }}>
						<Typography variant='h6'>Get special perks for you and your Colleagues</Typography>
					</Box>
					<Box>
						<Typography variant='body1'>
							1. Give your friends a{' '}
							<span style={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>50%</span>{' '}
							discount.
						</Typography>
						<Typography variant='body1'>
							2. Get a <span style={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>50%</span>{' '}
							discount for each friend who places an order.
						</Typography>
					</Box>
				</Grid>

				{/* Right Side */}
				{user ? (
					<Grid
						item
						xs={12}
						md={6}
						sx={{ mt: isMobile ? 3 : 0 }}
					>
						<Box
							sx={{
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: theme.shape.borderRadius,
								backgroundColor: theme.palette.background.default,
								p: 3
							}}
						>
							{/* Generate or Display Referral Link */}
							{referralLink ? (
								<>
									<Typography
										variant='h6'
										sx={{ mb: 2, fontWeight: 500 }}
									>
										Copy your referral link
									</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
										<TextField
											fullWidth
											value={referralLink}
											InputProps={{
												readOnly: true,
												sx: {
													overflow: 'hidden',
													whiteSpace: 'nowrap',
													textOverflow: 'ellipsis'
												}
											}}
											variant='outlined'
											size='small'
										/>
										<Tooltip
											title='Copied to clipboard!'
											open={tooltipOpen}
											disableFocusListener
											disableHoverListener
											disableTouchListener
											arrow
										>
											<Button
												variant='contained'
												color='primary'
												sx={{ ml: 2 }}
												onClick={handleCopy}
											>
												Copy
											</Button>
										</Tooltip>
									</Box>
								</>
							) : (
								<Button
									variant='contained'
									color='primary'
									fullWidth
									onClick={handleGenerateLink}
									disabled={isGenerating}
								>
									{isGenerating ? 'Generating...' : 'Generate Referral Link'}
								</Button>
							)}

							<Divider sx={{ my: 2 }} />

							{/* Social Media Share Icons */}
							<Stack
								direction={'row'}
								alignItems={'center'}
								justifyContent={'space-between'}
								spacing={2}
							>
								<Typography variant='h6'>Share it with anyone</Typography>
								<Box sx={{ display: 'flex', gap: 1 }}>
									{/* If referralLink exists, render clickable icons; otherwise, show disabled icons */}
									{referralLink ? (
										<>
											<Link
												href={shareUrls.facebook}
												color='inherit'
												target='_blank'
											>
												<IconButton color='primary'>
													<Facebook />
												</IconButton>
											</Link>
											<Link
												href={shareUrls.whatsapp}
												color='inherit'
												target='_blank'
											>
												<IconButton color='primary'>
													<WhatsApp />
												</IconButton>
											</Link>
											<Link
												href={shareUrls.twitter}
												color='inherit'
												target='_blank'
											>
												<IconButton color='primary'>
													<Twitter />
												</IconButton>
											</Link>
											<Link
												href={shareUrls.linkedin}
												color='inherit'
												target='_blank'
											>
												<IconButton color='primary'>
													<LinkedIn />
												</IconButton>
											</Link>
											<Link
												href={shareUrls.instagram}
												color='inherit'
												target='_blank'
											>
												<IconButton color='primary'>
													<Instagram />
												</IconButton>
											</Link>
										</>
									) : (
										<>
											<IconButton
												color='primary'
												disabled
											>
												<Facebook />
											</IconButton>
											<IconButton
												color='primary'
												disabled
											>
												<WhatsApp />
											</IconButton>
											<IconButton
												color='primary'
												disabled
											>
												<Twitter />
											</IconButton>
											<IconButton
												color='primary'
												disabled
											>
												<LinkedIn />
											</IconButton>
											<IconButton
												color='primary'
												disabled
											>
												<Instagram />
											</IconButton>
										</>
									)}
								</Box>
							</Stack>
						</Box>
					</Grid>
				) : (
					<Grid marginLeft={2} marginTop={5}>
						<Typography
							variant='h4'
							fontWeight={'bold'}
						>
							Please login to refer
						</Typography>
						<Button
							variant='contained'
							onClick={() => router.push('/sign-in')}
						>
							{formatMessage({ id: 'btn.sign.in' })}
						</Button>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default Referral;
