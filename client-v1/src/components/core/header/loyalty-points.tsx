import { LOYALTY_POINTS, PROFILE } from '@/lib/constants';
import { fetchDabbaPoints } from '@/store/slices/dabba-points-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const LoyaltyPoints = () => {
	const theme = useTheme();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const dabbaPoints = useAppSelector(state => state.dabbaPoints.dabbaPoints);
	const user = useAppSelector(state => state.auth.user);
	// fetch the points from the backend
	useEffect(() => {
		dispatch(fetchDabbaPoints(user?.uid));
	}, [user?.uid]);

	return (
		<>
			<Button
				onClick={() => router.push(`${PROFILE}?tab=${LOYALTY_POINTS}`)}
				startIcon={
					<Image
						src='/assets/icons/loyalty-bowl.svg'
						alt='loyalty points'
						width={isMobile ? 20 : 22}
						height={isMobile ? 20 : 22}
					/>
				}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textTransform: 'none',
					border: `2px solid ${theme.palette.divider}`
				}}
			>
				{dabbaPoints}
			</Button>
		</>
	);
};

export default LoyaltyPoints;
