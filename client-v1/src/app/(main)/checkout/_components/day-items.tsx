import { Alert, Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import moment from 'moment';
import React from 'react';
import { CartItem } from '@/types';
import OrderItemCard from './order-item-card';
import { dayWiseTabMenu } from '@/lib/constants';
import { getTabDataForCurrentWeek } from '@/lib/helper';

type CartDayItemsProps = {
	dayIndex: number;
	dayCart: {
		items: CartItem[];
		deliveryTime: string;
	};
};

const DayItems = ({ dayIndex, dayCart }: CartDayItemsProps) => {
	const theme = useTheme();

	const { tabData } = getTabDataForCurrentWeek();

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
					variant='body2'
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
					/>
				))}
			</Stack>
		</Box>
	);
};

export default DayItems;
