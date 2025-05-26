'use client';

import { Box, CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';

const SignInForm = dynamic(() => import('./_components/sign-up-form'), {
	loading: () => <CircularProgress />
});

type Props = {};

const SignUp = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Box>
			<Grid container>
				{/* Sign form (left side) */}
				<Grid
					item
					xs={12}
					sm={8}
					md={6}
					lg={6}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'center'}
					sx={{
						my: isMobile ? 3 : 0
					}}
				>
					<SignInForm />
				</Grid>

				{/* Image (right side) */}
				<Grid
					item
					xs={12}
					sm={12} // Increased from 6 to 8 for larger screens
					md={12}
					lg={6}
				>
					<Image
						src={'/assets/images/auth-image.png'}
						alt={'Sign in image'}
						width={isMobile ? 400 : 750}
						height={isMobile ? 460 : 740}
						style={{
							width: '100%',
							height: 'auto',
							objectFit: 'cover'
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SignUp;
