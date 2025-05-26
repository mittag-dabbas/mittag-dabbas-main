import { useAppSelector } from '@/store/store';
import { CustomerDetails } from '@/types';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Subsidiary from './subsidiary';
import { accountForm } from '@/lib/form-schemas';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';

type Props = {};

type ProfileFormInputs = z.infer<typeof accountForm>;

const Account = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { user } = useAppSelector(state => state.auth);
	const { companyName } = useAppSelector(state => state.company);
	const [userDetails, setUserDetails] = useState<CustomerDetails>();
	const [openDialog, setOpenDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<ProfileFormInputs>({
		resolver: zodResolver(accountForm)
	});

	useEffect(() => {
		if (user) {
			fetchUserDetails();
		}
	}, [user]);

	const fetchUserDetails = async () => {
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
				setUserDetails(data.data[0]);
				const userData = data.data[0];
				// Pre-fill form with existing user data
				setValue('FirstName', userData.attributes.FirstName);
				setValue('LastName', userData.attributes.LastName);
				setValue('PhoneNumber', userData.attributes.PhoneNumber || '');
				setValue('CompanyName', companyName || userData.attributes.CompanyName);
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	};

	const handleSaveProfile = async (data: ProfileFormInputs) => {
		try {
			setIsLoading(true);

			// Step 1: Update user details in Strapi
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers/${userDetails?.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ data })
				}
			);

			if (!response.ok) {
				console.error('Failed to save profile in Strapi');
				return;
			}

			// Step 2: Check if phone number changed and update in Brevo
			if (data.PhoneNumber && data.PhoneNumber !== userDetails?.attributes.PhoneNumber) {
				await updateBrevoContact(userDetails?.attributes.Email ?? '', data);
			}

			// Close dialog and refresh user details
			handleCloseDialog();
			fetchUserDetails();
		} catch (error) {
			console.error('Error saving profile:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to update Brevo contact
	const updateBrevoContact = async (email: string | undefined, updatedData: ProfileFormInputs) => {
		if (!email) {
			console.error('Error: Email is required to update Brevo contact');
			return;
		}

		try {
			// Ensure the phone number is formatted correctly (optional)
			const formattedPhoneNumber = updatedData.PhoneNumber?.replace(/\D/g, ''); // Removes non-numeric characters

			const response = await fetch(
				`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY || ''
					},
					body: JSON.stringify({
						attributes: {
							EMAIL: email,
							FIRSTNAME: updatedData.FirstName,
							LASTNAME: updatedData.LastName,
							SMS: formattedPhoneNumber,
							WHATSAPP: formattedPhoneNumber
						}
					})
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				console.error('Failed to update Brevo:', errorResponse);
			} else {
				console.log('Brevo contact updated successfully');
			}
		} catch (error) {
			console.error('Error updating Brevo contact:', error);
		}
	};

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<>
			<Box
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					p: 2
				}}
			>
				<Box>
					<Stack
						direction={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Typography variant='h6'>My Account</Typography>
							<Typography variant='body2'>
								Join date: {moment(userDetails?.attributes.createdAt).format('MMM DD, YYYY')}
							</Typography>
						</Box>

						<Button
							variant='contained'
							startIcon={
								<Image
									src={'/assets/icons/pencil.svg'}
									alt='Edit Account'
									width={20}
									height={20}
								/>
							}
							onClick={handleOpenDialog}
						>
							Edit Profile
						</Button>
					</Stack>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box>
					<Box>
						<Typography variant='subtitle1'>Display Info</Typography>
						<Typography variant='body2'>
							This information will be visible to all members of this site.
						</Typography>
					</Box>
					<Box sx={{ mt: 2 }}>
						<Typography variant='body2'>Display Name</Typography>
						<Typography variant='subtitle1'>
							{userDetails?.attributes.FirstName} {userDetails?.attributes.LastName}
						</Typography>
					</Box>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box>
					<Typography variant='subtitle1'>Personal info</Typography>
					<Typography variant='body2'>Update your personal information.</Typography>
				</Box>
				<Stack
					direction={isMobile ? 'column' : 'row'}
					justifyContent={'space-between'}
					alignItems={'flex-start'}
					sx={{
						mt: 2,
						'& > div': {
							width: '100%'
						}
					}}
				>
					<Box sx={{ mt: 2 }}>
						<Typography variant='body2'>First Name</Typography>
						<Typography
							variant='subtitle1'
							sx={{ color: userDetails?.attributes.FirstName ? 'inherit' : theme.palette.error.main }}
						>
							{userDetails?.attributes.FirstName || 'Add your First Name'}
						</Typography>
					</Box>
					<Box sx={{ mt: 2 }}>
						<Typography variant='body2'>Last Name</Typography>
						<Typography
							variant='subtitle1'
							sx={{ color: userDetails?.attributes.LastName ? 'inherit' : theme.palette.error.main }}
						>
							{userDetails?.attributes.LastName || 'Add your Last Name'}
						</Typography>
					</Box>
					<Box sx={{ mt: 2 }}>
						<Typography variant='body2'>Phone</Typography>
						<Typography
							variant='subtitle1'
							sx={{ color: userDetails?.attributes.PhoneNumber ? 'inherit' : theme.palette.error.main }}
						>
							{userDetails?.attributes.PhoneNumber || 'Add your Phone Number'}
						</Typography>
					</Box>
				</Stack>

				<Divider sx={{ my: 2 }} />

				<Box sx={{ my: 2 }}>
					<Subsidiary
						userCompanyName={companyName ?? userDetails?.attributes.CompanyName}
						isSubsidairy={companyName}
					/>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box>
					<Typography variant='subtitle1'>Login info</Typography>
					<Typography variant='body2'>View your login email.</Typography>
				</Box>
				<Box sx={{ mt: 2 }}>
					<Typography variant='body2'>Login Email</Typography>
					<Typography variant='subtitle1'>{userDetails?.attributes.Email}</Typography>
				</Box>
			</Box>

			{/* Dialog for Editing Profile */}
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				PaperProps={{
					sx: {
						backgroundColor: theme.palette.background.default,
						borderRadius: theme.shape.borderRadius
					}
				}}
			>
				<DialogTitle>
					<Stack
						direction={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Typography variant='h6'>Edit Profile</Typography>
						<IconButton onClick={handleCloseDialog}>
							<Image
								src='/assets/icons/close.svg'
								alt='Close'
								width={15}
								height={15}
							/>
						</IconButton>
					</Stack>
					<Divider />
				</DialogTitle>

				<DialogContent>
					<form onSubmit={handleSubmit(handleSaveProfile)}>
						<Box>
							<Typography variant='subtitle1'>Personal info</Typography>
							<Typography variant='body2'>Update your personal information.</Typography>
						</Box>
						<Stack
							direction={isMobile ? 'column' : 'row'}
							justifyContent={'space-between'}
							alignItems={'flex-start'}
							spacing={2}
							sx={{
								mt: 2
							}}
						>
							<Controller
								name='FirstName'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='First Name'
										fullWidth
										margin='dense'
										error={!!errors.FirstName}
										helperText={errors.FirstName?.message}
									/>
								)}
							/>
							<Controller
								name='LastName'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Last Name'
										fullWidth
										margin='dense'
										error={!!errors.LastName}
										helperText={errors.LastName?.message}
									/>
								)}
							/>
						</Stack>
						<Box sx={{ mt: 2 }}>
							<Controller
								name='PhoneNumber'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Phone'
										fullWidth
										margin='dense'
										error={!!errors.PhoneNumber}
										helperText={errors.PhoneNumber?.message}
									/>
								)}
							/>
						</Box>
						<Divider sx={{ my: 2 }} />

						<Box>
							<Typography variant='subtitle1'>Company info</Typography>
							<Typography variant='body2'>View the company subsidiary is available or not</Typography>
						</Box>

						<Controller
							name='CompanyName'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Company Name'
									fullWidth
									margin='dense'
									error={!!errors.CompanyName}
									helperText={errors.CompanyName?.message}
								/>
							)}
						/>

						<Divider sx={{ my: 2 }} />
						<DialogActions>
							<Stack
								direction={'row'}
								justifyContent={'space-between'}
								alignItems={'center'}
								sx={{ width: '100%' }}
							>
								<Button
									onClick={handleCloseDialog}
									variant='outlined'
								>
									Cancel
								</Button>
								<Button
									type='submit'
									color='primary'
									variant='contained'
								>
									Save
								</Button>
							</Stack>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Account;
