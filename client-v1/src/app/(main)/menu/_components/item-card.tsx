import { MenuItemType, WeekDayItemType } from '@/types';
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton, useTheme, Stack } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { calculatePrice, getFoodPreferenceIcon, getSpiceLevelIcon } from '@/lib/helper';
import { RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { addItemToCart, removeItemFromCart, setIsBagOpen } from '@/store/slices/cart-slice';
import { EURO } from '@/lib/constants';
import { sendGTMEvent, sendGAEvent } from '@next/third-parties/google';

interface ItemCardProps {
	item: MenuItemType;
	endpointIndex: number;
	onItemClick: (item: MenuItemType) => void;
	isTodayTab: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, endpointIndex, onItemClick, isTodayTab }) => {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);

	// Safely access nested properties
	const itemData = item?.data;
	const itemAttributes = itemData?.attributes;

	const dayCart = useAppSelector((state: RootState) => state.cart.days[endpointIndex]);
	const cartItem = dayCart?.items?.find(cartItem => cartItem.data?.id === itemData?.id);
	const quantity = cartItem?.quantity ?? 0;

	const discountPercentage = useAppSelector((state: RootState) => state.company.discountPercentage);
	const companyMenuItemPrice = useAppSelector((state: RootState) => state.company.menuItemPrice);

	const isBagOpen = useAppSelector(state => state.cart.isBagOpen);

	const isItemDrinks = itemAttributes?.Categories?.data?.attributes?.Title === 'Drinks';

	const handleAddToBag = (event: React.MouseEvent) => {
		event.stopPropagation();

		// Dispatch action to add item to cart
		dispatch(
			addItemToCart({
				item: {
					...item,
					data: {
						...item.data,
						attributes: {
							...item.data.attributes,
							OfferedPrice: Number(
								calculatePrice(
									itemAttributes?.OriginalPrice || 0,
									itemAttributes?.OfferedPrice || 0,
									discountPercentage || 0,
									companyMenuItemPrice ? companyMenuItemPrice : undefined,
									isItemDrinks
								)
							)
						}
					}
				},
				endpointIndex
			})
		);

		// Google Tag Manager Event
		sendGTMEvent({
			event: 'add_to_cart',
			value: item.data.attributes.Name ?? 'Item'
		});

		// Google Analytics Event
		sendGAEvent({
			action: 'add_to_cart',
			category: 'cart',
			label: item.data.attributes.Name ?? 'Item'
		});

		// **Brevo Event Trigger**
		if (typeof window !== 'undefined' && window.sendinblue) {
			window.sendinblue.track('add_to_cart', {
				item_id: item.data.id,
				item_name: item.data.attributes.Name,
				price: item.data.attributes.OfferedPrice || item.data.attributes.OriginalPrice,
				category: itemAttributes?.Categories?.data?.attributes?.Title || 'Uncategorized',
				quantity: 1,
				user_email: user?.email || 'guest' // Send user email if available
			});
		}

		// Open Bag
		dispatch(setIsBagOpen({ isBagOpen: !isBagOpen }));
	};

	const handleIncrement = (event: React.MouseEvent) => {
		event.stopPropagation();
		dispatch(addItemToCart({ item, endpointIndex }));
	};

	const handleDecrement = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (quantity > 0) {
			dispatch(removeItemFromCart({ id: item.data.id, endpointIndex }));
		}
	};

	// Helper function to get image URL safely
	const getImageUrl = () => {
		const imageData = itemAttributes?.ItemImage?.data?.attributes?.formats?.medium?.url;
		return imageData || 'https://placehold.co/200x200?text=img+not+found';
	};

	const isOfferedPriceSameAsOriginalPrice = itemAttributes?.OfferedPrice === itemAttributes?.OriginalPrice;

	return (
		<Card
			sx={{
				height: 420,
				borderRadius: theme.shape.borderRadius,
				display: 'flex',
				flexDirection: 'column',
				border: `1px solid ${theme.palette.divider}`,
				cursor: 'pointer'
			}}
			onClick={() => onItemClick(item)}
		>
			<CardMedia
				component='img'
				image={getImageUrl()}
				alt={itemAttributes?.Name || 'Image not found'}
				sx={{
					borderRadius: theme.shape.borderRadius,
					objectFit: 'cover',
					objectPosition: 'center',
					p: 1,
					height: 220,
					width: '100%'
				}}
			/>

			<CardContent
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: theme.spacing(2)
				}}
			>
				<Box mb={1}>
					<Typography
						variant='h6'
						component='div'
					>
						{itemAttributes?.Name || 'Item not found'}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: '2',
							WebkitBoxOrient: 'vertical'
						}}
					>
						{itemAttributes?.Description || 'Description not found'}
					</Typography>
				</Box>

				<Stack
					direction='row'
					mb={1}
					spacing={2}
				>
					<Box
						display='flex'
						alignItems='center'
					>
						<Image
							src={getFoodPreferenceIcon(itemAttributes?.FoodPreference?.data?.attributes?.Title || '')}
							alt={itemAttributes?.FoodPreference?.data?.attributes?.Title || 'No food preference'}
							width={20}
							height={20}
						/>
						<Typography
							variant='body1'
							ml={1}
						>
							{itemAttributes?.FoodPreference?.data?.attributes?.Title || 'No food preference'}
						</Typography>
					</Box>

					<Box
						display='flex'
						alignItems='center'
					>
						<Image
							src={getSpiceLevelIcon(itemAttributes?.SpiceLevel?.data?.attributes?.Title || '')}
							alt={itemAttributes?.SpiceLevel?.data?.attributes?.Title || 'No spice level'}
							width={20}
							height={20}
						/>
						<Typography
							variant='body1'
							ml={1}
						>
							{itemAttributes?.SpiceLevel?.data?.attributes?.Title || 'No spice level'}
						</Typography>
					</Box>
				</Stack>

				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					mt={2}
				>
					{isTodayTab ? (
						<Typography
							color='error'
							variant='subtitle1'
							sx={{
								bgcolor: theme.palette.background.default,
								borderRadius: theme.shape.borderRadius,
								padding: theme.spacing(0.5),
								border: `2px solid ${theme.palette.error.main}`
							}}
						>
							Order not being accepted
						</Typography>
					) : (
						<>
							<Stack
								direction='row'
								spacing={2}
							>
								{companyMenuItemPrice ? (
									<Typography variant='h6'>
										{EURO}
										{calculatePrice(
											itemAttributes?.OriginalPrice || 0,
											itemAttributes?.OfferedPrice || 0,
											discountPercentage || 0,
											companyMenuItemPrice
										)}
									</Typography>
								) : (
									<>
										{/* {itemAttributes?.OfferedPrice > 0 && ( */}
										<Typography
											variant='h6'
											sx={{
												textDecoration: !isOfferedPriceSameAsOriginalPrice
													? 'line-through'
													: 'none'
											}}
										>
											{EURO}
											{Math.max(
												itemAttributes?.OriginalPrice || 0,
												itemAttributes?.OfferedPrice || 0
											).toFixed(2)}
										</Typography>
										{/* )} */}

										{!isOfferedPriceSameAsOriginalPrice && (
											<Typography variant='h6'>
												{EURO}
												{calculatePrice(
													itemAttributes?.OriginalPrice || 0,
													itemAttributes?.OfferedPrice || 0,
													discountPercentage || 0
												)}
											</Typography>
										)}
									</>
								)}
							</Stack>

							{quantity === 0 ? (
								!item.data.attributes.isMenuOutOfStock ? (
									<Button
										variant='contained'
										size='small'
										startIcon={
											<Image
												src={'/assets/icons/bag-white.svg'}
												alt='Bag'
												width={17}
												height={17}
											/>
										}
										onClick={handleAddToBag}
										sx={{
											fontSize: theme.typography.pxToRem(12)
										}}
									>
										Add to Bag
									</Button>
								) : (
									<Typography
										color='error'
										variant='subtitle1'
										sx={{
											bgcolor: theme.palette.background.default,
											borderRadius: theme.shape.borderRadius,
											padding: theme.spacing(0.5),
											border: `2px solid ${theme.palette.error.main}`
										}}
									>
										Out of Stock
									</Typography>
								)
							) : (
								<Box
									display='flex'
									alignItems='center'
									sx={{
										borderRadius: theme.shape.borderRadius,
										border: `1px solid ${theme.palette.primary.main}`
									}}
								>
									<IconButton
										onClick={handleDecrement}
										color='primary'
										size='small'
									>
										<RemoveIcon />
									</IconButton>
									<Typography>{quantity}</Typography>
									<IconButton
										onClick={handleIncrement}
										color='primary'
										size='small'
									>
										<AddIcon />
									</IconButton>
								</Box>
							)}
						</>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};

export default ItemCard;
