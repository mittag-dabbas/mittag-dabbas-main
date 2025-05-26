import { LOYALTY, MENU } from '@/lib/constants';
import { Alert, Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { fetchDabbaPoints } from '@/store/slices/dabba-points-slice';

type Props = {};

const Rewards = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useAppDispatch();
	const { dabbaPoints, status } = useAppSelector(state => state.dabbaPoints);
	const user = useAppSelector(state => state.auth.user);

	useEffect(() => {
		if (user?.uid) {
			dispatch(fetchDabbaPoints(user.uid));
		}
	}, [dispatch, user?.uid]);

	return (
		<>
			<Box
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					p: 2
				}}
			>
				<Typography variant='h6'>Rewards</Typography>
				<Typography variant='body2'>Check out all of the rewards that are available to you.</Typography>
			</Box>
			<Box
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					p: 2,
					my: 2
				}}
			>
				<Stack
					direction={'row'}
					alignItems={'center'}
					justifyContent={'center'}
					spacing={2}
				>
					<Image
						src='/assets/icons/loyalty-bowl.svg'
						alt='Rewards'
						width={100}
						height={100}
					/>
					<Typography
						variant='h6'
						fontSize={48}
					>
						{dabbaPoints}
					</Typography>
				</Stack>

				<Box
					sx={{
						mt: 2
					}}
				>
					<Typography
						variant='h6'
						fontSize={20}
						align='center'
					>
						Total Dabba points earned
					</Typography>
					<Typography
						variant='body1'
						align='center'
					>
						Your Dabba points expire on 26/02/2025
					</Typography>
				</Box>
				<Box
					sx={{
						mt: 2
					}}
				>
					<Button
						onClick={() => router.push(LOYALTY)}
						sx={{
							textDecoration: 'underline'
						}}
					>
						LEARN HOW TO EARN MORE DABBA POINTS
					</Button>
				</Box>
			</Box>
			<Box
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					p: 2
				}}
			>
				<Stack
					direction={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					spacing={2}
				>
					<Box>
						<Stack
							direction='row'
							spacing={1}
							alignItems='center'
							justifyContent='space-between'
							sx={{
								flexWrap: 'wrap'
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flexWrap: 'wrap'
								}}
							>
								<Typography
									variant='h6'
									sx={{
										fontSize: isMobile ? '16px' : 'inherit',
										display: 'flex',
										alignItems: 'center',
										mr: 1
									}}
								>
									Flexible reward
								</Typography>
								<Alert
									severity='success'
									icon={
										<Image
											src='/assets/icons/tick.svg'
											alt='Checkmark'
											width={16}
											height={16}
										/>
									}
									sx={{
										color: theme.palette.success.dark,
										border: `1px solid ${theme.palette.success.dark}`,
										borderRadius: theme.shape.borderRadius,
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										height: '24px',
										padding: '0 8px',
										fontSize: '12px'
									}}
								>
									<Typography
										variant='subtitle2'
										sx={{ fontWeight: 500 }}
									>
										Redeem at checkout
									</Typography>
								</Alert>
							</Box>
						</Stack>
						<Typography
							variant='body2'
							sx={{
								mt: 1,
								fontSize: isMobile ? '14px' : 'inherit',
								color: theme.palette.text.secondary
							}}
						>
							Redeem 99 Dabba points for a €9.90 discount on your order
						</Typography>
					</Box>

					{!isMobile && (
						<Button
							variant='outlined'
							onClick={() => router.push(MENU)}
						>
							Start Browsing
						</Button>
					)}
				</Stack>
			</Box>
			{isMobile && (
				// drawer from bottom for mobile
				<Box
					sx={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						right: 0,
						p: 2,
						backgroundColor: theme.palette.background.default,
						borderTop: `1px solid ${theme.palette.divider}`,
						borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
						boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.1)' // shadow on border top
					}}
				>
					<Button
						variant='outlined'
						fullWidth
						onClick={() => router.push(MENU)}
					>
						Start Browsing
					</Button>
				</Box>
			)}
		</>
	);
};

export default Rewards;
