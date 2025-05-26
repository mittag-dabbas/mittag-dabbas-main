import { Box, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItem } from '@/types';
import { EURO } from '@/lib/constants';
import { calculatePrice } from '@/lib/helper';
import { RootState, useAppSelector } from '@/store/store';

type MealItemProps = {
	item: CartItem;
};

const OrderItemCard = ({ item }: MealItemProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const companyMenuItemPrice = useAppSelector((state: RootState) => state.company.menuItemPrice);
	const discountPercentage = useAppSelector((state: RootState) => state.company.discountPercentage);

	const isOfferedPriceSameAsOriginalPrice = item.data.attributes.OfferedPrice === item.data.attributes.OriginalPrice;

	return (
		<Stack
			direction='row'
			spacing={2}
			sx={{
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(1),
				alignItems: 'center'
			}}
		>
			<Image
				src={
					item.data.attributes.ItemImage.data.attributes?.formats?.medium?.url
						? item.data.attributes.ItemImage.data.attributes.formats.medium.url
						: 'https://placehold.co/60x60?text=img+not+found'
				}
				alt={`${item.data.attributes.Name} Image`}
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
					<Typography variant='subtitle1'>{item.data.attributes.Name}</Typography>
					<Typography>Qty: {item.quantity}</Typography>
				</Stack>
			</Stack>
			<>
				{companyMenuItemPrice ? (
					<>
						<Typography variant='h6'>
							{EURO}
							{calculatePrice(
								item.data?.attributes?.OriginalPrice || 0,
								item.data?.attributes?.OfferedPrice || 0,
								discountPercentage || 0,
								companyMenuItemPrice
							)}
						</Typography>
					</>
				) : (
					<>
						{item && item.data.attributes.OfferedPrice > 0 && (
							<Typography
								variant='h6'
								sx={{ textDecoration: !isOfferedPriceSameAsOriginalPrice ? 'line-through' : 'none' }}
							>
								{EURO} {Math.max(item.data.attributes.OriginalPrice, item.data.attributes.OfferedPrice)}
							</Typography>
						)}
						{!isOfferedPriceSameAsOriginalPrice && (
							<Typography variant='h6'>
								{EURO}
								{item
									? item.data.attributes.OfferedPrice > 0
										? Math.min(
												item.data.attributes.OriginalPrice,
												item.data.attributes.OfferedPrice
											)
										: item.data.attributes.OriginalPrice
									: ''}
							</Typography>
						)}
					</>
				)}
			</>
		</Stack>
	);
};

export default OrderItemCard;
