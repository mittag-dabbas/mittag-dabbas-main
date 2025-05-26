'use client';

import { useAppSelector } from '@/store/store';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import DayItems from './day-items';
import PlaceOrder from './place-order';

type Props = {};

const OrderSummary = (props: Props) => {
	const theme = useTheme();
	const cartData = useAppSelector(state => state.cart.days);

	const isCartEmpty = Object.values(cartData).every(dayCart => dayCart.items.length === 0);
	return (
		<Box
			sx={{
				p: 2,
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				backgroundColor: theme.palette.background.paper
			}}
		>
			<Typography variant='h4'>Order Summary</Typography>

			<Box
				sx={{
					mt: 2
				}}
			>
				{Object.entries(cartData).map(([dayIndex, dayCart]) => {
					if (dayCart.items.length === 0) return null;

					return (
						<DayItems
							key={dayIndex}
							dayIndex={parseInt(dayIndex)}
							dayCart={dayCart}
						/>
					);
				})}
			</Box>

			<Box>
				<PlaceOrder />
			</Box>
		</Box>
	);
};

export default OrderSummary;
