'use client';

import React, { useMemo, useCallback } from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 240;

const menuItems = [
	{ label: 'All Orders', path: '/admin/dashboard/order-all' },
	{ label: 'Labels', path: '/admin/dashboard/label' },
	{ label: 'Users', path: '/admin/dashboard/users' },
	{ label: 'Create manual order', path: '/admin/dashboard/manual-order' }
];

interface SidebarProps {
	variant: 'permanent' | 'temporary';
	open: boolean;
	onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ variant, open, onClose }) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleNavigation = useCallback(
		(path: string) => {
			router.push(path);
			if (onClose) onClose();
		},
		[router, onClose]
	);

	const renderedMenuItems = useMemo(
		() =>
			menuItems.map(({ label, path }) => (
				<ListItem
					key={path}
					component='div'
					sx={{
						cursor: 'pointer',
						bgcolor: pathname === path ? 'action.selected' : 'transparent',
						'&:hover': { bgcolor: 'action.hover' }
					}}
					onClick={() => handleNavigation(path)}
				>
					<ListItemText primary={label} />
				</ListItem>
			)),
		[pathname, handleNavigation]
	);

	return (
		<Drawer
			variant={variant}
			open={open}
			onClose={onClose}
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box'
				}
			}}
			ModalProps={{
				keepMounted: true // Better open performance on mobile.
			}}
		>
			<Toolbar />
			<Box sx={{ overflow: 'auto' }}>
				<List>{renderedMenuItems}</List>
			</Box>
		</Drawer>
	);
};
