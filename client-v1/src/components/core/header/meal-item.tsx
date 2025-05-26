import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItem } from '@/types';
import { EURO } from '@/lib/constants';
import { RootState, useAppSelector } from '@/store/store';
import { calculatePrice } from '@/lib/helper';

type MealItemProps = {
	item: CartItem;
	onAdd: () => void;
	onRemove: () => void;
	onDelete: () => void; // New prop for deleting the item
};

const MealItem = ({ item, onAdd, onRemove, onDelete }: MealItemProps) => {
	const theme = useTheme();

	const companyMenuItemPrice = useAppSelector((state: RootState) => state.company.menuItemPrice);
	const discountPercentage = useAppSelector((state: RootState) => state.company.discountPercentage);

	const isOfferedPriceSameAsOriginalPrice = item.data.attributes.OfferedPrice === item.data.attributes.OriginalPrice;

	return (
		<Stack
			direction='row'
			alignItems='center'
			justifyContent='space-between'
			spacing={2}
			sx={{
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(1)
			}}
		>
			<Image
				src={
					item.data.attributes.ItemImage.data.attributes?.formats?.medium?.url
						? item.data.attributes.ItemImage.data.attributes.formats?.medium.url
						: 'https://placehold.co/60x60?text=img+not+found'
				}
				alt={`${item.data.attributes.Name} Image`}
				width={60}
				height={60}
				style={{ borderRadius: theme.shape.borderRadius, objectFit: 'cover' }}
			/>
			<Stack flexGrow={1}>
				<Stack
					direction='row'
					alignItems='center'
					spacing={1}
				>
					<Typography variant='subtitle1'>{item.data.attributes.Name}</Typography>
				</Stack>
				<Stack
					direction='row'
					alignItems='center'
					spacing={1}
					sx={{
						border: `2px solid ${theme.palette.divider}`,
						borderRadius: theme.shape.borderRadius,
						width: 'fit-content'
					}}
				>
					<IconButton
						onClick={onRemove}
						size='small'
						disabled={item.quantity === 1}
						color={'primary'}
					>
						<RemoveIcon fontSize='small' />
					</IconButton>
					<Typography>{item.quantity}</Typography>
					<IconButton
						onClick={onAdd}
						size='small'
						color={'primary'}
					>
						<AddIcon fontSize='small' />
					</IconButton>
				</Stack>
			</Stack>
			<Stack
				direction='column'
				justifyContent='center'
				alignItems='center'
				spacing={1}
			>
				<IconButton onClick={onDelete}>
					<Image
						src='/assets/icons/bin.svg'
						alt='Delete Icon'
						width={17}
						height={17}
					/>
				</IconButton>
				<Stack
					direction='row'
					alignItems='center'
					spacing={1}
					sx={{
						width: 'max-content'
					}}
				>
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
									sx={{
										textDecoration: !isOfferedPriceSameAsOriginalPrice ? 'line-through' : 'none'
									}}
								>
									{EURO}{' '}
									{Math.max(item.data.attributes.OriginalPrice, item.data.attributes.OfferedPrice)}
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
				</Stack>
			</Stack>
		</Stack>
	);
};

export default MealItem;
