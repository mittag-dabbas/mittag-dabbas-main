import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	Tabs,
	Tab,
	Stack,
	Select,
	MenuItem,
	useTheme,
	useMediaQuery,
	SelectChangeEvent
} from '@mui/material';
import { useAppSelector } from '@/store/store';
import UpcomingOrders from './upcoming-orders';
import CompletedOrders from './completed-orders';
import CancelledOrders from './cancelled-orders';

const Orders: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [tabValue, setTabValue] = useState(0);
	const [dateRange, setDateRange] = useState('Last 3 months');
	const [orders, setOrders] = useState<any | null>(null);

	const renderTabContent = () => {
		switch (tabValue) {
			case 0:
				return <UpcomingOrders tabValue={tabValue} />;
			case 1:
				return <CompletedOrders tabValue={tabValue} />;
			case 2:
				return <CancelledOrders tabValue={tabValue} />;
			default:
				return null;
		}
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
		setDateRange(event.target.value);
	};

	return (
		<Box>
			<Box
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius
				}}
			>
				<Stack
					direction={isMobile ? 'column' : 'row'}
					justifyContent='space-between'
					alignItems='center'
					sx={{ p: 2 }}
				>
					<Box>
						<Typography variant='h6'>My Orders</Typography>
						<Typography variant='body2'>View and manage all your orders.</Typography>
					</Box>

					<Stack
						direction='row'
						spacing={1}
						sx={{ mt: isMobile ? 2 : 0 }}
					>
						<Select
							value={dateRange}
							onChange={handleDateRangeChange}
							sx={{ borderRadius: theme.shape.borderRadius, height: 40 }}
						>
							<MenuItem value='Last 3 months'>Last 3 months</MenuItem>
							<MenuItem value='Last 6 months'>Last 6 months</MenuItem>
							<MenuItem value='Last 1 year'>Last 1 year</MenuItem>
						</Select>
					</Stack>
				</Stack>

				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label='Order tabs'
					sx={{ mt: 2, borderBottom: 1, borderColor: 'divider' }}
					TabIndicatorProps={{
						style: { backgroundColor: theme.palette.primary.main }
					}}
				>
					<Tab
						label='Upcoming'
						sx={{ textTransform: 'none', fontWeight: 600 }}
					/>
					<Tab
						label='Completed'
						sx={{ textTransform: 'none', fontWeight: 600 }}
					/>
					<Tab
						label='Cancelled'
						sx={{ textTransform: 'none', fontWeight: 600 }}
					/>
				</Tabs>
			</Box>

			<Box sx={{ mt: 2 }}>{renderTabContent()}</Box>
		</Box>
	);
};

export default Orders;
