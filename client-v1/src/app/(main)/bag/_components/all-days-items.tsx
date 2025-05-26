import { Alert, Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { CartItem } from '@/types';
import OrderItemCard from './per-day-items';
import { addItemToCart, deleteItemFromCart, removeItemFromCart } from '@/store/slices/cart-slice';
import { dayWiseTabMenu } from '@/lib/constants';
import { getTabDataForCurrentWeek } from '@/lib/helper';

type AllDaysItemsProps = {
	dayIndex: number;
	dayCart: {
		items: CartItem[];
		deliveryTime: string;
	};
};

const AllDaysItems = ({ dayIndex, dayCart }: AllDaysItemsProps) => {
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

	const { tabData, todayIndex } = getTabDataForCurrentWeek();

	return (
		<Box>
			<Stack
				direction='row'
				justifyContent='space-between'
				alignItems='center'
				spacing={0}
				sx={{
					mb: 2
				}}
			>
				<Typography
					variant='h6'
					textTransform={'uppercase'}
					fontWeight={600}
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
						py: 0,
						px: 0.5
					}}
				>
					<Typography variant='body2'>
						{tabData[dayIndex].date} |{' '}
						{moment(dayCart.deliveryTime.split('-')[0], 'HH:mm').format('hh:mm A')} -{' '}
						{moment(dayCart.deliveryTime.split('-')[1], 'HH:mm').format('hh:mm A')}
					</Typography>
				</Alert>
			</Stack>

			<Stack
				spacing={2}
				sx={{
					mb: 2
				}}
			>
				{dayCart.items.map(item => (
					<OrderItemCard
						key={item.data.id}
						item={item}
						onAdd={() => handleAddItem(item)}
						onRemove={() => handleRemoveItem(item.data.id)}
						onDelete={() => handleDeleteItem(item.data.id)}
					/>
				))}
			</Stack>

			{/* <Divider /> */}
		</Box>
	);
};

export default AllDaysItems;
