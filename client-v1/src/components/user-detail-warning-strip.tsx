import { ACCOUNT, PROFILE } from '@/lib/constants';
import { useAppSelector } from '@/store/store';
import { CustomerDetails } from '@/types';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const UserDetailWarningStrip = () => {
	const theme = useTheme();
	const user = useAppSelector(state => state.auth.user);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [existingUserDetails, setExistingUserDetails] = useState<CustomerDetails | null>(null);
	const [showWarning, setShowWarning] = useState(false);

	useEffect(() => {
		if (user) {
			getUserDetails();
		}
	}, [user]);

	const getUserDetails = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${user.uid}&populate=*`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch user details');
			}

			const data = await response.json();

			if (data?.data?.length > 0) {
				setExistingUserDetails(data.data[0]);

				if (
					!data.data[0].attributes.FirstName ||
					!data.data[0].attributes.LastName ||
					!data.data[0].attributes.PhoneNumber
				) {
					setShowWarning(true);
				}
			}
		} catch (error) {
			console.log('Error fetching user details in userWarningStripe: ', error);
		}
	};

	return (
		showWarning && (
			<Box
				sx={{
					height: 'auto',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: theme.palette.primary.main
				}}
			>
				<Typography
					variant={isMobile ? 'subtitle1' : 'h5'}
					color={theme.palette.error.main}
					sx={{
						textAlign: 'center',
						paddingX: isMobile ? '10px' : '20px',
						paddingY: isMobile ? '5px' : '10px'
					}}
				>
					{`Please complete your profile to continue... `}
					<Link
						href={`${PROFILE}?tab=${ACCOUNT}`}
						style={{ color: theme.palette.error.main, textDecoration: 'underline', marginLeft: '5px' }}
					>
						Click here
					</Link>
				</Typography>
			</Box>
		)
	);
};

export default UserDetailWarningStrip;
