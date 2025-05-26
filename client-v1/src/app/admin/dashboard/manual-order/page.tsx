'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
	TextField,
	Grid,
	Box,
	Typography,
	FormControlLabel,
	Checkbox,
	FormControl,
	InputLabel,
	Chip,
	MenuItem,
	Select,
	Radio,
	RadioGroup,
	Autocomplete,
	Button,
	Snackbar,
	Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { dayWiseTabMenuApiEndPoint, ORDER_STATUS } from '@/lib/constants';
import { DayCart } from '@/store/slices/cart-slice';
import { convertMenuItemToOrderItemType } from '@/lib/helper';

interface MenuItemType {
	id: number;
	name: string;
	price: number;
}

interface CompanyType {
	companyName: string;
	address: string;
}

interface SelectedItemType extends MenuItemType {
	quantity: number;
}

const ManualOrder: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
	const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
	const [selectedItems, setSelectedItems] = useState<SelectedItemType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [deliveryDate, setDeliveryDate] = useState<Dayjs | null>(null);
	const [menuType, setMenuType] = useState<'dateWise' | 'all'>('dateWise');
	const [companies, setCompanies] = useState<CompanyType[]>([]);
	const [selectedCompany, setSelectedCompany] = useState<string>('');
	const [selectedAddress, setSelectedAddress] = useState<string>('');
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [toastOpen, setToastOpen] = useState(false);

	const fetchMenuItems = useCallback(
		async (dayIndex?: number) => {
			try {
				setIsLoading(true);
				let endPoint = '';

				if (menuType === 'dateWise') {
					endPoint = `${dayWiseTabMenuApiEndPoint[dayIndex || 0]}?populate=MenuItem`;
				} else {
					endPoint = '/menu-items?populate=*&pagination[page]=1&pagination[pageSize]=1000';
				}

				const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}${endPoint}`);
				const data = await response.json();

				let formattedMenu: MenuItemType[] = [];

				if (menuType === 'dateWise') {
					formattedMenu = data.data.map((item: any) => {
						const menuItem = item.attributes.MenuItem.data;
						return {
							id: menuItem.id,
							name: menuItem.attributes.Name,
							price: menuItem.attributes.OriginalPrice
						};
					});
				} else {
					formattedMenu = data.data.map((item: any) => ({
						id: item.id,
						name: item.attributes.Name,
						price: item.attributes.OriginalPrice
					}));
				}

				setMenuItems(formattedMenu);
			} catch (error) {
				console.error('Error fetching menu items:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[menuType]
	);

	useEffect(() => {
		if (menuType === 'all') fetchMenuItems();
	}, [menuType, fetchMenuItems]);

	const handleDateChange = (date: Dayjs | null) => {
		setSelectedDate(date);
		if (date && menuType === 'dateWise') {
			fetchMenuItems(date.day());
		}
	};

	const handleMenuTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMenuType(event.target.value as 'dateWise' | 'all');
		setMenuItems([]);
		setSelectedItems([]);
	};

	const handleQuantityChange = (id: number, value: string) => {
		// Convert to number and handle empty string case
		const quantity = value === '' ? 0 : parseInt(value, 10);

		// Update the item with the new quantity (could be 0)
		setSelectedItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)));
	};

	const calculateGrandTotal = () => {
		return selectedItems.reduce((total, item) => total + item.price * (item.quantity || 0), 0).toFixed(2);
	};

	const fetchCompanies = useCallback(async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/available-deliveries`);
			const data = await response.json();
			const formattedCompanies = data.data.map((item: any) => ({
				companyName: item.attributes.CompanyName,
				address: `${item.attributes.CompanyName}, ${item.attributes.StreetName || ''}, ${item.attributes.StreetNumber || ''}, ${item.attributes.PostalCode || ''}`
			}));
			setCompanies(formattedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	}, []);

	useEffect(() => {
		fetchCompanies();
	}, [fetchCompanies]);

	const formatCartDataForConversion = async (
		selectedItems: SelectedItemType[],
		deliveryDate: Dayjs | null
	): Promise<{ [key: number]: DayCart }> => {
		if (!deliveryDate) return {};

		// Filter out items with quantity 0
		const validItems = selectedItems.filter(item => item.quantity > 0);

		// Fetch full menu item details for each selected item
		const menuItemDetailsPromises = validItems.map(async item => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/menu-items/${item.id}?populate=*`
			);
			const data = await response.json();
			return {
				quantity: item.quantity,
				menuItem: data.data
			};
		});

		const menuItemDetails = await Promise.all(menuItemDetailsPromises);

		return {
			0: {
				items: menuItemDetails.map(({ quantity, menuItem }) => ({
					quantity,
					endpointIndex: 0,
					data: {
						id: menuItem.id,
						attributes: {
							Name: menuItem.attributes.Name,
							OriginalPrice: menuItem.attributes.OriginalPrice,
							OfferedPrice: menuItem.attributes.OfferedPrice || 0,
							Description: menuItem.attributes.Description || '',
							ItemImage: menuItem.attributes.ItemImage || { data: {} },
							Allergens: menuItem.attributes.Allergens || { data: [] },
							Categories: menuItem.attributes.Categories || { data: { attributes: { Title: '' } } },
							FoodPreference: menuItem.attributes.FoodPreference || {
								data: { attributes: { Title: '' } }
							},
							SpiceLevel: menuItem.attributes.SpiceLevel || { data: { attributes: { Title: '' } } },
							createdAt: menuItem.attributes.createdAt || '',
							updatedAt: menuItem.attributes.updatedAt || '',
							publishedAt: menuItem.attributes.publishedAt || '',
							isMenuOutOfStock: menuItem.attributes.isMenuOutOfStock || false
						}
					}
				})),
				deliveryDate: deliveryDate.format('DD/MM/YYYY'),
				deliveryTime: '09:00 - 17:00'
			}
		};
	};

	const handleSubmit = async () => {
		try {
			if (!deliveryDate) {
				console.error('Delivery date is required');
				return;
			}

			// Validate that all items have quantities greater than 0
			const validItems = selectedItems.filter(item => item.quantity > 0);
			if (validItems.length === 0) {
				console.error('No valid items selected (all quantities are 0)');
				return;
			}

			setIsLoading(true);

			// Format the cart data - now awaiting the async function
			const cartData = await formatCartDataForConversion(validItems, deliveryDate);

			// Get formatted menu items with label images
			const menuItems = await convertMenuItemToOrderItemType(
				cartData,
				0,
				deliveryDate.format('DD/MM/YYYY'),
				`${firstName} ${lastName}`,
				selectedAddress
			);

			// Upload images to Strapi and get the updated menu items
			const itemsWithUploadedImages = await Promise.all(
				menuItems.map(async item => {
					if (item.LabelImage) {
						try {
							if (Array.isArray(item.LabelImage)) {
								const uploadedMedias = await Promise.all(
									item.LabelImage.map(async file => {
										const formData = new FormData();
										formData.append('files', file);

										const response = await fetch(
											`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/upload`,
											{
												method: 'POST',
												body: formData
											}
										);

										if (!response.ok) {
											throw new Error('Failed to upload image');
										}

										const uploadedMedia = await response.json();
										return uploadedMedia[0];
									})
								);
								return { ...item, LabelImage: uploadedMedias };
							}
						} catch (error) {
							console.error('Error uploading LabelImage:', error);
						}
					}
					return item;
				})
			);

			// Create the order payload
			const payload = {
				data: {
					Name: `${firstName} ${lastName}`,
					PhoneNumber: phoneNumber || 'N/A',
					Email: email || 'N/A',
					Address: selectedAddress,
					isOrderCancelled: false,
					isOrderCompleted: false,
					MenuItems: itemsWithUploadedImages,
					deliveryDate: deliveryDate.toISOString(),
					GrandTotal: calculateGrandTotal(),
					OrderStatus: ORDER_STATUS.ACCEPTED,
					DabbaPointsUsed: 0,
					TotalItemContributingPrice: calculateGrandTotal()
				}
			};

			// Submit the order to Strapi
			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error('Failed to create order');
			}

			const data = await response.json();
			console.log('Order created successfully:', data);
			resetForm();
			setToastOpen(true);
		} catch (error) {
			console.error('Error in handleSubmit:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setSelectedDate(null);
		setMenuItems([]);
		setSelectedItems([]);
		setDeliveryDate(null);
		setMenuType('dateWise');
		setSelectedCompany('');
		setSelectedAddress('');
		setFirstName('');
		setLastName('');
		setEmail('');
		setPhoneNumber('');
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box>
				<Typography
					variant='h4'
					gutterBottom
				>
					Create Manual Order
				</Typography>

				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							fullWidth
							label='First Name'
							variant='outlined'
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							fullWidth
							label='Last Name'
							variant='outlined'
							value={lastName}
							onChange={e => setLastName(e.target.value)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							fullWidth
							label='Phone Number'
							variant='outlined'
							value={phoneNumber}
							onChange={e => setPhoneNumber(e.target.value)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							fullWidth
							label='Email Id'
							variant='outlined'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Autocomplete
							options={companies.map(c => c.companyName)}
							value={selectedCompany}
							onChange={(_, value) => setSelectedCompany(value || '')}
							renderInput={params => (
								<TextField
									{...params}
									label='Company Name'
								/>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Autocomplete
							options={companies.filter(c => c.companyName === selectedCompany).map(c => c.address)}
							value={selectedAddress}
							onChange={(_, value) => setSelectedAddress(value || '')}
							renderInput={params => (
								<TextField
									{...params}
									label='Address'
								/>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<DatePicker
							label='Delivery Date'
							value={deliveryDate}
							onChange={setDeliveryDate}
						/>
					</Grid>

					<Grid
						item
						md={12}
						px={3}
						pt={3}
					>
						<FormControl component='fieldset'>
							<Typography variant='h6'>Select Menu Type</Typography>
							<RadioGroup
								row
								value={menuType}
								onChange={handleMenuTypeChange}
							>
								<FormControlLabel
									value='dateWise'
									control={<Radio />}
									label='Day Wise Menu'
								/>
								<FormControlLabel
									value='all'
									control={<Radio />}
									label='Whole Menu'
								/>
							</RadioGroup>
						</FormControl>
					</Grid>

					{menuType === 'dateWise' && (
						<Grid
							item
							xs={6}
							md={6}
						>
							<DatePicker
								label='Select Item Date'
								value={selectedDate}
								onChange={handleDateChange}
							/>
						</Grid>
					)}

					<Grid
						item
						xs={12}
					>
						<Typography variant='h6'>Menu Items</Typography>
						<FormControl fullWidth>
							<InputLabel>Select Menu Items</InputLabel>
							<Select
								multiple
								value={selectedItems.map(item => item.id)}
								onChange={event => {
									const selectedIds = event.target.value as number[];

									// Keep existing items with their quantities
									const existingItems = selectedItems.filter(item => selectedIds.includes(item.id));

									// Add new items with quantity defaulted to 1
									const newItemIds = selectedIds.filter(
										id => !selectedItems.some(item => item.id === id)
									);

									const newItems = menuItems
										.filter(item => newItemIds.includes(item.id))
										.map(item => ({ ...item, quantity: 1 }));

									// Combine existing and new items
									setSelectedItems([...existingItems, ...newItems]);
								}}
								renderValue={selected => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{selected.map(id => {
											const item = menuItems.find(i => i.id === id);
											return item ? (
												<Chip
													key={id}
													label={item.name}
												/>
											) : null;
										})}
									</Box>
								)}
								MenuProps={{
									PaperProps: {
										style: {
											maxHeight: 300,
											overflow: 'auto'
										}
									}
								}}
							>
								{menuItems.map(item => (
									<MenuItem
										key={item.id}
										value={item.id}
									>
										<Checkbox checked={selectedItems.some(i => i.id === item.id)} />
										{item.name} - €{item.price}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					{selectedItems.map(item => (
						<Grid
							key={item.id}
							item
							xs={12}
							md={6}
						>
							<TextField
								fullWidth
								label={`Quantity for ${item.name}`}
								type='number'
								value={item.quantity || ''}
								onChange={e => handleQuantityChange(item.id, e.target.value)}
								InputProps={{
									inputProps: { min: 0 }
								}}
							/>
						</Grid>
					))}

					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							fullWidth
							label='Grand Total'
							variant='outlined'
							value={`€${calculateGrandTotal()}`}
							InputProps={{
								readOnly: true
							}}
						/>
					</Grid>
					<Grid
						item
						xs={12}
					>
						<Button
							variant='contained'
							color='primary'
							onClick={handleSubmit}
							disabled={isLoading || selectedItems.filter(item => item.quantity > 0).length === 0}
						>
							{isLoading ? 'Submitting...' : 'Submit Order'}
						</Button>
					</Grid>
				</Grid>
				<Snackbar
					open={toastOpen}
					autoHideDuration={4000}
					onClose={() => setToastOpen(false)}
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				>
					<Alert
						onClose={() => setToastOpen(false)}
						severity='success'
						sx={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}
					>
						Order placed successfully!
					</Alert>
				</Snackbar>
			</Box>
		</LocalizationProvider>
	);
};

export default ManualOrder;
