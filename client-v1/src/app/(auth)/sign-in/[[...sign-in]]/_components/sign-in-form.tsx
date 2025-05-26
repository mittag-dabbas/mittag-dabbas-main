'use client';

import Heading from '@/components/heading';
import { createSignInForm, signInForm } from '@/lib/form-schemas';
import { signInUsingEmailAndPassword, signInUsingGoogle } from '@/store/slices/auth-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
	Box,
	Stack,
	TextField,
	Button,
	Typography,
	InputAdornment,
	IconButton,
	useTheme,
	useMediaQuery,
	Alert,
	Container
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Co2Sharp, Visibility, VisibilityOff } from '@mui/icons-material'; // Import eye icons
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { HOME, FORGOTPASSWORD, SIGN_UP } from '@/lib/constants';
import { CompanySubsidariesApiReturnType } from '@/types';
import { setCompanyDetails } from '@/store/slices/company-slice';
import { EmailToCompanySubsidaryDetails, findCompanySubsidaryDetailsByEmail, isUserNormal } from '@/lib/helper';

type SignInFormData = z.infer<typeof signInForm>;

const SignInForm = () => {
	const router = useRouter();
	const theme = useTheme();
	const searchParams = useSearchParams();
	const params = new URLSearchParams();
	const redirectUrl = searchParams.get('redirect');

	const dispatch = useAppDispatch();
	const { user, authError, loading } = useAppSelector(state => state.auth);
	const [showPassword, setShowPassword] = useState(false);
	const [companySubsidaries, setCompanySubsidaries] = useState<CompanySubsidariesApiReturnType>();

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInForm),
		mode: 'onBlur',
		reValidateMode: 'onChange'
	});

	// flush the auth error when the component is mounted
	useEffect(() => {
		dispatch({ type: 'auth/clearError' });
		getCompanySubsidaries();
	}, []);

	const handleGoogleSignIn = async () => {
		const result = await dispatch(signInUsingGoogle());
		if (result.meta.requestStatus === 'fulfilled' && !authError) {
			const payload = result.payload as { email: string };
			if (companySubsidaries) {
				if (isUserNormal(companySubsidaries, payload.email)) {
					// fetch the global discounts collection
					const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/discount-globals`);

					if (response.ok) {
						const discounts = await response.json();
						const discountValue = discounts.data[0] ? discounts.data[0].attributes.DiscountPercent : null;

						dispatch(
							setCompanyDetails({
								companyName: null,
								discountPercentage: discountValue ?? null,
								domain: null,
								menuItemPrice: null
							})
						);
					}
				} else {
					const companyDetails: EmailToCompanySubsidaryDetails = findCompanySubsidaryDetailsByEmail(
						payload.email,
						companySubsidaries
					);
					dispatch(
						setCompanyDetails({
							companyName: companyDetails.CompanyName ?? null,
							discountPercentage: companyDetails.DiscountPercent ?? null,
							domain: companyDetails.Domain ?? null,
							menuItemPrice: companyDetails.MenuItemPrice ?? null
						})
					);
				}
			}

			router.push(HOME);
		}
	};

	const onSubmit = async (data: SignInFormData) => {
		const result = await dispatch(signInUsingEmailAndPassword({ email: data.Email, password: data.Password }));
		if (result.meta.requestStatus === 'fulfilled' && !authError) {
			if (companySubsidaries) {
				// check if user is a normal user

				if (isUserNormal(companySubsidaries, data.Email)) {
					// fetch the global discounts collection
					const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/discount-globals`);

					if (response.ok) {
						const discounts = await response.json();
						const discountValue = discounts.data[0] ? discounts.data[0].attributes.DiscountPercent : null;

						dispatch(
							setCompanyDetails({
								companyName: null,
								discountPercentage: discountValue ?? null,
								domain: null,
								menuItemPrice: null
							})
						);
					}
				} else {
					let companyDetails: EmailToCompanySubsidaryDetails = findCompanySubsidaryDetailsByEmail(
						data.Email,
						companySubsidaries
					);

					dispatch(
						setCompanyDetails({
							companyName: companyDetails.CompanyName ?? null,
							discountPercentage: companyDetails.DiscountPercent ?? null,
							domain: companyDetails.Domain ?? null,
							menuItemPrice: companyDetails.MenuItemPrice ?? null
						})
					);
				}
			}

			redirectUrl ? router.push(redirectUrl) : router.push(HOME);
		}
	};

	const handleSignUp = () => {
		let signUpUrl = SIGN_UP;

		if (redirectUrl) {
			params.append('redirect', redirectUrl);
		}

		const queryString = params.toString();
		if (queryString) {
			signUpUrl += `?${queryString}`;
		}

		router.push(signUpUrl);
	};

	const getCompanySubsidaries = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/company-subsidaries?populate=*`
			);

			if (response.ok) {
				const data: CompanySubsidariesApiReturnType = await response.json();
				setCompanySubsidaries(data);
			}
		} catch (error) {
			console.error('Error fetching company subsidaries:', error);
		}
	};

	return (
		<Container
			sx={{
				width: '90%'
			}}
		>
			{/* Set max width for the form */}
			<Heading
				title='Welcome Back!'
				titleAlign='left'
				caption='Sign in to continue'
				captionAlign='left'
			/>

			<Box
				component='form'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				sx={{
					mt: 4
				}}
			>
				{/* Error message */}
				{authError && (
					<Stack
						sx={{
							mb: 2
						}}
					>
						<Alert severity='error'>{authError}</Alert>
					</Stack>
				)}
				<Stack spacing={2}>
					{/* email */}
					<Controller
						name='Email'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								label='Email'
								error={!!errors.Email}
								helperText={errors.Email?.message}
							/>
						)}
					/>

					{/* password */}
					<Controller
						name='Password'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								label='Password'
								type={showPassword ? 'text' : 'password'} // Toggle password visibility
								error={!!errors.Password}
								helperText={errors.Password?.message}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={() => setShowPassword(!showPassword)}
													edge='end'
												>
													{showPassword ? (
														<Visibility fontSize='small' />
													) : (
														<VisibilityOff fontSize='small' />
													)}
												</IconButton>
											</InputAdornment>
										)
									}
								}}
							/>
						)}
					/>

					{/* Forgot Password Button */}
					<Button
						variant='text'
						color='primary'
						size='small'
						disableTouchRipple
						sx={{
							textDecoration: 'underline',
							fontWeight: 'bold',
							width: 'fit-content',
							alignSelf: 'flex-end',

							':hover': {
								textDecoration: 'underline',
								backgroundColor: 'transparent'
							}
						}}
						onClick={() => {
							// Get the email value from the form control
							const email = control._formValues.Email || '';
							router.push(`${FORGOTPASSWORD}?email=${encodeURIComponent(email)}`);
						}}
					>
						Forgot Password?
					</Button>
				</Stack>

				<Stack
					spacing={2}
					sx={{ mt: 4 }}
				>
					{/* Sign In Button */}
					<LoadingButton
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						loading={loading}
					>
						Sign In
					</LoadingButton>

					{/* Sign In with Google Button */}
					<LoadingButton
						fullWidth
						variant='outlined'
						color='primary'
						loading={loading}
						onClick={handleGoogleSignIn}
						startIcon={
							<Image
								src='/assets/icons/google.svg'
								alt='Google icon'
								width={20}
								height={20}
							/>
						}
						sx={{
							textTransform: 'none',
							borderColor: theme.palette.grey[300]
						}}
					>
						Sign In with Google
					</LoadingButton>
				</Stack>

				{/* Sign Up Link */}
				<Stack
					direction={'row'}
					alignItems={'center'}
					justifyContent={'center'}
					sx={{
						mt: 4
					}}
				>
					<Typography
						variant='body1'
						color='textSecondary'
					>
						New to this site?
					</Typography>
					<Button
						variant='text'
						color='primary'
						size='small'
						disableTouchRipple
						sx={{
							fontWeight: 'bold',
							width: 'fit-content',
							alignSelf: 'flex-end',
							':hover': {
								backgroundColor: 'transparent'
							}
						}}
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default SignInForm;
