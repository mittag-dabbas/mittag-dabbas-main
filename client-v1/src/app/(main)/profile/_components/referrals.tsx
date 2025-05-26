import { useAppSelector } from '@/store/store';
import { ReferralApiReturnType } from '@/types';
import {
	Box,
	Divider,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';

type Props = {};

const Referrals = (props: Props) => {
	const theme = useTheme();
	const { user } = useAppSelector(state => state.auth);
	const [referralData, setReferralData] = useState<ReferralApiReturnType | null>(null);

	useEffect(() => {
		if (user) {
			getAllReferralDetails();
		}
	}, [user]);

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
			console.error('Error occurred in fetching all referral details', error);
		}
	};

	// Find the referral record where the current user is the referrer
	const myReferralDetails = referralData?.data.find(
		referral => referral.attributes.referrer.data?.attributes.Email === user?.email
	);

	// Find the referral record where the current user is in someone else's referring list
	const referralIUsed = referralData?.data.find(referral =>
		referral.attributes.referring.data.some(ref => ref.attributes.Email === user?.email)
	);

	const myCouponCode = myReferralDetails?.attributes.coupon?.data?.attributes.CouponCode || 'You haven\'t generated your referral link yet!';
	const peopleWhoUsedMyCode = myReferralDetails?.attributes.referring.data || [];
	const maxRedemptions = peopleWhoUsedMyCode.length || 0;

	return (
		<Box
			sx={{
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 3
			}}
		>
			{/* My Referral Code Section */}
			<Box>
				<Typography variant='h6' sx={{ mb: 1 }}>My Referral Code</Typography>
				<Typography variant='body1'>
					My Code: <strong>{myCouponCode}</strong>
				</Typography>
				<Typography variant='body1'>
					Number of People Who Used My Code: <strong>{maxRedemptions}</strong>
				</Typography>
			</Box>

			{/* Referral I Used Section */}
			<Box>
				<Typography variant='h6' sx={{ mb: 1 }}>Referral I Used</Typography>
				{referralIUsed ? (
					<Box>
						<Typography variant='body1'>
							Code Used: <strong>{referralIUsed.attributes.coupon?.data?.attributes.CouponCode}</strong>
						</Typography>
						<Typography variant='body1'>
							Referred By: <strong>
								{referralIUsed.attributes.referrer.data?.attributes.FirstName} {referralIUsed.attributes.referrer.data?.attributes.LastName}
							</strong>
						</Typography>
						<Typography variant='body1'>
							From Company: <strong>{referralIUsed.attributes.referrer.data?.attributes.CompanyName || 'N/A'}</strong>
						</Typography>
					</Box>
				) : (
					<Typography variant='body1' color='textSecondary'>
						You haven't used anyone's referral code yet.
					</Typography>
				)}
			</Box>

			{/* People Who Used My Code Section */}
			<Box>
				<Typography variant='h6' sx={{ mb: 1 }}>People Who Used My Code</Typography>
				{peopleWhoUsedMyCode.length > 0 ? (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Company</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{peopleWhoUsedMyCode.map(person => (
									<TableRow key={person.id}>
										<TableCell>
											{person.attributes.FirstName} {person.attributes.LastName}
										</TableCell>
										<TableCell>{person.attributes.Email}</TableCell>
										<TableCell>{person.attributes.CompanyName || 'N/A'}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Typography variant='body1' color='textSecondary'>
						No one has used your referral code yet.
					</Typography>
				)}
			</Box>

			<Typography
				variant='subtitle2'
				color='textSecondary'
				sx={{ mt: 1 }}
			>
				Note: Share your referral code with friends and colleagues. When they sign up using your code,
				both you and they will receive bonus points!
			</Typography>
		</Box>
	);
};

export default Referrals;
