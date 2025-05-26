'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	AppBar,
	Toolbar,
	Button,
	Menu,
	MenuItem,
	Box,
	useTheme,
	useMediaQuery,
	Drawer,
	Divider,
	Stack,
	IconButton,
	Typography,
	Container,
	Avatar
} from '@mui/material';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { useLocale } from '@/hooks/use-locale';
import Link from 'next/link';
import {
	ACCOUNT,
	ADDRESS,
	CORPORATE_CATERING,
	DAILY_OFFICE_MEAL,
	ENQUIRY,
	FORGOTPASSWORD,
	HOME,
	LOYALTY,
	MENU,
	ORDERS,
	PROFILE,
	REFERRAL,
	REFERRALS,
	RESETPASSWORD,
	SETTINGS,
	SIGN_IN,
	SIGN_UP,
	SUBSCRIPTION,
	navbarProfileMenuItems
} from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import Bag from './bag';
import { clearAuth, signOutUser } from '@/store/slices/auth-slice';
import { NavbarProfileMenuItemsType } from '@/types';
import MobileNavDrawer from './mobile-nav-drawer';
import LoyaltyPoints from './loyalty-points';
import { clearCompanyDetails } from '@/store/slices/company-slice';
import { clearCart } from '@/store/slices/cart-slice';
import { clearDabbaPoints } from '@/store/slices/dabba-points-slice';

interface Props {}

const Navbar = (props: Props) => {
	const theme = useTheme();
	const { formatMessage } = useIntl();
	const { locale, setLocale } = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const query = useSearchParams();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);
	const { totalQuantity, days, deliveryAddress } = useAppSelector(state => state.cart);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
	const [anchorElServices, setAnchorElServices] = React.useState<null | HTMLElement>(null);
	const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
	const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);
	const [selectedLang, setSelectedLang] = React.useState('en');
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const handleServicesClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElServices(event.currentTarget);
		event.stopPropagation(); // Prevent drawer from closing
	};

	const handleLangClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElLang(event.currentTarget);
		event.stopPropagation(); // Prevent drawer from closing
	};

	const handleProfileClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElProfile(event.currentTarget);
		event.stopPropagation(); // Prevent drawer from closing
	};

	const handleLanguageChange = (lang: string): void => {
		setSelectedLang(lang);
		switchLocale(lang);
		setAnchorElLang(null);
	};

	const handleClose = (): void => {
		setAnchorElMenu(null);
		setAnchorElServices(null);
		setAnchorElLang(null);
		setAnchorElProfile(null);
	};

	const switchLocale = (newLocale: string) => {
		setLocale(newLocale);
	};

	const toggleDrawer = () => {
		setDrawerOpen(prevState => !prevState);
	};

	const handleMenuItemClick = (item: NavbarProfileMenuItemsType) => {
		handleClose();

		if (item.actionType === 'logout') {
			dispatch(signOutUser());
			dispatch(clearCompanyDetails());
			dispatch(clearCart());
			dispatch(clearDabbaPoints());
			dispatch(clearAuth());
			router.push(HOME);
		} else if (item.route && item.tab) {
			router.push(`${item.route}?tab=${item.tab}`);
		}
	};

	const getUserDetails = null;

	return (
		<>
			<AppBar
				position='fixed'
				elevation={0}
				sx={{
					backgroundColor: theme.palette.background.default,
					color: theme.palette.text.primary,
					boxShadow: 'none',
					height: '64px'
				}}
			>
				<Container
					sx={{
						'&.MuiContainer-root': {
							padding: isMobile ? '0 16px' : '24 24px',
							paddingLeft: 0 // Padding for mobile screens
						}
					}}
				>
					<Toolbar sx={{ justifyContent: 'space-between' }}>
						<Box
							display='flex'
							alignItems='center'
						>
							{isMobile && (
								<Button
									color='inherit'
									onClick={toggleDrawer}
								>
									<Image
										src='/assets/icons/hamburger-menu-btn.svg'
										alt='Menu'
										width={24}
										height={24}
									/>
								</Button>
							)}
							<Link href={HOME}>
								<Image
									src={isMobile ? '/assets/icons/logo-notext.svg' : '/assets/icons/logo.svg'}
									alt='Mittag-Dabbas'
									width={isMobile ? 35 : 180}
									height={isMobile ? 35 : 45}
								/>
							</Link>
						</Box>
						{isMobile ? (
							<Box
								display='flex'
								alignItems='center'
								gap={2}
							>
								{/* Shopping bag icon to represent number of items */}
								{!(
									pathname === SIGN_IN ||
									pathname === SIGN_UP ||
									pathname === FORGOTPASSWORD ||
									pathname === RESETPASSWORD
								) && (
									<>
										<Link
											href={MENU}
											style={{
												textDecoration: 'none',
												color: 'inherit'
											}}
										>
											<Button color='inherit'>
												{formatMessage({ id: 'header.menu.title' })}
											</Button>
										</Link>
										<Bag cartItemCount={totalQuantity} />
										{user ? (
											<Avatar
												alt={user?.displayName || 'User'}
												src={user?.photoURL || '/'}
												onClick={() => router.push(PROFILE)}
												sx={{
													cursor: 'pointer'
												}}
											/>
										) : (
											<Button
												variant='contained'
												onClick={() =>
													router.push(
														SIGN_IN +
															(query.get('company')
																? `?company=${query.get('company')}`
																: '')
													)
												}
											>
												{formatMessage({ id: 'btn.sign.in' })}
											</Button>
										)}
									</>
								)}
							</Box>
						) : (
							<Box
								display='flex'
								alignItems='center'
								gap={2}
							>
								<Link
									href={MENU}
									style={{
										textDecoration: 'none',
										color: 'inherit'
									}}
								>
									<Button color='inherit'>{formatMessage({ id: 'header.menu.title' })}</Button>
								</Link>

								<Button
									color='inherit'
									endIcon={
										<Image
											src='/assets/icons/down-arrow.svg'
											alt='Down Arrow'
											width={11}
											height={11}
										/>
									}
									onClick={handleServicesClick}
								>
									{formatMessage({ id: 'header.services.title' })}
								</Button>
								<Menu
									anchorEl={anchorElServices}
									open={Boolean(anchorElServices)}
									onClose={handleClose}
									slotProps={{ paper: { sx: { bgcolor: theme.palette.background.default } } }}
								>
									<MenuItem
										onClick={() => {
											handleClose();
											router.push(DAILY_OFFICE_MEAL);
										}}
									>
										<Stack
											direction='row'
											alignItems='center'
											justifyContent={'space-between'}
											gap={1}
										>
											<Image
												src='/assets/icons/service-option1.svg'
												alt='Service Option 1'
												width={24}
												height={24}
											/>
											{formatMessage({ id: 'header.services.option1' })}
										</Stack>
									</MenuItem>
									<Divider />
									<MenuItem
										onClick={() => {
											handleClose();
											router.push(CORPORATE_CATERING);
										}}
									>
										<Stack
											direction='row'
											alignItems='center'
											justifyContent={'space-between'}
											gap={1}
										>
											<Image
												src='/assets/icons/service-option2.svg'
												alt='Service Option 2'
												width={24}
												height={24}
											/>
											{formatMessage({ id: 'header.services.option2' })}
										</Stack>
									</MenuItem>
									{/* <Divider /> */}
									{/* <MenuItem
										onClick={() => {
											handleClose();
											router.push(SUBSCRIPTION);
										}}
									>
										<Stack
											direction='row'
											alignItems='center'
											justifyContent={'space-between'}
											gap={1}
										>
											<Image
												src='/assets/icons/service-option3.svg'
												alt='Service Option 3'
												width={24}
												height={24}
											/>
											{formatMessage({ id: 'header.services.option3' })}
										</Stack>
									</MenuItem> */}
								</Menu>

								<Link
									href={LOYALTY}
									style={{
										textDecoration: 'none',
										color: 'inherit'
									}}
								>
									<Button color='inherit'>
										{formatMessage({ id: 'header.loyalty.program.title' })}
									</Button>
								</Link>

								{user && <LoyaltyPoints />}

								{/* Shopping bag icon to represent number of items */}
								{!(
									pathname === SIGN_IN ||
									pathname === SIGN_UP ||
									pathname === FORGOTPASSWORD ||
									pathname === RESETPASSWORD
								) && <Bag cartItemCount={totalQuantity} />}

								<Button
									color='inherit'
									endIcon={
										<Image
											src='/assets/icons/down-arrow.svg'
											alt='Down Arrow'
											width={11}
											height={11}
										/>
									}
									onClick={handleLangClick}
									sx={{ border: `1px solid ${theme.palette.divider}` }}
								>
									<Image
										src={
											selectedLang === 'de'
												? '/assets/icons/germany-flag.svg'
												: '/assets/icons/uk-flag.svg'
										}
										alt={selectedLang === 'de' ? 'Germany' : 'UK'}
										width={24}
										height={24}
									/>{' '}
									&nbsp;{' '}
									{selectedLang === 'de'
										? formatMessage({ id: 'translate.to.german' })
										: formatMessage({ id: 'translate.to.english' })}
								</Button>
								<Menu
									anchorEl={anchorElLang}
									open={Boolean(anchorElLang)}
									onClose={handleClose}
								>
									<MenuItem onClick={() => handleLanguageChange('de')}>
										<Image
											src='/assets/icons/germany-flag.svg'
											alt='Germany'
											width={24}
											height={24}
										/>
										&nbsp; {formatMessage({ id: 'translate.to.german' })}
									</MenuItem>
									<MenuItem onClick={() => handleLanguageChange('en')}>
										<Image
											src='/assets/icons/uk-flag.svg'
											alt='UK'
											width={24}
											height={24}
										/>
										&nbsp; {formatMessage({ id: 'translate.to.english' })}
									</MenuItem>
								</Menu>

								{user ? (
									<>
										<Button
											variant='contained'
											onClick={() => router.push('/menu')}
										>
											ORDER NOW
										</Button>
										<Avatar
											alt={user?.displayName || 'User'}
											src={user?.photoURL || '/'}
											onClick={anchorElProfile ? handleClose : handleProfileClick}
											sx={{ cursor: 'pointer' }}
										/>
										<Menu
											anchorEl={anchorElProfile}
											open={Boolean(anchorElProfile)}
											onClose={handleClose}
											slotProps={{
												paper: {
													sx: {
														bgcolor: theme.palette.background.default,
														border: `1px solid ${theme.palette.divider}`,
														borderRadius: theme.shape.borderRadius
													}
												}
											}}
										>
											<MenuItem>
												<Stack
													direction='row'
													alignItems='center'
													gap={1}
												>
													<Avatar
														alt={user?.displayName || 'User'}
														src={user?.photoURL || '/'}
													/>
													<Box>
														<Typography>{user?.displayName}</Typography>
														<Typography variant='body2'>{user?.email}</Typography>
													</Box>
												</Stack>
											</MenuItem>
											<Divider />
											{navbarProfileMenuItems.map((item, index) => (
												<div key={index}>
													<MenuItem onClick={() => handleMenuItemClick(item)}>
														<Stack
															direction='row'
															alignItems='center'
															gap={1}
														>
															<img
																src={item.icon}
																alt={item.label}
																width={16}
																height={16}
															/>
															<Typography
																variant='body1'
																color={item.color || 'inherit'}
															>
																{item.label}
															</Typography>
														</Stack>
													</MenuItem>
													{index < navbarProfileMenuItems.length - 1 && <Divider />}
												</div>
											))}
										</Menu>
									</>
								) : (
									<>
										<Button
											variant='outlined'
											onClick={() => router.push('/enquiry')}
										>
											{formatMessage({ id: 'btn.enquire.now' })}
										</Button>
										<Button
											variant='contained'
											onClick={() =>
												router.push(
													`/sign-in${query.get('company') ? `?company=${query.get('company')}` : ''}`
												)
											}
										>
											ORDER NOW
										</Button>
									</>
								)}
							</Box>
						)}
					</Toolbar>
				</Container>
			</AppBar>
			<Drawer
				anchor='left'
				open={drawerOpen}
				onClose={toggleDrawer}
				PaperProps={{ sx: { width: 350, bgcolor: theme.palette.background.default } }}
			>
				<MobileNavDrawer onClose={toggleDrawer} />
			</Drawer>
		</>
	);
};

export default Navbar;
