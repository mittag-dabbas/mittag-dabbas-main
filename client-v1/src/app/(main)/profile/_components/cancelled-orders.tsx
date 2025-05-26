import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Button, useTheme, useMediaQuery, Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DayItems from './day-items';
import { CustomerOrdersData } from '@/types';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/store';
import Loading from '@/components/loading';

interface CancelledOrdersProps {
	tabValue: number;
}

const CancelledOrders: React.FC<CancelledOrdersProps> = ({ tabValue }) => {
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
			fetchOrders();
		}
	}, []);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders?populate[MenuItems][populate]=ItemImage&populate=*&filters[UiD][$eq]=${user.uid}&filters[isOrderCancelled][$eq]=${true}&sort=updatedAt:desc`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}

			const data = await response.json();
			setTotalItems(data.data.length); // Set the total number of items
			setOrders(data.data);
		} catch (error) {
			console.error('Error fetching orders:', error);
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
				<Typography variant='h6'>No Cancelled Orders!</Typography>
				<Typography
					variant='body2'
					sx={{ mt: 1 }}
				>
					You haven't cancelled any orders yet.
				</Typography>
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
						tabValue={2}
						orderCancelledAt={order.attributes.updatedAt}
						fetchOrders={fetchOrders}
						grandTotal={order.attributes.GrandTotal}
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
					shape='rounded'
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

export default CancelledOrders;
