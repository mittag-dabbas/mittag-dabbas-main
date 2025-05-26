import { Alert, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { CartItem } from '@/types';
import MealItem from './meal-item';
import { addItemToCart, deleteItemFromCart, removeItemFromCart } from '@/store/slices/cart-slice';
import { dayWiseTabMenu } from '@/lib/constants';

type CartDayItemsProps = {
	dayIndex: number;
	dayCart: {
		items: CartItem[];
		deliveryTime: string;
	};
};

const CartDayItems = ({ dayIndex, dayCart }: CartDayItemsProps) => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const handleAddItem = (item: CartItem) => {
		dispatch(addItemToCart({ item, endpointIndex: dayIndex }));
	};

	const handleRemoveItem = (id: number) => {
		dispatch(removeItemFromCart({ id, endpointIndex: dayIndex }));
	};

	const handleDeleteItem = (id: number) => {
		dispatch(deleteItemFromCart({ id, endpointIndex: dayIndex }));
	};

	return (
		<Box
			sx={{
				my: 1
			}}
		>
			<Typography
				variant='h5'
				textTransform={'uppercase'}
			>
				{dayWiseTabMenu[dayIndex]} Mealboxes
			</Typography>

			<Alert
				variant='standard'
				severity='success'
				icon={
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
					>
						<Image
							src={'/assets/icons/menu.svg'}
							alt='Menu Icon'
							width={20}
							height={20}
						/>
					</Stack>
				}
				sx={{
					border: `1px solid ${theme.palette.success.main}`,
					borderRadius: theme.shape.borderRadius,
					mb: 2,
					mt: 1
				}}
			>
				<Typography variant='subtitle2'>
					Delivery on {dayWiseTabMenu[dayIndex]}, between{' '}
					{moment(dayCart.deliveryTime.split('-')[0], 'HH:mm').format('hh:mm A')} -{' '}
					{moment(dayCart.deliveryTime.split('-')[1], 'HH:mm').format('hh:mm A')}
				</Typography>
			</Alert>

			<Stack spacing={2}>
				{dayCart.items.map(item => (
					<MealItem
						key={item.data.id}
						item={item}
						onAdd={() => handleAddItem(item)}
						onRemove={() => handleRemoveItem(item.data.id)}
						onDelete={() => handleDeleteItem(item.data.id)}
					/>
				))}
			</Stack>
		</Box>
	);
};

export default CartDayItems;
