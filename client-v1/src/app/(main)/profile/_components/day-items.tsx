import {
	Alert,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Stack,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import Image from 'next/image';
import moment from 'moment';
import React, { useState } from 'react';
import { DayItem } from '@/types';
import OrderItemCard from './order-item-card';
import { useSnackbar } from 'notistack';
import { EURO, ORDER_STATUS } from '@/lib/constants';
import { getOrderStatus } from '@/lib/helper';

type CartDayItemsProps = {
	menuItems: DayItem[];
	deliveryDate: string;
	orderPlacedAt: string;
	shipTo: string;
	orderId: number;
	tabValue: number;
	orderCancelledAt?: string;
	grandTotal?: number;
	fetchOrders?: () => void;
	OrderStatus?: string;
};

const DayItems: React.FC<CartDayItemsProps> = ({
	menuItems,
	deliveryDate,
	orderId,
	orderPlacedAt,
	shipTo,
	tabValue,
	orderCancelledAt,
	fetchOrders,
	grandTotal,
	OrderStatus
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { enqueueSnackbar } = useSnackbar();

	const [isDialogOpen, setDialogOpen] = useState(false);

	// Helper functions for date formatting
	const formattedOrderDate = orderPlacedAt ? moment(orderPlacedAt).format('dddd, MMMM DD, YYYY') : 'N/A';
	const orderDeliveryDate = moment(deliveryDate).format('dddd, MMMM DD, YYYY');
	const orderDeliveryStartTime = moment(deliveryDate).format('hh:mm A');
	const orderDeliveryEndTime = moment(deliveryDate).add(1, 'hours').format('hh:mm A');
	const orderCancelledTime = orderCancelledAt ? moment(orderCancelledAt).format('dddd, MMMM DD, YYYY') : 'N/A';

	// sort the menu items by orderPlacedAt

	const handleCancelOrder = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders/${orderId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: { isOrderCancelled: true, OrderStatus: ORDER_STATUS.CANCELLED } })
			});

			if (!response.ok) {
				throw new Error('Failed to cancel order');
			}
			fetchOrders && fetchOrders();
			enqueueSnackbar('Order canceled successfully', { variant: 'success' });
			setDialogOpen(false);
		} catch (error) {
			console.error('Error canceling order:', error);
		}
	};

	return (
		<Box
			sx={{
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				p: 2
			}}
		>
			{/* Header */}
			<Stack
				direction={isMobile ? 'column' : 'row'}
				justifyContent={isMobile ? 'flex-start' : 'space-between'}
				alignItems={isMobile ? 'flex-start' : 'center'}
				flexWrap={isMobile ? 'wrap' : 'nowrap'}
				spacing={isMobile ? 1 : 2}
				sx={{
					mb: 3,
					width: '100%'
				}}
			>
				<Typography
					variant='h4'
					textTransform='uppercase'
					fontWeight={600}
					sx={{ mb: isMobile ? 2 : 0 }}
				>
					{`${moment(deliveryDate).format('dddd')} Mealboxes`}
				</Typography>

				<Box sx={{ display: isMobile ? 'block' : 'inline-block', mb: isMobile ? 1 : 0 }}>
					<Typography variant='body2'>Order ID</Typography>
					<Typography variant='subtitle2'>#{orderId}</Typography>
				</Box>

				<Box sx={{ display: isMobile ? 'block' : 'inline-block', mb: isMobile ? 1 : 0 }}>
					<Typography variant='body2'>Order Placed</Typography>
					<Typography variant='subtitle2'>{formattedOrderDate}</Typography>
				</Box>

				<Box sx={{ display: isMobile ? 'block' : 'inline-block', mb: isMobile ? 1 : 0 }}>
					<Typography variant='body2'>Grand Total</Typography>
					<Typography variant='subtitle2'>
						{grandTotal} {EURO}
					</Typography>
				</Box>

				<Box sx={{ display: isMobile ? 'block' : 'inline-block' }}>
					<Typography variant='body2'>Ship To</Typography>
					<Typography variant='subtitle2'>{shipTo}</Typography>
				</Box>
			</Stack>

			<Divider sx={{ mb: 2 }} />

			<Stack
				direction={isMobile ? 'column' : 'row'}
				justifyContent={isMobile ? 'center' : 'space-between'}
				alignItems='center'
				sx={{
					mb: 2
				}}
			>
				{/* Delivery Information Alert */}
				<Stack
					direction={isMobile ? 'column' : 'row'}
					justifyContent={isMobile ? 'center' : 'flex-start'}
					spacing={1}
					alignItems='center'
				>
					<Alert
						variant='standard'
						severity={tabValue <= 1 ? 'success' : 'error'}
						icon={
							<Stack
								direction='row'
								justifyContent='center'
								alignItems='center'
							>
								<Image
									src={tabValue <= 1 ? '/assets/icons/menu.svg' : '/assets/icons/cancel.svg'}
									alt='Menu Icon'
									width={20}
									height={20}
								/>
							</Stack>
						}
						sx={{
							border: `1px solid ${tabValue <= 1 ? theme.palette.success.main : theme.palette.error.main}`,
							borderRadius: theme.shape.borderRadius,
							py: 0,
							px: 1.3
						}}
					>
						{tabValue === 0 ? (
							<Typography variant='body2'>
								{`Delivery on `}
								<strong>{orderDeliveryDate}</strong>
								{` between `}
								<strong>{`${orderDeliveryStartTime} - ${orderDeliveryEndTime}`}</strong>
							</Typography>
						) : tabValue === 1 ? (
							<Typography variant='body2'>
								{`Delivered on `}
								<strong>{orderDeliveryDate}</strong>
							</Typography>
						) : tabValue === 2 ? (
							<Typography variant='body2'>
								{`Order Cancelled on `}
								<strong>{orderCancelledTime}</strong>
							</Typography>
						) : null}
					</Alert>

					{OrderStatus && (
						<Chip
							label={getOrderStatus(OrderStatus).text}
							color={
								getOrderStatus(OrderStatus).color as
									| 'default'
									| 'primary'
									| 'secondary'
									| 'error'
									| 'info'
									| 'success'
									| 'warning'
							}
						/>
					)}
				</Stack>
				{/* Cancel Order Button */}
				{tabValue === 0 && !isMobile && (
					<Button
						variant='outlined'
						onClick={() => setDialogOpen(true)}
					>
						Cancel Order
					</Button>
				)}
			</Stack>

			{/* List of Day Items */}
			<Stack
				spacing={2}
				sx={{ mb: 2 }}
			>
				{menuItems.map((item, index) => (
					<OrderItemCard
						key={index}
						item={item}
					/>
				))}
			</Stack>

			{/* Cancel Order Button */}
			{isMobile && (
				<Button
					variant='outlined'
					onClick={() => setDialogOpen(true)}
				>
					Cancel Order
				</Button>
			)}

			{/* Cancel Order Confirmation Dialog */}
			<Dialog
				open={isDialogOpen}
				onClose={() => setDialogOpen(false)}
				aria-labelledby='cancel-order-dialog-title'
				aria-describedby='cancel-order-dialog-description'
				PaperProps={{
					sx: {
						borderRadius: theme.shape.borderRadius,
						p: 2
					}
				}}
			>
				<DialogTitle id='cancel-order-dialog-title'>Cancel Order</DialogTitle>
				<DialogContent>
					<DialogContentText id='cancel-order-dialog-description'>
						Are you sure you want to cancel this order? <strong>No refund</strong> will be issued.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setDialogOpen(false)}
						color='primary'
					>
						Do Not Cancel
					</Button>
					<Button
						onClick={handleCancelOrder}
						color='error'
						autoFocus
					>
						Cancel Order
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default DayItems;
