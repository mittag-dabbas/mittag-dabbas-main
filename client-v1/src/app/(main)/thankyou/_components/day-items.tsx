import { Alert, Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { CartItem, DayItem } from '@/types';
import OrderItemCard from './order-item-card';
import { addItemToCart, deleteItemFromCart, removeItemFromCart } from '@/store/slices/cart-slice';
import { dayWiseTabMenu } from '@/lib/constants';
import { getTabDataForCurrentWeek } from '@/lib/helper';

type CartDayItemsProps = {
	dayData: DayItem[];
	dayName: string;
};

const DayItems = ({ dayData, dayName }: CartDayItemsProps) => {
	const theme = useTheme();
	const dispatch = useDispatch();

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
					{dayName.toUpperCase()} Mealboxes
				</Typography>

				{/* <Alert
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
				</Alert> */}
			</Stack>

			<Stack
				spacing={2}
				sx={{
					mb: 2
				}}
			>
				{dayData.map((item, index) => (
					<OrderItemCard
						key={index}
						item={item}
					/>
				))}
			</Stack>
		</Box>
	);
};

export default DayItems;
