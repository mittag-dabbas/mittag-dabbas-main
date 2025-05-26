'use client';

import React, { useState } from 'react';
import { AppBar, Box, CssBaseline, Toolbar, Typography, IconButton, Drawer, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar } from './_components/sidebar';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />

			<AppBar
				position='fixed'
				sx={{ zIndex: 1201, paddingLeft: isMobile ? 1 : 5 }}
			>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
					{isMobile && (
						<IconButton
							color='inherit'
							aria-label='open drawer'
							edge='start'
							onClick={handleDrawerToggle}
						>
							<MenuIcon />
						</IconButton>
					)}

					<img
						src='https://www.mittag-dabbas.com/assets/icons/logo-white.svg'
						alt='Company Logo'
						style={{ maxWidth: '150px', marginBottom: '10px' }}
					/>

					<Typography
						sx={{
							flexGrow: 1,
							textAlign: 'center',
							fontWeight: 'bold',
							fontSize: '1.2rem'
						}}
					>
						ADMIN PANEL
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Sidebar */}
			<Sidebar
				variant={isMobile ? 'temporary' : 'permanent'}
				open={mobileOpen}
				onClose={handleDrawerToggle}
			/>

			{/* Main content */}
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					mt: 8
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
