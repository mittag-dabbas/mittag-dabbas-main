'use client';

import Loading from '@/components/loading';
import { BAG } from '@/lib/constants';
import { useAppSelector } from '@/store/store';
import { Box, Button, Divider, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const CartDayItems = dynamic(() => import('./cart-day-items'), {
	loading: () => <Loading />
});

type Props = {
	onClose: () => void;
};

const CartDrawer = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const cartData = useAppSelector(state => state.cart.days);
	const totalPrice = useAppSelector(state => state.cart.totalPrice);
	const isCartEmpty = Object.values(cartData).every(dayCart => dayCart.items.length === 0);

	const handleGotoCart = () => {
		props.onClose();
		router.push(BAG);
	};

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				maxHeight: '100%',
				boxSizing: 'border-box'
			}}
		>
			{/* Header */}
			<Box sx={{ p: 2 }}>
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant='h5'>Your Bag</Typography>
					<IconButton
						aria-label='close'
						onClick={props.onClose}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: theme.palette.grey[500]
						}}
					>
						<Image
							src='/assets/icons/close.svg'
							alt='Close'
							width={15}
							height={15}
						/>
					</IconButton>
				</Stack>
			</Box>

			<Divider />

			{/* Scrollable Main Content Area */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
				{isCartEmpty ? (
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						height='100%'
						textAlign='center'
						width='100%'
					>
						<Typography
							variant='subtitle1'
							color='textSecondary'
						>
							No items added
						</Typography>
					</Box>
				) : (
					Object.entries(cartData).map(([dayIndex, dayCart], index) => {
						if (dayCart.items.length === 0) return null;

						return (
							<Box
								sx={{
									my: index > 0 ? 2 : 0
								}}
							>
								<CartDayItems
									key={dayIndex}
									dayIndex={parseInt(dayIndex)}
									dayCart={dayCart}
								/>
							</Box>
						);
					})
				)}
			</Box>

			{/* Fixed Footer - Buttons */}
			{!isCartEmpty && (
				<Stack
					sx={{
						p: 2,
						borderTop: `2px solid ${theme.palette.divider}`,
						boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.1)',
						backgroundColor: theme.palette.background.default,
						position: 'relative',
						bottom: 0,
						width: '100%'
					}}
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					spacing={2}
				>
					<Box>
						<Typography variant='subtitle1'>Sub-total</Typography>
						<Typography
							variant='h6'
							fontWeight='bold'
						>
							{totalPrice.toFixed(2)} €
						</Typography>
					</Box>
					<Button
						variant='contained'
						color='primary'
						fullWidth
						onClick={handleGotoCart}
						sx={{ maxWidth: 150 }}
					>
						View Bag
					</Button>
				</Stack>
			)}
		</Box>
	);
};

export default CartDrawer;
