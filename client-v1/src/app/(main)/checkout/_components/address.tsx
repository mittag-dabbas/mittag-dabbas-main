'use client';

import { createStripeUrl } from '@/actions/user-payment';
import { CHECKOUT, SIGN_IN } from '@/lib/constants';
import { fetcher } from '@/lib/fetcher';
import { deliveryAddressForm } from '@/lib/form-schemas';
import { getGrandTotalAddingMWST } from '@/lib/helper';
import { setDefaultDeliveryAddress, setDeliveryAddress } from '@/store/slices/cart-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
	AvailableDeliveryAddress,
	AvailableDeliveryAddressesApiReturnType,
	CustomerDeliveryAddressData,
	CustomerDeliveryAddressDataAttributes,
	CustomerDetails
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
	Autocomplete,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Grid,
	IconButton,
	Radio,
	RadioGroup,
	Stack,
	Switch,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';

type Props = {};
type DeliveryFormInputs = z.infer<typeof deliveryAddressForm>;

const Address = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);
	const discount = useAppSelector(state => state.cart.discount);
	const { enqueueSnackbar } = useSnackbar();
	const [loader, setLoader] = useState(false);
	const [existingUserDetails, setExistingUserDetails] = useState<CustomerDetails>();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
	const [editingAddress, setEditingAddress] = useState<CustomerDeliveryAddressData | null>(null);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [addressOptions, setAddressOptions] = useState<string[]>([]);
	const [companyOptions, setCompanyOptions] = useState<string[]>([]);
	const [hasExistingAddresses, setHasExistingAddresses] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<DeliveryFormInputs>({
		resolver: zodResolver(deliveryAddressForm),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			email: user?.email || '',
			phoneNumber: user?.phoneNumber || '',
			companyName: '',
			Address: '',
			defaultAddress: false
		}
	});

	const { days, totalPrice, totalQuantity, defaultDeliveryAddress } = useAppSelector(state => state.cart);

	const { data } = useSWR<AvailableDeliveryAddressesApiReturnType>(
		`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/available-deliveries`,
		fetcher,
		{
			revalidateOnFocus: true,
			revalidateOnReconnect: true
		}
	);

	useEffect(() => {
		if (data?.data) {
			const companies = Array.from(new Set(data.data.map(item => item.attributes.CompanyName)));
			setCompanyOptions(companies);
		}
	}, [data]);

	const handleCompanyChange = (companyName: string) => {
		setValue('companyName', companyName);

		const addresses =
			data?.data
				.filter(item => item.attributes.CompanyName === companyName)
				.map(item => {
					const attr = item.attributes;
					const street = attr.StreetName ? `${attr.StreetName}, ` : '';
					const number = attr.StreetNumber ? `${attr.StreetNumber}, ` : '';
					return `${attr.CompanyName}, ${street}${number}${attr.PostalCode}`;
				}) || [];

		setAddressOptions(addresses);
		setValue('Address', '');
	};

	// Fetch existing user details
	const getExistingUserDetails = useCallback(async () => {
		if (!user?.uid) return;
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${user.uid}&populate=*`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			const data = await response.json();
			if (data?.data.length > 0) {
				setExistingUserDetails(data.data[0]);

				// Set hasExistingAddresses based on whether there are any addresses
				const hasAddresses = data.data[0]?.attributes.customer_delivery_addresses?.data.length > 0;
				setHasExistingAddresses(hasAddresses);

				// Rest of the existing code...
				const defaultAddress = data.data[0]?.attributes.customer_delivery_addresses?.data.find(
					(address: any) => address.attributes.isDefaultAddress
				);
				dispatch(
					setDefaultDeliveryAddress({
						defaultDeliveryAddress: defaultAddress?.attributes.Address || ''
					})
				);
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	}, [user?.uid]);

	useEffect(() => {
		getExistingUserDetails();
	}, [getExistingUserDetails]);

	// Function that runs when the form is successfully submitted
	const onSubmit = async (formData: DeliveryFormInputs) => {
		try {
			// Check if this is the first address or if default is required
			if (!hasExistingAddresses && !formData.defaultAddress) {
				enqueueSnackbar('Please set this address as default', { variant: 'error' });
				return;
			}

			if (editingAddress && existingUserDetails?.attributes.customer_delivery_addresses && editingAddress.id) {
				await updateUserAddress(editingAddress.id, formData);
				enqueueSnackbar('Address updated successfully', { variant: 'success' });
			} else {
				await postUserAddress(formData);
				enqueueSnackbar('Address added successfully', { variant: 'success' });
			}
			await getExistingUserDetails();
			handleCloseDialog();
		} catch (error) {
			enqueueSnackbar('Failed to submit address', { variant: 'error' });
			console.error('Error submitting address: ', error);
		}
	};

	// Post user address to the backend
	const postUserAddress = async (data: DeliveryFormInputs) => {
		// If new address is default, reset other addresses to not be default
		if (data.defaultAddress && existingUserDetails?.attributes.customer_delivery_addresses) {
			await Promise.all(
				existingUserDetails.attributes.customer_delivery_addresses.data.map(address =>
					fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-delivery-addresses/${address.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ data: { isDefaultAddress: false } })
					})
				)
			);
		}

		const body = {
			customer: [existingUserDetails?.id],
			CompanyName: data.companyName,
			Address: data.Address,
			PostalCode: data.Address.split(',').pop(),
			FirstName: data.firstName,
			LastName: data.lastName,
			PhoneNumber: data.phoneNumber,
			isDefaultAddress: data.defaultAddress
		};

		const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-delivery-addresses`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: body })
		});
		if (!response.ok) {
			throw new Error('Failed to post user address');
		}
		return response.json();
	};

	const updateUserAddress = async (id: number, data: DeliveryFormInputs) => {
		const body = {
			CompanyName: data.companyName,
			Address: data.Address,
			PostalCode: data.Address.split(',').pop(),
			FirstName: data.firstName,
			LastName: data.lastName,
			PhoneNumber: data.phoneNumber,
			isDefaultAddress: data.defaultAddress
		};

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-delivery-addresses/${id}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: body })
			}
		);
		if (!response.ok) {
			throw new Error('Failed to update address');
		}
	};

	const handleOpenDialog = (address?: CustomerDeliveryAddressData) => {
		if (address) {
			// Log the specific address attributes for debugging

			// Populate form fields with existing address data
			setValue('firstName', address.attributes ? address.attributes.FirstName : '');
			setValue('lastName', address.attributes ? address.attributes.LastName : '');
			setValue('email', user?.email || '');
			setValue('phoneNumber', address.attributes ? address.attributes.PhoneNumber : '');
			setValue('companyName', address.attributes ? address.attributes.CompanyName : '');
			setValue('Address', address.attributes ? address.attributes.Address : '');
			setValue('defaultAddress', address.attributes ? address.attributes.isDefaultAddress : false);

			// Set the address being edited
			setEditingAddress(address);
		} else {
			// Log that we're opening the dialog for a new address

			// Reset the form for adding a new address
			reset({
				firstName: user?.firstName || '',
				lastName: user?.lastName || '',
				email: user?.email || '',
				phoneNumber: user?.phoneNumber || '',
				companyName: '',
				Address: '',
				// Set defaultAddress to true if there are no existing addresses
				defaultAddress: !hasExistingAddresses
			});

			// Clear editing state
			setEditingAddress(null);
		}

		// Open the dialog
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	// Function to update the default address in Strapi
	const updateDefaultAddressInStrapi = async (selectedAddressId: number) => {
		if (!existingUserDetails) return;

		// Map through the addresses and set `isDefaultAddress` based on the selected address
		const updatedAddresses = existingUserDetails.attributes.customer_delivery_addresses.data.map(address => ({
			...address,
			isDefaultAddress: address.id === selectedAddressId
		}));

		try {
			// Send a PUT request to Strapi for each address to update the `isDefaultAddress` field
			const updateRequests = updatedAddresses.map(address =>
				fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-delivery-addresses/${address.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: { isDefaultAddress: address.isDefaultAddress } })
				})
			);

			await Promise.all(updateRequests);

			setExistingUserDetails(existing =>
				existing
					? {
							...existing,
							attributes: {
								...existing.attributes,
								customer_delivery_addresses: {
									data: [...updatedAddresses] // Create a new array to trigger re-render
								}
							}
						}
					: existing
			);

			// dispatch(setDefaultDeliveryAddress({ defaultDeliveryAddress:  }));

			enqueueSnackbar('Default address updated successfully', { variant: 'success' });
		} catch (error) {
			console.error('Error updating default address:', error);
			enqueueSnackbar('Failed to update default address', { variant: 'error' });
		}
	};

	// Handle toggle for setting the default address
	const handleDefaultAddressToggle = async (addressId: number) => {
		const isAlreadyDefault = existingUserDetails?.attributes.customer_delivery_addresses.data.some(
			addr => addr.id === addressId && addr.attributes.isDefaultAddress
		);
		if (!isAlreadyDefault) {
			await updateDefaultAddressInStrapi(addressId); // Ensure API updates
			await getExistingUserDetails(); // Refetch updated data
		}

		// Update Redux store
		dispatch(
			setDefaultDeliveryAddress({
				defaultDeliveryAddress:
					existingUserDetails?.attributes.customer_delivery_addresses.data.find(addr => addr.id === addressId)
						?.attributes.Address || ''
			})
		);
	};

	const handlePayment = async () => {
		try {
			setLoader(true);
			const stripeUrl = await createStripeUrl(
				days,
				totalQuantity,
				getGrandTotalAddingMWST(totalPrice, discount),
				user?.email
			);
			if (stripeUrl) {
				window.location.href = stripeUrl;
			} else {
				enqueueSnackbar('Failed to create Stripe URL', { variant: 'error' });
				throw new Error('No Stripe URL returned');
			}
		} catch (error) {
			console.error('Error creating Stripe URL:', error);
			enqueueSnackbar('Failed to create Stripe URL', { variant: 'error' });
		} finally {
			setLoader(false);
		}
	};

	// delete address
	const deleteAddress = async () => {
		if (addressToDelete === null || !existingUserDetails) return;

		const updatedAddresses = existingUserDetails.attributes.customer_delivery_addresses.data.filter(
			address => address.id !== Number(addressToDelete)
		);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-delivery-addresses/${addressToDelete}`,
				{
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) throw new Error('Failed to delete address');

			// Update state after successful deletion
			setExistingUserDetails({
				...existingUserDetails,
				attributes: {
					...existingUserDetails.attributes,
					customer_delivery_addresses: {
						data: updatedAddresses
					}
				}
			});

			enqueueSnackbar('Address deleted successfully', { variant: 'success' });
		} catch (error) {
			console.error('Error deleting address:', error);
			enqueueSnackbar('Failed to delete address', { variant: 'error' });
		} finally {
			handleCloseDeleteDialog(); // Close the dialog after deletion attempt
		}
	};

	// Function to handle opening the delete confirmation dialog
	const handleOpenDeleteDialog = (id: number) => {
		setAddressToDelete(id);
		setOpenDeleteDialog(true);
	};

	// Function to handle closing the delete confirmation dialog
	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
		setAddressToDelete(null);
	};

	return (
		<Box>
			{!user ? (
				<>
					<Box
						sx={{
							mt: 2
						}}
					>
						<Typography variant='h5'>You are not logged in</Typography>
						<Typography variant='body2'>Please login to place your order!</Typography>

						<LoadingButton
							variant='contained'
							sx={{
								mt: 2,
								width: '50%'
							}}
							onClick={() => router.push(`${SIGN_IN}?redirect=${encodeURIComponent(CHECKOUT)}`)}
						>
							Sign In
						</LoadingButton>
					</Box>
				</>
			) : (
				<>
					<Box>
						<Stack
							direction={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
						>
							{
								<Box>
									<Typography
										variant='h5'
										textTransform={'uppercase'}
									>
										Select a delivery address
									</Typography>
								</Box>
							}
						</Stack>

						<Dialog
							open={openDialog}
							onClose={handleCloseDialog}
							maxWidth='sm'
							fullWidth
							sx={{
								'& .MuiDialog-paper': {
									borderRadius: theme.shape.borderRadius,
									border: `1px solid ${theme.palette.divider}`,
									backgroundColor: theme.palette.background.default
								}
							}}
						>
							<DialogTitle sx={{ m: 0, p: 2 }}>
								{editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
								<IconButton
									aria-label='close'
									onClick={handleCloseDialog}
									sx={{ position: 'absolute', right: 8, top: 8 }}
								>
									<Image
										src='/assets/icons/close.svg'
										alt='Close'
										width={15}
										height={15}
									/>
								</IconButton>
							</DialogTitle>
							<Divider />

							<Box
								component='form'
								noValidate
								onSubmit={handleSubmit(onSubmit)}
								sx={{ mt: 2 }}
							>
								<DialogContent>
									<Grid
										container
										spacing={2}
									>
										{/* First Name and Last Name side by side */}
										<Grid
											item
											xs={12}
											sm={6}
										>
											<Controller
												name='firstName'
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														required
														label='First Name'
														margin='normal'
														error={!!errors.firstName}
														helperText={errors.firstName?.message}
													/>
												)}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
										>
											<Controller
												name='lastName'
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														required
														label='Last Name'
														margin='normal'
														error={!!errors.lastName}
														helperText={errors.lastName?.message}
													/>
												)}
											/>
										</Grid>

										{/* Email and Phone Number */}
										<Grid
											item
											xs={12}
											sm={6}
										>
											<Controller
												name='email'
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														required
														type='email'
														label='Email'
														margin='normal'
														disabled={!!user?.email}
														error={!!errors.email}
														helperText={errors.email?.message}
														sx={{ cursor: user?.email ? 'not-allowed' : 'auto' }}
													/>
												)}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
										>
											<Controller
												name='phoneNumber'
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														required
														label='Phone Number'
														margin='normal'
														disabled={!!user?.phoneNumber}
														error={!!errors.phoneNumber}
														helperText={errors.phoneNumber?.message}
													/>
												)}
											/>
										</Grid>

										{/* Autocomplete dropdown for Address */}
										<Grid
											item
											xs={12}
										>
											<Controller
												name='companyName'
												control={control}
												render={({ field }) => (
													<Autocomplete
														{...field}
														options={companyOptions}
														onChange={(_, value) => value && handleCompanyChange(value)}
														renderInput={params => (
															<TextField
																{...params}
																label='Company Name'
																margin='normal'
															/>
														)}
													/>
												)}
											/>
											<Grid
												item
												xs={12}
											>
												<Controller
													name='Address'
													control={control}
													render={({ field }) => (
														<Autocomplete
															{...field}
															options={addressOptions}
															onChange={(_, value) => field.onChange(value)}
															renderInput={params => (
																<TextField
																	{...params}
																	label='Address'
																	margin='normal'
																/>
															)}
														/>
													)}
												/>
											</Grid>

											{/* Default address switch */}
											<Grid
												item
												xs={12}
											>
												<Controller
													name='defaultAddress'
													control={control}
													render={({ field }) => (
														<Box>
															<FormControlLabel
																control={
																	<Switch
																		{...field}
																		checked={field.value}
																		disabled={
																			!hasExistingAddresses && !editingAddress
																		} // Disable toggle if it's first address
																	/>
																}
																label='Make this the default address'
																sx={{ mt: 2 }}
															/>
															{!hasExistingAddresses && !editingAddress && (
																<Typography
																	variant='body1'
																	color='primary'
																	sx={{ display: 'block', ml: 2 }}
																>
																	Your first address will automatically be set as
																	default
																</Typography>
															)}
														</Box>
													)}
												/>
											</Grid>
										</Grid>
									</Grid>
								</DialogContent>

								<DialogActions>
									<Button
										onClick={handleCloseDialog}
										variant='outlined'
									>
										Cancel
									</Button>
									<Button
										type='submit'
										variant='contained'
										disabled={!hasExistingAddresses && !control._formValues.defaultAddress}
									>
										{editingAddress ? 'Update Address' : 'Add Delivery'}
									</Button>
								</DialogActions>
							</Box>
						</Dialog>
					</Box>

					<Box>
						{/* RadioGroup for selecting default address */}
						{existingUserDetails?.attributes.customer_delivery_addresses &&
							existingUserDetails?.attributes.customer_delivery_addresses.data.map(
								(address: CustomerDeliveryAddressData) => (
									<Box
										sx={{
											border: `1px solid ${theme.palette.divider}`,
											borderRadius: theme.shape.borderRadius,
											p: 2,
											mt: 2
										}}
										key={address.id}
									>
										<Stack
											direction={isMobile ? 'column' : 'row'}
											spacing={2}
											justifyContent='space-between'
										>
											<Box>
												<Stack
													direction='row'
													spacing={1}
													alignItems={'center'}
													sx={{ mb: 1 }}
												>
													<Typography fontWeight='bold'>
														{address.attributes.FirstName +
															' ' +
															address.attributes.LastName}
													</Typography>
													{address.attributes.isDefaultAddress && (
														<Chip
															label='Default'
															color='warning'
															size='small'
															variant='outlined'
															sx={{
																// borderColor: theme.palette.warning.main,
																color: theme.palette.warning.dark,
																backgroundColor: theme.palette.warning.light,
																fontSize: theme.typography.subtitle2.fontSize
															}}
														/>
													)}
												</Stack>
												<Typography>{address.attributes.CompanyName}</Typography>
												<Typography>{existingUserDetails.attributes.Email}</Typography>
												<Typography>{address.attributes.Address}</Typography>
												<Typography>{address.attributes.PhoneNumber}</Typography>

												<Box
													display='flex'
													alignItems='center'
													mt={1}
												>
													<Switch
														checked={address.attributes.isDefaultAddress}
														onChange={() => handleDefaultAddressToggle(address.id)}
													/>
													<Typography ml={1}>Make this the default address</Typography>
												</Box>
											</Box>

											<Stack
												direction='row'
												spacing={1}
												justifyContent={isMobile ? 'flex-start' : 'flex-end'}
												alignItems='flex-start'
											>
												<Button
													variant='contained'
													onClick={() => {
														handleOpenDialog(address);
													}}
												>
													Edit
												</Button>
												<Button
													variant='outlined'
													onClick={() => handleOpenDeleteDialog(address.id)}
												>
													Remove
												</Button>
											</Stack>
										</Stack>
									</Box>
								)
							)}
					</Box>

					<Box
						sx={{
							mt: 2
						}}
					>
						<Button
							variant='outlined'
							fullWidth
							startIcon={
								<Image
									src={'/assets/icons/plus.svg'}
									alt={'Add'}
									width={20}
									height={20}
								/>
							}
							onClick={() => handleOpenDialog()}
							sx={{
								justifyContent: 'flex-start',
								border: `1px solid ${theme.palette.divider}`,
								p: 1.5
							}}
						>
							ADD NEW DELIVERY ADDRESS
						</Button>
					</Box>

					<Divider sx={{ mt: 3 }} />
					<Box
						sx={{
							mt: 2
						}}
					>
						<Typography variant='h5'>Review & place order</Typography>
						<Typography variant='body2'>
							Review your details above and continue when you're ready.
						</Typography>

						<LoadingButton
							variant='contained'
							sx={{
								mt: 2,
								width: '50%'
							}}
							onClick={handlePayment}
							loading={loader}
							disabled={existingUserDetails?.attributes.customer_delivery_addresses?.data.length === 0}
						>
							Place Order & Pay
						</LoadingButton>
					</Box>

					<Dialog
						open={openDeleteDialog}
						onClose={handleCloseDeleteDialog}
						maxWidth='xs'
						sx={{
							p: 2
						}}
						PaperProps={{
							elevation: 0,
							sx: {
								backgroundColor: theme.palette.background.default,
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: theme.shape.borderRadius
							}
						}}
					>
						<DialogTitle>
							<Stack
								direction='row'
								justifyContent='center'
								alignItems='center'
							>
								<Image
									src={'/assets/icons/delete.svg'}
									alt={'Warning'}
									width={50}
									height={50}
								/>
							</Stack>
						</DialogTitle>
						<DialogContent>
							<Typography
								variant='h5'
								align='center'
							>
								Delete Delivery Address?
							</Typography>
							<Typography
								variant='body1'
								align='center'
							>
								Are you sure you want to delete this address? This action cannot be undone, and you
								won't be able to use this address for future deliveries. This will remove the address
								permanently.
							</Typography>
						</DialogContent>
						<DialogActions
							sx={{
								justifyContent: 'space-between'
							}}
						>
							<Button
								onClick={handleCloseDeleteDialog}
								variant='outlined'
							>
								Cancel
							</Button>
							<Button
								onClick={deleteAddress}
								variant='contained'
							>
								Remove Address
							</Button>
						</DialogActions>
					</Dialog>
				</>
			)}
		</Box>
	);
};

export default Address;
