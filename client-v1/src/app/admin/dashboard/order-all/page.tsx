'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import {
	Box,
	Button,
	Stack,
	Chip,
	MenuItem,
	Select,
	FormControl,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import {
	CustomerOrdersApiReturnType,
	OrderAllData,
	SingleOrderApiReturnType,
	SingleOrderItemImageData,
	SingleOrderMenuItem
} from '@/types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { ORDER_STATUS } from '@/lib/constants';
import OrderStatusEmailTemplate from '@/components/order-status-email-template';
import { ADMIN_EMAIL_1, ADMIN_EMAIL_2, DOMAIN_EMAIL } from '@/lib/constants';
import { updateDabbaPoints } from '@/store/services/dabba-points-service';
import { calculateRefundPoints } from '@/lib/helper';

const csvConfig = mkConfig({
	fieldSeparator: ',',
	decimalSeparator: '.',
	useKeysAsHeaders: true
});

interface FlattenedOrderData {
	menuItem: string;
	quantity: number;
	customerName: string;
	customerEmail: string;
	companyName: string;
	deliveryAddress: string;
	orderId: number;
	orderStatus: string;
	DabbaPointsUsed?: number;
	PhoneNumber: number;
}

// Order status configuration
type OrderStatusConfig = {
	[key: string]: {
		color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
		label: string;
	};
};

const orderStatusConfig: OrderStatusConfig = {
	ACCEPTED: { color: 'success', label: 'Accepted' },
	CANCELLED: { color: 'error', label: 'Cancelled' },
	READY: { color: 'primary', label: 'Ready' },
	'ON-THE-WAY': { color: 'info', label: 'On The Way' },
	DELIVERED: { color: 'secondary', label: 'Delivered' }
};

const OrderAll = () => {
	const [data, setData] = useState<FlattenedOrderData[]>([]);
	const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(moment());
	const [isLoading, setIsLoading] = useState(false);
	const [globalFilter, setGlobalFilter] = useState('');
	const [rowSelection, setRowSelection] = useState({});
	const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');

	useEffect(() => {
		fetchOrders(moment());
	}, []);

	const fetchOrders = useCallback(async (date: moment.Moment) => {
		setIsLoading(true);
		try {
			const startDate = moment(date).startOf('day').toISOString();
			const endDate = moment(date).endOf('day').toISOString();

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders?populate=*&filters[deliveryDate][$gte]=${startDate}&filters[deliveryDate][$lte]=${endDate}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}

			const result = await response.json();

			const flattenedData: FlattenedOrderData[] = result.data.flatMap((order: OrderAllData) =>
				order.attributes.MenuItems.map(item => ({
					menuItem: item.Name,
					quantity: parseInt(item.quantity),
					customerName: order.attributes.Name?.trim()
						? order.attributes.Name
						: `${order.attributes.Customer.data?.attributes.FirstName || ''} ${order.attributes.Customer.data?.attributes.LastName || ''}`.trim(),
					customerEmail: order.attributes.Customer.data?.attributes.Email || '',
					companyName: order.attributes.Address.split(',')[0],
					deliveryAddress: `${order.attributes.Address.split(',')[1]}, ${order.attributes.Address.split(',')[2]}`,
					orderId: order.id,
					DabbaPointsUsed: order.attributes.DabbaPointsUsed,
					orderStatus: order.attributes.OrderStatus || 'ACCEPTED',
					PhoneNumber: order.attributes.PhoneNumber
				}))
			);

			setData(flattenedData);
		} catch (error) {
			console.error('Error fetching orders:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleExportData = () => {
		const exportData = data.map(row => ({
			'Menu Item': row.menuItem,
			Quantity: row.quantity,
			'Customer Name': row.customerName,
			'Company Name': row.companyName,
			'Delivery Address': row.deliveryAddress,
			'Order Status': row.orderStatus
		}));

		const csv = generateCsv(csvConfig)(exportData);
		download(csvConfig)(csv);
	};

	const handleDateChange = (newDate: moment.Moment | null) => {
		if (newDate) {
			setSelectedDate(newDate);
			fetchOrders(newDate);
		}
	};

	const columns = useMemo<MRT_ColumnDef<FlattenedOrderData>[]>(
		() => [
			{
				accessorKey: 'menuItem',
				header: 'Menu Item',
				size: 200
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				size: 120
			},
			{
				accessorKey: 'customerName',
				header: 'Customer Name',
				size: 150
			},
			{
				accessorKey: 'PhoneNumber',
				header: 'Phone number',
				size: 100
			},
			{
				accessorKey: 'companyName',
				header: 'Company Name',
				size: 150
			},
			{
				accessorKey: 'deliveryAddress',
				header: 'Delivery Address',
				size: 200
			},
			{
				accessorKey: 'DabbaPointsUsed',
				header: 'Dabba Points Used',
				size: 100
			},

			{
				accessorKey: 'orderStatus',
				header: 'Order Status',
				size: 150,
				Cell: ({ cell }) => {
					const status = cell.getValue<string>();
					const config = orderStatusConfig[status] || { color: 'default', label: status };

					return (
						<Chip
							label={config.label}
							color={config.color}
							size='small'
							sx={{
								minWidth: '100px',
								'& .MuiChip-label': {
									fontSize: '0.75rem',
									fontWeight: 500
								}
							}}
						/>
					);
				}
			}
		],
		[]
	);

	const handleStatusUpdate = async () => {
		try {
			const selectedRows = Object.keys(rowSelection).map(index => data[parseInt(index)]);
			const uniqueOrderIds = Array.from(new Set(selectedRows.map(row => row.orderId)));

			// Group selected rows by order ID
			const orderGroups = uniqueOrderIds.reduce(
				(acc, orderId) => {
					acc[orderId] = selectedRows.filter(row => row.orderId === orderId);
					return acc;
				},
				{} as Record<number, FlattenedOrderData[]>
			);

			await Promise.all(
				uniqueOrderIds.map(async orderId => {
					// First, get the complete order details to access GrandTotal
					const orderDetailsResponse = await fetch(
						`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders/${orderId}?populate=*`,
						{
							method: 'GET',
							headers: { 'Content-Type': 'application/json' }
						}
					);

					if (!orderDetailsResponse.ok) {
						throw new Error('Failed to fetch order details');
					}

					const orderDetails = await orderDetailsResponse.json();
					const grandTotal = parseFloat(orderDetails.data.attributes.TotalItemContributingPrice);
					const customerUid = orderDetails.data.attributes.UiD;

					// Update order status
					await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders/${orderId}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							data: {
								OrderStatus: selectedStatus,
								isOrderCompleted: selectedStatus === ORDER_STATUS.DELIVERED,
								isOrderCancelled: selectedStatus === ORDER_STATUS.CANCELLED
							}
						})
					});

					if (selectedStatus === ORDER_STATUS.CANCELLED && customerUid) {
						const refundPoints = calculateRefundPoints(grandTotal);

						try {
							// Update customer's Dabba Points
							await updateDabbaPoints(customerUid, refundPoints, 'increment');
						} catch (error) {
							console.error('Error refunding points:', error);
						}
						const orderResponse = await fetch(
							`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders/${orderId}?populate[MenuItems][populate]=LabelImage`,
							{
								method: 'GET',
								headers: { 'Content-Type': 'application/json' }
							}
						);

						const orderData: SingleOrderApiReturnType = await orderResponse.json();

						const deletionPromises = orderData.data.attributes.MenuItems.flatMap(
							(item: SingleOrderMenuItem) =>
								item.LabelImage.data.map(
									async (labelImage: SingleOrderItemImageData) =>
										await fetch(
											`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/upload/files/${labelImage.id}`,
											{
												method: 'DELETE',
												headers: { 'Content-Type': 'application/json' }
											}
										)
								)
						);

						const responses = await Promise.all(deletionPromises);
						responses.forEach((response, index) => {
							if (!response.ok) {
								console.error(`Deletion failed for promise at index ${index}`);
							}
						});
					}

					// Email notification logic remains unchanged
					// Get order details for email
					const orderRows = orderGroups[orderId];
					const orderItems = orderRows.map(row => ({
						menuItem: row.menuItem,
						quantity: row.quantity
					}));

					// Send status update email notifications
					await fetch('/api/sendEmail-status-update', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							userDetails: {
								email: orderRows[0].customerEmail,
								customerName: orderRows[0].customerName,
								orderItems,
								newStatus: orderStatusConfig[selectedStatus].label,
								deliveryAddress: orderRows[0].deliveryAddress,
								companyName: orderRows[0].companyName
							},
							adminDetails: {
								orderItems,
								customerName: orderRows[0].customerName,
								newStatus: orderStatusConfig[selectedStatus].label,
								deliveryAddress: orderRows[0].deliveryAddress,
								companyName: orderRows[0].companyName
							}
						})
					});

					// await fetch('/api/sendWhatsApp-status-update', {
					// 	method: 'POST',
					// 	headers: { 'Content-Type': 'application/json' },
					// 	body: JSON.stringify({
					// 		contactNumbers: ['+4915778559164'],
					// 		templateId: 3,
					// 		senderNumber: `${orderRows[0].PhoneNumber}`
					// 	})
					// });
				})
			).catch(error => {
				console.error('Error updating status:', error);
			});

			if (selectedDate) {
				await fetchOrders(selectedDate);
			}

			setRowSelection({});
			setIsStatusUpdateOpen(false);
			setSelectedStatus('');
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	return (
		<Box sx={{ p: 2 }}>
			<Stack spacing={2}>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DatePicker
						label='Select Date'
						value={selectedDate}
						onChange={handleDateChange}
						sx={{ width: 200 }}
					/>
				</LocalizationProvider>

				<MaterialReactTable
					columns={columns}
					data={data}
					state={{
						isLoading,
						globalFilter,
						rowSelection
					}}
					enableRowSelection
					// Here we disable selection for orders that are already Cancelled.
					muiSelectCheckboxProps={({ row }) => ({
						disabled: row.original.orderStatus === 'CANCELLED'
					})}
					onRowSelectionChange={setRowSelection}
					enableGlobalFilter={true}
					onGlobalFilterChange={setGlobalFilter}
					enableColumnActions={false}
					enableColumnFilters={true}
					enablePagination={true}
					enableSorting={true}
					muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
					renderTopToolbarCustomActions={({ table }) => (
						<Box sx={{ display: 'flex', gap: '1rem', p: '4px', alignItems: 'center' }}>
							<Button
								color='primary'
								onClick={handleExportData}
								startIcon={<FileDownloadIcon />}
								variant='contained'
							>
								Export Data
							</Button>
							{table.getSelectedRowModel().rows.length > 0 && (
								<Button
									color='primary'
									onClick={() => setIsStatusUpdateOpen(true)}
									variant='contained'
								>
									Update Status ({table.getSelectedRowModel().rows.length})
								</Button>
							)}
						</Box>
					)}
				/>

				{/* Status Update Dialog */}
				<Dialog
					open={isStatusUpdateOpen}
					onClose={() => setIsStatusUpdateOpen(false)}
					maxWidth='xs'
					fullWidth
				>
					<DialogTitle>Update Order Status</DialogTitle>
					<DialogContent>
						<FormControl
							fullWidth
							sx={{ mt: 2 }}
						>
							<InputLabel id='status-select-label'>Status</InputLabel>
							<Select
								labelId='status-select-label'
								value={selectedStatus}
								label='Status'
								onChange={e => setSelectedStatus(e.target.value)}
							>
								{Object.entries(orderStatusConfig).map(([value, config]) => (
									<MenuItem
										key={value}
										value={value}
									>
										<Chip
											label={config.label}
											color={config.color}
											size='small'
											sx={{ mr: 1 }}
										/>
										{config.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setIsStatusUpdateOpen(false)}>Cancel</Button>
						<Button
							onClick={handleStatusUpdate}
							variant='contained'
							disabled={!selectedStatus}
						>
							Update
						</Button>
					</DialogActions>
				</Dialog>
			</Stack>
		</Box>
	);
};

export default OrderAll;
