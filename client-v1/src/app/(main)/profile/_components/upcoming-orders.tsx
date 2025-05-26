import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Button, useTheme, useMediaQuery, Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
import moment from 'moment';
import DayItems from './day-items';
import { CustomerOrdersData, OrderDetailsApiReturnType } from '@/types';
import { useRouter } from 'next/navigation';
import { MENU, ORDER_STATUS } from '@/lib/constants';
import { useAppSelector } from '@/store/store';
import Loading from '@/components/loading';

interface UpcomingOrdersProps {
	tabValue: number;
}

const UpcomingOrders: React.FC<UpcomingOrdersProps> = () => {
	const router = useRouter();
	const theme = useTheme();
	const { user } = useAppSelector(state => state.auth);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [orders, setOrders] = useState<CustomerOrdersData[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5); // Items per page
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		if (user?.uid) {
			fetchOrders(user.uid);
		}
	}, []);

	/**
	 * Fetch all orders based on the current user and criteria.
	 */
	const fetchAllOrders = async (uid: string) => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders?populate[MenuItems][populate]=ItemImage&filters[UiD][$eq]=${uid}&filters[isOrderCompleted][$eq]=${false}&filters[isOrderCancelled][$eq]=${false}&populate=*&sort=createdAt:desc`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch orders');
		}

		const data = await response.json();
		return data.data;
	};

	/**
	 * Identify orders whose delivery date has passed.
	 */
	const getOrdersToUpdate = (orders: CustomerOrdersData[]) => {
		const currentDateTime = moment();

		return orders.filter(order => {
			const deliveryDate = moment(order.attributes.deliveryDate);
			return deliveryDate.isBefore(currentDateTime);
		});
	};

	/**
	 * Update an order's `isOrderCompleted` flag.
	 */
	const updateOrderCompletionStatus = async (orderId: number) => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders/${orderId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				data: { isOrderCompleted: true, OrderStatus: ORDER_STATUS.DELIVERED }
			})
		});

		if (!response.ok) {
			throw new Error(`Failed to update order with ID ${orderId}`);
		}

		return response.json();
	};

	/**
	 * Update multiple orders' `isOrderCompleted` flags.
	 */
	const updateOrdersCompletionStatus = async (ordersToUpdate: CustomerOrdersData[]) => {
		const updatePromises = ordersToUpdate.map(order => updateOrderCompletionStatus(order.id));

		await Promise.all(updatePromises);
	};

	const fetchOrders = async (uid: string) => {
		try {
			setIsLoading(true);

			const orders = await fetchAllOrders(uid);

			const ordersToUpdate = getOrdersToUpdate(orders);

			if (ordersToUpdate.length > 0) {
				await updateOrdersCompletionStatus(ordersToUpdate);
			}

			const updatedOrders = await fetchAllOrders(uid);

			setTotalItems(updatedOrders.length);
			setOrders(updatedOrders);
		} catch (error) {
			console.error('Error fetching or updating orders:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
		setCurrentPage(page);
	};

	// Slicing the orders array for the current page
	const paginatedOrders = orders?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

	if (isLoading) {
		return <Loading />;
	}

	if (!orders || orders.length === 0) {
		return (
			<Stack
				spacing={0}
				alignItems='center'
				justifyContent='center'
				textAlign='center'
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					p: 3
				}}
			>
				<Image
					src='/assets/images/empty-order.png'
					alt='Empty Orders'
					width={150}
					height={160}
					style={{ marginBottom: '16px' }}
				/>
				<Typography variant='h6'>No Upcoming Orders!</Typography>
				<Typography
					variant='body2'
					sx={{ mt: 1 }}
				>
					You do not have any upcoming orders for this week.
				</Typography>
				<Button
					variant='contained'
					size='large'
					sx={{ px: 5, mt: 2 }}
					onClick={() => router.push(MENU)}
				>
					Continue Browsing
				</Button>
			</Stack>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
			{paginatedOrders.map(order => (
				<React.Fragment key={order.id}>
					<DayItems
						menuItems={order.attributes.MenuItems}
						deliveryDate={order.attributes.deliveryDate}
						orderPlacedAt={order.attributes.createdAt}
						orderId={order.id}
						shipTo={order.attributes.Address}
						grandTotal={order.attributes.GrandTotal}
						tabValue={0}
						fetchOrders={() => fetchOrders(user.uid)}
						OrderStatus={order.attributes.OrderStatus}
					/>
				</React.Fragment>
			))}

			{/* Pagination Controls */}
			<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
				<Pagination
					count={Math.ceil(totalItems / itemsPerPage)} // Total number of pages
					page={currentPage}
					onChange={handlePageChange}
					color='primary'
					renderItem={item => (
						<PaginationItem
							{...item}
							components={{
								previous: () => (
									<>
										<ArrowBackIcon
											fontSize='small'
											style={{ marginRight: 4 }}
										/>
										Previous
									</>
								),
								next: () => (
									<>
										Next
										<ArrowForwardIcon
											fontSize='small'
											style={{ marginLeft: 4 }}
										/>
									</>
								)
							}}
							sx={{
								'&.MuiPaginationItem-previousNext': {
									display: 'flex',
									alignItems: 'center',
									color: theme.palette.primary.main,
									fontWeight: 600,
									textTransform: 'capitalize'
								}
							}}
						/>
					)}
				/>
			</Box>
		</Box>
	);
};

export default UpcomingOrders;
