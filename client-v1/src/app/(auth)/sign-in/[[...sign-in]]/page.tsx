'use client';

import { Box, CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const SignInForm = dynamic(() => import('./_components/sign-in-form'), {
	loading: () => <CircularProgress />
});

type Props = {};

const SignIn = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

	return (
		<Box>
			<Grid
				container
				spacing={2}
			>
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
					sm={12}
					md={12}
					lg={6}
				>
					<Box
						sx={{
							width: '100%',
							overflow: 'hidden',
							display: 'flex',
							justifyContent: 'center'
						}}
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
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SignIn;
