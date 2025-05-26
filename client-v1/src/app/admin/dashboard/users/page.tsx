'use client';

import { Box, TextField, Button } from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';

interface FlattenedUserData {
	customerName: string;
	customerEmail: string;
	companyName?: string;
	deliveryAddress?: string;
	DabbaPointsUsed?: number;
	customerPhoneNumber: number;
}

const csvConfig = mkConfig({
	fieldSeparator: ',',
	decimalSeparator: '.',
	useKeysAsHeaders: true
});

const Users = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState<FlattenedUserData[]>([]);
	const [allUsers, setAllUsers] = useState<FlattenedUserData[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState<string | null>(null);

	const fetchAllUsers = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?populate=*&pagination[page]=1&pagination[pageSize]=1000`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}

			const result = await response.json();

			const formattedUsers = result.data.map((user: any) => ({
				customerName: `${user.attributes.FirstName || ''} ${user.attributes.LastName || ''}`.trim(),
				customerEmail: user.attributes.Email,
				companyName: user.attributes.CompanyName || 'N/A',
				deliveryAddress:
					user.attributes.customer_delivery_addresses?.data?.[0]?.attributes?.Address ||
					'No Address Provided',
				DabbaPointsUsed: user.attributes.orders?.data?.reduce((total: number, order: any) => {
					return total + (order.attributes.DabbaPointsUsed ? parseInt(order.attributes.DabbaPointsUsed) : 0);
				}, 0),
				customerPhoneNumber:
					user.attributes.customer_delivery_addresses?.data?.[0]?.attributes?.PhoneNumber || 'No Phone Number'
			}));

			setAllUsers(formattedUsers);
			setUsers(formattedUsers);
		} catch (error: any) {
			setError(error.message);
			console.error('Error fetching users:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	useEffect(() => {
		const filtered = allUsers.filter(user =>
			Object.values(user).some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
		);
		setUsers(filtered);
	}, [searchTerm, allUsers]);

	const columns = useMemo<MRT_ColumnDef<FlattenedUserData>[]>(
		() => [
			{
				accessorKey: 'customerName',
				header: 'Customer Name',
				size: 150
			},
			{
				accessorKey: 'customerEmail',
				header: 'Email',
				size: 200
			},
			{
				accessorKey: 'customerPhoneNumber',
				header: 'PhoneNumber',
				size: 200
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
			}
		],
		[]
	);

	const handleExportUsers = () => {
		const exportData = users.map(user => ({
			'Customer Name': user.customerName,
			Email: user.customerEmail,
			'Phone Number': user.customerPhoneNumber
		}));

		const csv = generateCsv(csvConfig)(exportData);
		download(csvConfig)(csv);
	};

	return (
		<Box sx={{ p: 2 }}>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<TextField
				label='Search'
				variant='outlined'
				size='small'
				sx={{ mb: 2 }}
				fullWidth
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
			/>
			<Button
				color='primary'
				onClick={handleExportUsers}
				startIcon={<FileDownloadIcon />}
				variant='contained'
				sx={{ mb: 2 }}
			>
				Export Users
			</Button>
			<MaterialReactTable
				columns={columns}
				data={users}
				state={{ isLoading }}
				enablePagination
				enableSorting
				manualPagination={false}
				enableGlobalFilter={false}
			/>
		</Box>
	);
};

export default Users;
