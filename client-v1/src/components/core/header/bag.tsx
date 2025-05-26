'use client';

import Loading from '@/components/loading';
import { Badge, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import CartDrawer from './cart-drawer';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setIsBagOpen } from '@/store/slices/cart-slice';

type Props = {
	cartItemCount: number;
};

const Bag: React.FC<Props> = ({ cartItemCount }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const dispatch = useAppDispatch();

	const isBagOpen = useAppSelector(state => state.cart.isBagOpen);

	const toggleDrawer = () => {
		dispatch(setIsBagOpen({ isBagOpen: !isBagOpen }));
	};

	return (
		<>
			<IconButton
				aria-label='bag'
				onClick={toggleDrawer}
			>
				<Badge
					badgeContent={cartItemCount}
					color='secondary'
					overlap='circular'
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right'
					}}
					sx={{
						'& .MuiBadge-badge': {
							border: `2px solid white`,
							padding: '0 4px'
						}
					}}
				>
					<Image
						src='/assets/icons/bag.svg'
						alt='bag'
						width={30}
						height={30}
					/>
				</Badge>
			</IconButton>
			<Drawer
				anchor={isMobile ? 'bottom' : 'right'}
				open={isBagOpen}
				onClose={toggleDrawer}
				PaperProps={{
					sx: {
						backgroundColor: theme.palette.background.default,
						borderTopLeftRadius: theme.shape.borderRadius,
						borderBottomLeftRadius: theme.shape.borderRadius,
						width: '100%',
						maxWidth: isMobile ? '100%' : '400px'
					}
				}}
			>
				<CartDrawer onClose={toggleDrawer} />
			</Drawer>
		</>
	);
};

export default Bag;
