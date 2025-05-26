'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Tabs, Tab, Box, Grid, Typography, Button, Container, Stack, Avatar, useTheme, Divider } from '@mui/material';
import Loading from '@/components/loading';
import { useAppDispatch, useAppSelector } from '@/store/store';
import Image from 'next/image';
import { clearAuth, signOutUser } from '@/store/slices/auth-slice';
import { HOME, PROFILE, profileTabs } from '@/lib/constants';
import { clearCompanyDetails } from '@/store/slices/company-slice';
import { clearCart } from '@/store/slices/cart-slice';
import { clearDabbaPoints } from '@/store/slices/dabba-points-slice';

const Hero = dynamic(() => import('@/components/hero'), {
	loading: () => <Loading />
});

// Tab components
const Account = dynamic(() => import('./_components/account'), {
	loading: () => <Loading />
});

const Orders = dynamic(() => import('./_components/orders'), {
	loading: () => <Loading />
});

const Address = dynamic(() => import('./_components/address'), {
	loading: () => <Loading />
});

const Rewards = dynamic(() => import('./_components/rewards'), {
	loading: () => <Loading />
});

const Referrals = dynamic(() => import('./_components/referrals'), {
	loading: () => <Loading />
});

type Props = {};

const Profile = (props: Props) => {
	const router = useRouter();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);
	const searchParams = useSearchParams();
	const tab = searchParams.get('tab');

	// Updated tabMapping to match the expected URL parameters
	const tabMapping: { [key: string]: number } = {
		account: 0, // For 'account' tab
		orders: 1, // For 'orders' tab
		address: 2, // For 'address' tab
		rewards: 3, // For 'rewards' tab
		referrals: 4 // For 'referrals' tab
	};

	const initialTab = tab && tabMapping[tab as string] !== undefined ? tabMapping[tab as string] : 0;
	const [value, setValue] = useState<number>(initialTab);

	useEffect(() => {
		if (tab && tabMapping[tab as string] !== undefined) {
			setValue(tabMapping[tab as string]);
		}
	}, [tab]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		const tabKeys = Object.keys(tabMapping);
		const newTab = tabKeys[newValue];
		// Push the correct tab query param to the URL
		router.push(`${PROFILE}?tab=${newTab}`);
	};

	const renderContent = () => {
		switch (value) {
			case 0:
				return <Account />;
			case 1:
				return <Orders />;
			case 2:
				return <Address />;
			case 3:
				return <Rewards />;
			case 4:
				return <Referrals />;
			default:
				return <Account />; // Default to account if value is undefined
		}
	};

	const handleLogout = () => {
		dispatch(signOutUser());
		dispatch(clearCompanyDetails());
		dispatch(clearCart());
		dispatch(clearDabbaPoints());
		dispatch(clearAuth());
		router.push(HOME);
	};

	return (
		<Box>
			<Hero
				bannerImage={'/assets/images/profile-hero.png'}
				heroTitle={'My Profile'}
			/>
			<Container
				maxWidth='lg'
				sx={{ my: 6 }}
			>
				<Grid
					container
					spacing={2}
				>
					{/* Left Panel */}
					<Grid
						item
						xs={12}
						sm={3}
					>
						<Box
							sx={{
								border: `1px solid ${theme.palette.divider}`,
								padding: 2,
								borderRadius: theme.shape.borderRadius
							}}
						>
							<Stack
								direction='row'
								alignItems='center'
								gap={1}
								sx={{
									mb: 2
								}}
							>
								<Avatar
									alt={user?.displayName || 'User'}
									src={user?.photoURL || '/'}
									sx={{ width: 48, height: 48 }}
								/>

								<Box>
									<Typography>Hello 👋</Typography>
									<Typography variant='h6'>{user?.displayName}</Typography>
								</Box>
							</Stack>
							<Tabs
								orientation='vertical'
								variant='scrollable'
								value={value}
								onChange={handleChange}
								aria-label='My Account Tabs'
								sx={{ mt: 2, justifyContent: 'flex-start' }}
							>
								{profileTabs.map((tab, index) => (
									<Tab
										key={index}
										label={tab.label}
										icon={
											<Image
												src={tab.icon}
												alt={tab.label.toLowerCase()}
												width={16}
												height={16}
											/>
										}
										iconPosition='start'
										sx={{
											textAlign: 'left',
											justifyContent: 'flex-start',
											paddingLeft: '10px',
											paddingRight: '10px',
											minHeight: '48px',
											borderBottom: `1px solid ${theme.palette.divider}`,
											borderRadius: 0,
											textTransform: 'none'
										}}
									/>
								))}
								<Button
									variant='text'
									color='error'
									disableRipple
									sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
									startIcon={
										<Image
											src='/assets/icons/logout.svg'
											alt='logout'
											width={16}
											height={16}
										/>
									}
									onClick={handleLogout}
								>
									Log out
								</Button>
							</Tabs>
						</Box>
					</Grid>

					{/* Right Panel (Dynamic Content based on tab) */}
					<Grid
						item
						xs={12}
						sm={9}
					>
						<Box>{renderContent()}</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Profile;
