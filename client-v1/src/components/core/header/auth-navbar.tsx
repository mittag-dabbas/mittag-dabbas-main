'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
	Container
} from '@mui/material';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { useLocale } from '@/hooks/use-locale';
import Link from 'next/link';
import { CORPORATE_CATERING, DAILY_OFFICE_MEAL, HOME } from '@/lib/constants';

interface Props {}

const AuthNavbar = (props: Props) => {
	const theme = useTheme();
	const { formatMessage } = useIntl();
	const { locale, setLocale } = useLocale();
	const router = useRouter();

	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
	const [anchorElServices, setAnchorElServices] = React.useState<null | HTMLElement>(null);
	const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
	const [selectedLang, setSelectedLang] = React.useState('en');
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElMenu(event.currentTarget);
		event.stopPropagation(); // Prevent drawer from closing
	};

	const handleServicesClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElServices(event.currentTarget);
		event.stopPropagation(); // Prevent drawer from closing
	};

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
	};

	const switchLocale = (newLocale: string) => {
		setLocale(newLocale);
	};

	const toggleDrawer = (open: boolean) => () => {
		setDrawerOpen(open);
	};

	const drawerContent = (
		<Box
			role='presentation'
			onClick={e => e.stopPropagation()} // Prevent drawer close when interacting inside
			onKeyDown={e => e.stopPropagation()} // Same for keyboard events
			sx={{ padding: 2, bgcolor: theme.palette.background.default }}
		>
			{/* Close Button */}
			<Box
				display='flex'
				justifyContent='flex-end'
				position='absolute'
				sx={{ top: 0, right: -1, p: 0 }}
			>
				<IconButton onClick={toggleDrawer(false)}>
					<Image
						src='/assets/icons/close.svg'
						alt='Close'
						width={24}
						height={24}
					/>
				</IconButton>
			</Box>

			{/* Logo */}
			<Box mb={2}>
				<Link href={HOME}>
					<Image
						src='/assets/icons/logo.svg'
						alt='Mittag-Dabbas'
						width={210}
						height={45}
					/>
				</Link>
			</Box>

			<Divider />

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
				<MenuItem onClick={() => handleLanguageChange('de')}>
					<Image
						src='/assets/icons/germany-flag.svg'
						alt='Germany'
						width={24}
						height={24}
					/>
					&nbsp; {formatMessage({ id: 'translate.to.german' })}
				</MenuItem>
				<Divider />
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

			{/* Social Media Links */}
			<Stack
				direction='row'
				gap={2}
				sx={{ mt: 3 }}
			>
				<Link
					href='#'
					color='inherit'
					style={{ margin: 1 }}
				>
					<Image
						src='/assets/icons/fb-black.svg'
						alt='Facebook'
						width={20}
						height={20}
					/>
				</Link>
				<Link
					href='#'
					color='inherit'
					style={{ margin: 1 }}
				>
					<Image
						src='/assets/icons/instagram-black.svg'
						alt='Instagram'
						width={20}
						height={20}
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

	return (
		<Container>
			<AppBar
				position='static'
				color='transparent'
				elevation={0}
				// component={'container'}
			>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					<Box
						display='flex'
						alignItems='center'
					>
						{isMobile && (
							<Button
								color='inherit'
								onClick={toggleDrawer(true)}
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
								src='/assets/icons/logo.svg'
								alt='Mittag-Dabbas'
								width={isMobile ? 150 : 210}
								height={isMobile ? 30 : 45}
							/>
						</Link>
					</Box>
					<Box
						display='flex'
						alignItems='center'
						gap={2}
					>
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
					</Box>
				</Toolbar>
				<Drawer
					anchor='left'
					open={drawerOpen}
					onClose={toggleDrawer(false)}
					PaperProps={{ sx: { width: 350, bgcolor: theme.palette.background.default } }}
				>
					{drawerContent}
				</Drawer>
			</AppBar>
		</Container>
	);
};

export default AuthNavbar;
