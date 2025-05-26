import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button,
	Box,
	Stack,
	IconButton,
	Drawer,
	Divider,
	Grid,
	useMediaQuery,
	useTheme
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { addItemToCart, removeItemFromCart } from '@/store/slices/cart-slice';
import { MenuItemType } from '@/types';
import {
	calculatePrice,
	getAllergensIcon,
	getAllergensText,
	getFoodPreferenceIcon,
	getSpiceLevelIcon
} from '@/lib/helper';
import { EURO } from '@/lib/constants';

interface ItemDetailDialogProps {
	open: boolean;
	onClose: () => void;
	item: MenuItemType | null;
	endpointIndex: number;
	isTodayTab: boolean;
}

const ItemDetailDialog: React.FC<ItemDetailDialogProps> = ({ open, onClose, item, endpointIndex, isTodayTab }) => {
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const cartItem = useAppSelector((state: RootState) =>
		state.cart.days[endpointIndex]?.items.find(cartItem => cartItem.data.id === item?.data.id)
	);
	const { user } = useAppSelector(state => state.auth);

	const quantity = cartItem ? cartItem.quantity : 0;

	const itemPrice = Number(
		calculatePrice(
			item?.data.attributes?.OriginalPrice || 0,
			item?.data.attributes?.OfferedPrice || 0,
			useAppSelector((state: RootState) => state.company.discountPercentage || 0),
			useAppSelector(
				(state: RootState) => state.company.menuItemPrice || item?.data.attributes?.OfferedPrice || 0
			)
		)
	);

	const itemAttributes = item?.data?.attributes;

	const discountPercentage = useAppSelector((state: RootState) => state.company.discountPercentage);
	const companyMenuItemPrice = useAppSelector((state: RootState) => state.company.menuItemPrice);

	// Handlers for adding and removing items
	const handleAddToBag = (event: React.MouseEvent) => {
		event.stopPropagation();
		dispatch(
			addItemToCart({
				item: {
					...item,
					data: {
						...item?.data,
						attributes: {
							...item?.data.attributes,
							OfferedPrice: Number(
								calculatePrice(
									itemAttributes?.OriginalPrice || 0,
									itemAttributes?.OfferedPrice || 0,
									discountPercentage || 0,
									companyMenuItemPrice ? companyMenuItemPrice : itemAttributes?.OfferedPrice
								)
							)
						}
					}
				},
				endpointIndex
			})
		);
	};

	const handleIncrement = (event: React.MouseEvent) => {
		event.stopPropagation();
		dispatch(addItemToCart({ item, endpointIndex }));
	};

	const handleDecrement = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (quantity > 0) {
			dispatch(removeItemFromCart({ id: item?.data.id, endpointIndex }));
		}
	};

	const isOfferedPriceSameAsOriginalPrice = itemAttributes?.OfferedPrice === itemAttributes?.OriginalPrice;

	// Dialog content layout
	const DialogContentComponent = (
		<DialogContent>
			<Stack
				mb={2}
				justifyContent='center'
				alignItems='center'
			>
				<Image
					src={
						item?.data.attributes.ItemImage?.data?.attributes?.formats?.medium?.url ||
						'https://placehold.co/200x200?text=img+not+found'
					}
					alt={item?.data.attributes ? item?.data.attributes.Name : 'Image not found'}
					width={isMobile ? 350 : 500}
					height={isMobile ? 200 : 300}
					style={{
						maxWidth: isMobile ? '100%' : '500px',
						maxHeight: isMobile ? '200px' : '300px',
						borderRadius: theme.shape.borderRadius,
						objectFit: 'contain'
					}}
				/>
			</Stack>
			<Box>
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant='h6'>{item?.data.attributes.Name}</Typography>
					<Stack
						direction='row'
						alignItems='center'
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
								{/* {(itemAttributes?.OfferedPrice ?? 0) > 0 && ( */}
									<Typography
										variant='h6'
										sx={{
											textDecoration:
												!isOfferedPriceSameAsOriginalPrice ? 'line-through' : 'none'
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
				</Stack>
				<Typography
					variant='body1'
					color='text.secondary'
				>
					{item?.data.attributes.Description}
				</Typography>
			</Box>

			{/* Dietary flags */}
			<Box sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Dietary flags</Typography>
				<Stack
					direction='row'
					spacing={2}
				>
					{item?.data.attributes.FoodPreference && (
						<Box
							display='flex'
							alignItems='center'
						>
							<Image
								src={getFoodPreferenceIcon(item.data.attributes.FoodPreference.data.attributes.Title)}
								alt={item.data.attributes.FoodPreference.data.attributes.Title}
								width={20}
								height={20}
							/>
							<Typography
								variant='subtitle2'
								ml={1}
							>
								{item.data.attributes.FoodPreference.data.attributes.Title}
							</Typography>
						</Box>
					)}

					{item?.data.attributes.SpiceLevel && (
						<Box
							display='flex'
							alignItems='center'
						>
							<Image
								src={
									item.data.attributes.SpiceLevel.data &&
									getSpiceLevelIcon(item.data.attributes.SpiceLevel.data.attributes.Title)
								}
								alt={
									item.data.attributes.SpiceLevel.data &&
									item.data.attributes.SpiceLevel.data.attributes.Title
								}
								width={20}
								height={20}
							/>
							<Typography
								variant='subtitle2'
								ml={1}
							>
								{item.data.attributes.SpiceLevel.data &&
									item.data.attributes.SpiceLevel.data.attributes.Title}
							</Typography>
						</Box>
					)}
				</Stack>
			</Box>

			{/* Allergens */}
			{(item?.data?.attributes?.Allergens?.data.length ?? 0) > 0 && (
				<Box sx={{ mt: 2 }}>
					<Typography variant='subtitle1'>Allergens</Typography>
					<Grid
						container
						spacing={2}
					>
						{item?.data.attributes.Allergens.data.map((allergen, index) => (
							<Grid
								item
								key={index}
							>
								<Stack
									direction='row'
									alignItems='center'
									spacing={1}
								>
									<Image
										src={getAllergensIcon(allergen.attributes.Title)}
										alt={allergen.attributes.Title}
										width={24}
										height={24}
									/>
									<Typography variant='subtitle2'>
										{getAllergensText(allergen.attributes.Title)}
									</Typography>
								</Stack>
							</Grid>
						))}
					</Grid>
				</Box>
			)}
		</DialogContent>
	);

	// Dialog actions layout
	const DialogActionsComponent = (
		<DialogActions>
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
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					sx={{ width: '100%' }}
				>
					{/* Quantity controls */}
					{quantity !== 0 ? (
						<Stack
							direction='row'
							alignItems='center'
							spacing={1}
						>
							<Typography variant='subtitle1'>Quantity</Typography>
							<Stack
								direction='row'
								alignItems='center'
								spacing={1}
								sx={{
									borderRadius: theme.shape.borderRadius,
									border: `1px solid ${theme.palette.divider}`,
									paddingX: 1
								}}
							>
								<IconButton
									onClick={handleDecrement}
									size='small'
								>
									<RemoveIcon />
								</IconButton>
								<Typography>{quantity}</Typography>
								<IconButton
									onClick={handleIncrement}
									size='small'
								>
									<AddIcon />
								</IconButton>
							</Stack>
						</Stack>
					) : (
						<Box flexGrow={1} />
					)}

					{/* Add to Bag button */}
					{!item?.data.attributes.isMenuOutOfStock ? (
						<Button
							variant='contained'
							onClick={handleAddToBag}
							startIcon={
								<Image
									src={'/assets/icons/bag-white.svg'}
									alt='Bag'
									width={19}
									height={19}
								/>
							}
							sx={{ minHeight: '40px' }}
							disabled={quantity > 0}
						>
							{quantity > 0 ? 'Added to Bag' : 'Add to Bag'}
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
					)}
				</Stack>
			)}
		</DialogActions>
	);

	return (
		<>
			{isMobile ? (
				<Drawer
					anchor='bottom'
					open={open}
					onClose={onClose}
					sx={{
						'& .MuiDrawer-paper': {
							height: '90vh',
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							display: 'flex',
							flexDirection: 'column'
						}
					}}
				>
					<Box>
						<DialogTitle>
							<Stack
								direction='row'
								justifyContent='space-between'
								alignItems='center'
							>
								<Typography variant='h6'>Meal Details</Typography>
								<IconButton onClick={onClose}>
									<Image
										src='/assets/icons/close.svg'
										alt='Close'
										width={15}
										height={15}
									/>
								</IconButton>
							</Stack>
						</DialogTitle>
						<Divider />
						{DialogContentComponent}
						<Box
							sx={{
								borderTop: `2px solid ${theme.palette.divider}`,
								boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.1)',
								position: 'sticky',
								bottom: 0,
								backgroundColor: theme.palette.background.paper
							}}
						>
							{DialogActionsComponent}
						</Box>
					</Box>
				</Drawer>
			) : (
				<Dialog
					open={open}
					onClose={onClose}
					maxWidth='sm'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: theme.shape.borderRadius
						}
					}}
				>
					<DialogTitle>
						<Stack
							direction='row'
							justifyContent='space-between'
							alignItems='center'
						>
							<Typography variant='h6'>Meal Details</Typography>
							<IconButton onClick={onClose}>
								<Image
									src='/assets/icons/close.svg'
									alt='Close'
									width={15}
									height={15}
								/>
							</IconButton>
						</Stack>
					</DialogTitle>
					<Divider />
					{DialogContentComponent}
					<Divider />
					{DialogActionsComponent}
				</Dialog>
			)}
		</>
	);
};

export default ItemDetailDialog;
