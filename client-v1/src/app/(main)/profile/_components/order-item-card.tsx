import { Box, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DayItem } from '@/types';

type MealItemProps = {
	item: DayItem;
};

const OrderItemCard = ({ item }: MealItemProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { Name, TotalPrice, ItemImage, quantity } = item;

	return (
		<Stack
			direction='row'
			spacing={2}
			sx={{
				// border: `1px solid ${theme.palette.divider}`,
				// borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(1),
				alignItems: 'center'
			}}
		>
			<Image
				src={ItemImage?.data?.attributes?.formats?.medium?.url || '/assets/images/placeholder.jpg'}
				alt={`${Name} Image`}
				width={60}
				height={60}
				style={{ borderRadius: theme.shape.borderRadius, objectFit: 'cover' }}
			/>
			<Stack flexGrow={1}>
				<Stack
					direction='column'
					spacing={1}
					alignItems='flex-start'
					justifyContent='flex-start'
				>
					<Typography variant='subtitle1'>{item.Name}</Typography>
					<Typography>Qty: {quantity}</Typography>
				</Stack>
			</Stack>
			{/* <Typography variant='h6'>{TotalPrice}€</Typography> */}
		</Stack>
	);
};

export default OrderItemCard;
