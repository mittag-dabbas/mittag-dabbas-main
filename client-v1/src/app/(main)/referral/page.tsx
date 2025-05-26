'use client';

import { ACCOUNT, PROFILE, REFERRALS, SIGN_IN, SIGN_UP } from '@/lib/constants';
import { useAppSelector } from '@/store/store';
import { CustomerDetails, ReferralApiReturnType, ReferralData } from '@/types';
import {
	Box,
	Button,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Referral = () => {
	const theme = useTheme();
	const searchParams = useSearchParams();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { user } = useAppSelector(state => state.auth);
	const [isProcessing, setIsProcessing] = useState(false);
	const [referralProcessed, setReferralProcessed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [referralData, setReferralData] = useState<ReferralApiReturnType | null>(null);

	const referralCode = searchParams.get('ref');
	const isUserNew = searchParams.get('isUserNew');

	useEffect(() => {
		if (user) {
			getAllReferralDetails();
		}
	}, []);

	useEffect(() => {
		if (user && referralCode && !referralProcessed && isUserNew) {
			processReferral();
		}
	}, [user, referralCode]);

	const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`API call failed: ${response.statusText}`);
			}
			return await response.json();
		} catch (error) {
			console.error('API call error:', error);
			throw error;
		}
	};

	const getUserDetails = async (uid: string): Promise<CustomerDetails | null> => {
		const url = `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers`;
		const params = `?filters[UiD][$eq]=${uid}&populate=*`;

		try {
			const response = await fetchWithErrorHandling(`${url}${params}`);
			return response.data?.[0] || null;
		} catch (error) {
			setError('Failed to fetch user details');
			return null;
		}
	};

	const getReferralDetails = async (referralCode: string): Promise<ReferralData | null> => {
		const url = `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals`;
		const params = `?filters[referrer][UiD][$eq]=${referralCode}&populate=*`;

		try {
			const response = await fetchWithErrorHandling(`${url}${params}`);
			return response.data?.[0] || null;
		} catch (error) {
			setError('Failed to fetch referral details');
			return null;
		}
	};

	const processReferral = async () => {
		if (!user?.uid || !referralCode || isProcessing) {
			return;
		}

		setIsProcessing(true);
		setError(null);

		try {
			// Get current user details
			const currentUser = await getUserDetails(user.uid);
			if (!currentUser) {
				throw new Error('Current user details not found');
			}

			// Get referral details
			const referral = await getReferralDetails(referralCode);
			if (!referral) {
				throw new Error('Invalid referral code');
			}

			// Check if user has already been referred
			const alreadyReferred = referral.attributes.referring.data?.some(ref => ref.attributes.UiD === user.uid);

			if (alreadyReferred) {
				setReferralProcessed(true);
				return;
			}

			// Check if user is trying to refer themselves
			if (referral.attributes.referrer.data.attributes.UiD === user.uid) {
				setError('You cannot refer yourself');
				throw new Error('You cannot refer yourself');
			}

			// Update referral with new referring user
			const existingReferring = referral.attributes.referring.data?.map(ref => ref.id) || [];
			const updatedReferring = [...existingReferring, currentUser.id];

			const payload = {
				data: {
					referring: {
						connect: updatedReferring
					}
				}
			};

			await fetchWithErrorHandling(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals/${referral.id}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				}
			);

			setReferralProcessed(true);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Failed to process referral');
		} finally {
			setIsProcessing(false);
		}
	};

	const getAllReferralDetails = async () => {
		if (!user) {
			return;
		}
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals?populate=*`
			);

			const data = await response.json();
			setReferralData(data);
		} catch (error) {
			console.error('Error occured in fetching all referral detals', error);
		}
	};

	if (!user) {
		return (
			<Container>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
						minHeight: '60vh'
					}}
				>
					<Typography
						variant='h6'
						color='text.secondary'
					>
						Kindly sign up to redeem your referral rewards
					</Typography>
					<Button
						variant='contained'
						color='primary'
						href={
							referralCode
								? `${new URL(SIGN_UP, window.location.origin)}?redirect=${encodeURIComponent(window.location.href)}&ref=${encodeURIComponent(referralCode)}`
								: `${new URL(SIGN_UP, window.location.origin)}?redirect=${encodeURIComponent(window.location.href)}`
						}
					>
						Sign up
					</Button>
				</Box>
			</Container>
		);
	}

	if (!isUserNew) {
		return (
			<Container>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
						minHeight: '60vh'
					}}
				>
					<Typography
						variant='h6'
						color='text.secondary'
					>
						You are already a registered user. Hence you cannot redeem the referral rewards.
					</Typography>

					<Button
						variant='contained'
						color='primary'
						href={`${PROFILE}?tab=${REFERRALS}`}
					>
						View Referrals
					</Button>
				</Box>
			</Container>
		);
	}

	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 2,
					py: 4,
					minHeight: '100vh'
				}}
			>
				{isProcessing && <Typography>Processing your referral...</Typography>}

				{error && <Typography color='error'>{error}</Typography>}

				{referralProcessed && (
					<Typography color='success.main'>
						Referral processed successfully!
						<Button
							variant='contained'
							color='primary'
							href={`${PROFILE}?tab=${REFERRALS}`}
						>
							View Referrals
						</Button>
					</Typography>
				)}

				{!referralCode && (
					<>
						<Typography>
							No referral code provided. Please ensure you have the correct referral link.
						</Typography>
						<Button
							variant='contained'
							color='primary'
							href={`${PROFILE}?tab=${REFERRALS}`}
						>
							View Referrals
						</Button>
					</>
				)}
			</Box>
		</Container>
	);
};

export default Referral;
