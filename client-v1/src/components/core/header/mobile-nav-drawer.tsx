'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
	FACEBOOK,
	HOME,
	INSTAGRAM,
	LINKEDIN,
	LOYALTY,
	LOYALTY_POINTS,
	MENU,
	ORDERS,
	PROFILE,
	SETTINGS,
	SIGN_IN,
	SIGN_UP,
	SUBSCRIPTION,
	navbarProfileMenuItems
} from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import Bag from './bag';
import { signOutUser } from '@/store/slices/auth-slice';
import { NavbarProfileMenuItemsType } from '@/types';
import LoyaltyPoints from './loyalty-points';
import { LinkedIn } from '@mui/icons-material';

type Props = {
	onClose: () => void;
};

const MobileNavDrawer = (props: Props) => {
	const theme = useTheme();
	const { formatMessage } = useIntl();
	const { locale, setLocale } = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);
	const { totalQuantity } = useAppSelector(state => state.cart);
	const dabbaPoints = useAppSelector(state => state.dabbaPoints.dabbaPoints);

	const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
	const [anchorElServices, setAnchorElServices] = React.useState<null | HTMLElement>(null);
	const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
	const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);
	const [selectedLang, setSelectedLang] = React.useState('en');
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const handleLangClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElLang(event.currentTarget);
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

	const handleMenuButton = () => {
		router.push(MENU);
		props.onClose();
	};

	const handleLoyaltyPointsButton = () => {
		router.push(`${LOYALTY}`);
		props.onClose();
	};

	return (
		<Box
			role='presentation'
			onClick={e => e.stopPropagation()}
			onKeyDown={e => e.stopPropagation()}
			sx={{ padding: 2, bgcolor: theme.palette.background.default }}
		>
			<Stack
				flexDirection='row'
				justifyContent='space-between'
				alignItems='center'
			>
				<Box
					display='flex'
					justifyContent='center'
				>
					<Link href={HOME}>
						<Image
							src='/assets/icons/logo.svg'
							alt='Mittag-Dabbas'
							width={170}
							height={45}
						/>
					</Link>
				</Box>

				<Box
					display='flex'
					justifyContent='center'
					sx={{
						position: 'absolute',
						top: 1,
						right: 2
					}}
				>
					<IconButton onClick={props.onClose}>
						<Image
							src='/assets/icons/close.svg'
							alt='Close'
							width={18}
							height={18}
						/>
					</IconButton>
				</Box>
			</Stack>

			<Divider />

			{/* Profile Section */}

			{user && (
				<Stack
					direction='row'
					alignItems='center'
					// gap={1}
					spacing={2}
					sx={{ my: 2 }}
				>
					<Avatar
						alt={user?.displayName || 'User'}
						src={user?.photoURL || '/'}
					/>
					<Box>
						<Typography>{user?.displayName}</Typography>
						<Typography variant='body2'>{user?.email}</Typography>
						<Link
							href={PROFILE}
							style={{ marginTop: '10px' }}
							color='primary'
							onClick={props.onClose}
						>
							View Profile
						</Link>
					</Box>
				</Stack>
			)}

			<Divider />

			{/* Menu Button */}
			<Box
				display='flex'
				alignItems={'center'}
				sx={{
					my: 1
				}}
				onClick={handleMenuButton}
			>
				<Link
					href={MENU}
					style={{ textDecoration: 'none', color: 'inherit' }}
				>
					<Button
						fullWidth
						variant='text'
						color='inherit'
						sx={{ justifyContent: 'center' }}
					>
						{formatMessage({ id: 'header.menu.title' })}
					</Button>
				</Link>
			</Box>

			<Divider />

			{/* Loyalty Points Button */}
			<Box
				display='flex'
				alignItems={'center'}
				sx={{
					my: 1
				}}
				onClick={handleLoyaltyPointsButton}
			>
				<Link
					href={`${LOYALTY}`}
					style={{ textDecoration: 'none', color: 'inherit' }}
				>
					<Button
						fullWidth
						variant='text'
						color='inherit'
						sx={{ justifyContent: 'center' }}
					>
						{formatMessage({ id: 'header.loyalty.program.title' }).toUpperCase()}
					</Button>
				</Link>
			</Box>

			<Divider />

			{/* Services Section */}
			<Box
				sx={{
					my: 1
				}}
				onClick={() => setAnchorElServices(anchorElServices ? null : document.body)}
			>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					gap={1}
					sx={{
						my: 1
					}}
				>
					<Button
						variant='text'
						color='inherit'
						disableRipple
						disableFocusRipple
						disableTouchRipple
						onClick={() => setAnchorElServices(anchorElServices ? null : document.body)}
						sx={{
							color: anchorElServices ? theme.palette.primary.main : 'inherit'
						}}
					>
						{formatMessage({ id: 'header.services.title' })}
					</Button>
					{anchorElServices ? (
						<Image
							src='/assets/icons/up-arrow.svg'
							alt='Up Arrow'
							width={11}
							height={11}
						/>
					) : (
						<Image
							src='/assets/icons/down-arrow.svg'
							alt='Down Arrow'
							width={11}
							height={11}
						/>
					)}
				</Stack>
				{!anchorElServices && <Divider />}

				{anchorElServices && (
					<Box sx={{ pl: 2, my: 1 }}>
						<Button
							fullWidth
							variant='text'
							color='inherit'
							startIcon={
								<Image
									src='/assets/icons/service-option1.svg'
									alt='Service Option 1'
									width={24}
									height={24}
								/>
							}
							onClick={() => {
								router.push(DAILY_OFFICE_MEAL);
								handleClose();
								props.onClose();
							}}
							sx={{ justifyContent: 'flex-start', mb: 1 }}
						>
							{formatMessage({ id: 'header.services.option1' })}
						</Button>
						<Button
							fullWidth
							variant='text'
							color='inherit'
							startIcon={
								<Image
									src='/assets/icons/service-option2.svg'
									alt='Service Option 2'
									width={24}
									height={24}
								/>
							}
							onClick={() => {
								router.push(CORPORATE_CATERING);
								handleClose();
								props.onClose();
							}}
							sx={{ justifyContent: 'flex-start', mb: 1 }}
						>
							{formatMessage({ id: 'header.services.option2' })}
						</Button>
						{/* <Button
							fullWidth
							variant='text'
							color='inherit'
							startIcon={
								<Image
									src='/assets/icons/service-option3.svg'
									alt='Service Option 3'
									width={24}
									height={24}
								/>
							}
							onClick={() => {
								router.push(SUBSCRIPTION);
								handleClose();
								props.onClose();
							}}
							sx={{ justifyContent: 'flex-start', mb: 1 }}
						>
							{formatMessage({ id: 'header.services.option3' })}
						</Button> */}
					</Box>
				)}

				{anchorElServices && <Divider />}
			</Box>

			{/* Dabba points Button */}
			{user && (
				<>
					<Box
						display='flex'
						alignItems={'center'}
						sx={{
							my: 1,
							width: '100%'
						}}
						onClick={handleMenuButton}
					>
						<Link
							href={`${PROFILE}?tab=${LOYALTY_POINTS}`}
							style={{
								textDecoration: 'none',
								color: 'inherit',
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<Typography>{formatMessage({ id: 'header.dabba.points' }).toUpperCase()}</Typography>
							<LoyaltyPoints />
						</Link>
					</Box>
					<Divider />
				</>
			)}

			{/* Language Selection */}
			<Box sx={{ my: 2 }}>
				<Button
					fullWidth
					variant='text'
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
					sx={{
						justifyContent: 'flex-start',
						border: `1px solid ${theme.palette.divider}`,
						width: 94
					}}
				>
					<Image
						src={selectedLang === 'de' ? '/assets/icons/germany-flag.svg' : '/assets/icons/uk-flag.svg'}
						alt={selectedLang === 'de' ? 'Germany' : 'UK'}
						width={24}
						height={24}
					/>
					&nbsp;{' '}
					{selectedLang === 'de'
						? formatMessage({ id: 'translate.to.german' })
						: formatMessage({ id: 'translate.to.english' })}
				</Button>
			</Box>

			<Divider />

			{/* Language Menu */}
			<Menu
				anchorEl={anchorElLang}
				open={Boolean(anchorElLang)}
				onClose={handleClose}
				slotProps={{ paper: { sx: { bgcolor: theme.palette.background.default } } }}
			>
				<MenuItem
					onClick={() => {
						handleLanguageChange('de');
						props.onClose();
					}}
				>
					<Image
						src='/assets/icons/germany-flag.svg'
						alt='Germany'
						width={24}
						height={24}
					/>
					&nbsp; {formatMessage({ id: 'translate.to.german' })}
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={() => {
						handleLanguageChange('en');
						props.onClose();
					}}
				>
					<Image
						src='/assets/icons/uk-flag.svg'
						alt='UK'
						width={24}
						height={24}
					/>
					&nbsp; {formatMessage({ id: 'translate.to.english' })}
				</MenuItem>
			</Menu>

			{/* <Divider /> */}

			{/* Enquiry and Sign In Buttons */}
			<Box
				sx={{
					mt: 2,
					mb: 2
				}}
			>
				<Button
					fullWidth
					variant='outlined'
					onClick={() => {
						router.push(ENQUIRY);
						props.onClose();
					}}
				>
					{formatMessage({ id: 'btn.enquire.now' })}
				</Button>
			</Box>
			{!(pathname === SIGN_IN || pathname === SIGN_UP || user) && (
				<Box
					sx={{
						mb: 2
					}}
				>
					<Button
						fullWidth
						variant='contained'
						onClick={() => {
							router.push(SIGN_IN);
							props.onClose();
						}}
					>
						{formatMessage({ id: 'btn.sign.in' })}
					</Button>
				</Box>
			)}

			{/* Social Media Links */}
			<Stack
				direction='row'
				gap={2}
				sx={{ mt: 3 }}
			>
				<Link
					href={FACEBOOK}
					color='inherit'
					style={{ margin: 1 }}
					target='_blank'
				>
					<Image
						src='/assets/icons/fb-black.svg'
						alt='Facebook'
						width={20}
						height={20}
					/>
				</Link>
				<Link
					href={INSTAGRAM}
					color='inherit'
					style={{ margin: 1 }}
					target='_blank'
				>
					<Image
						src='/assets/icons/instagram-black.svg'
						alt='Instagram'
						width={20}
						height={20}
					/>
				</Link>
				<Link
					href={LINKEDIN}
					color='black'
					style={{ margin: 1 }}
					target='_blank'
				>
					<Image
						src='/assets/icons/linkedin.svg'
						alt='Linkedin'
						width={22}
						height={22}
					/>
				</Link>
			</Stack>

			<Stack
				direction='column'
				sx={{ mt: 2 }}
				spacing={2}
			>
				{/* Email Section */}
				<Stack
					direction='row'
					alignItems='center'
					spacing={1}
				>
					<Image
						src='/assets/icons/email-black.svg'
						alt='Email'
						width={20}
						height={20}
					/>
					<Link
						href='mailto:mittagdabbas@tandoori-naechte.com'
						color={theme.palette.text.primary}
						style={{ textDecoration: 'none' }}
					>
						<Typography
							variant='body1'
							color={theme.palette.text.primary}
						>
							{formatMessage({ id: 'footer.connect.us.email' })}
						</Typography>
					</Link>
				</Stack>

				{/* Phone Section */}
				<Stack
					direction='row'
					alignItems='center'
					spacing={1}
				>
					<Image
						src='/assets/icons/phone-black.svg'
						alt='Phone'
						width={20}
						height={20}
					/>
					<Link
						href='tel:+917891569584'
						color={theme.palette.text.primary}
						style={{ textDecoration: 'none' }}
					>
						<Typography
							variant='body1'
							color={theme.palette.text.primary}
						>
							{formatMessage({ id: 'footer.connect.us.phone' })}
						</Typography>
					</Link>
				</Stack>

				<Divider />

				{/* Timing Section */}
				<Stack
					flex={1}
					spacing={2}
				>
					<Typography variant='h6'>{formatMessage({ id: 'footer.timings.title' })}</Typography>
					<Typography variant='body2'>
						{formatMessage({ id: 'footer.timings.service1' })}
						<br />
						{formatMessage({ id: 'footer.timings.service2' })}
						<br />
						<strong>{formatMessage({ id: 'footer.service12.timing' })}</strong>
					</Typography>

					<Typography variant='body2'>
						{formatMessage({ id: 'footer.timings.service3' })}
						<br />
						<strong>{formatMessage({ id: 'footer.service3.timing' })}</strong>
					</Typography>
				</Stack>

				<Divider />

				{/* Delivery Location Section */}
				<Typography variant='h6'>{formatMessage({ id: 'footer.delivery.location.title' })}</Typography>
				<Typography variant='body2'>{formatMessage({ id: 'footer.delivery.location.location1' })}</Typography>

				<Divider />
			</Stack>
		</Box>
	);
};

export default MobileNavDrawer;
