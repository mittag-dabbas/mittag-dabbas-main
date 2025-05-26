'use client';

import Heading from '@/components/heading';
import { signInForm, signUpForm, createSignUpForm } from '@/lib/form-schemas';
import {
	createUserUsingEmailAndPassword,
	signInUsingEmailAndPassword,
	signInUsingGoogle
} from '@/store/slices/auth-slice';
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
	Container,
	Checkbox
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Check, Visibility, VisibilityOff } from '@mui/icons-material'; // Import eye icons
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ACCOUNT, HOME, PROFILE, SIGN_IN } from '@/lib/constants';
import Link from 'next/link';
import { CompanySubsidariesApiReturnType } from '@/types';
import { setCompanyDetails } from '@/store/slices/company-slice';
import { EmailToCompanySubsidaryDetails, findCompanySubsidaryDetailsByEmail, isUserNormal } from '@/lib/helper';

type SignUpFormData = z.infer<typeof signUpForm>;

const SignUpForm = () => {
	const router = useRouter();
	const theme = useTheme();
	const searchParams = useSearchParams();
	const params = new URLSearchParams();
	const redirectUrl = searchParams.get('redirect');

	const dispatch = useAppDispatch();
	const { user, authError, loading } = useAppSelector(state => state.auth);
	const [showPassword, setShowPassword] = useState(false);
	const [companySubsidaries, setCompanySubsidaries] = useState<CompanySubsidariesApiReturnType>();

	const companyListedEmails = companySubsidaries?.data
		.map(item => item.attributes.Email.map(email => email.Email))
		.flat();

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpForm),
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
			// @ts-ignore
			const isUserNew = result.payload.createdAt === result.payload.lastLoginAt;

			redirectUrl
				? router.push(`${redirectUrl}&isUserNew=${isUserNew}`)
				: isUserNew
					? router.push(`${PROFILE}?tab=${ACCOUNT}`)
					: router.push(HOME);

			// if (redirectUrl) {
			// 	const urlParams = new URLSearchParams(redirectUrl);
			// 	urlParams.set('isUserNew', isUserNew.toString());
			// 	router.push(`${redirectUrl}?${urlParams.toString()}`);
			// } else {
			// 	isUserNew ? router.push(`${PROFILE}?tab=${ACCOUNT}`) : router.push(HOME);
			// }
		}
	};

	const onSubmit = async (data: SignUpFormData) => {
		const result = await dispatch(
			createUserUsingEmailAndPassword({
				email: data.Email,
				password: data.Password,
				fname: data.FirstName,
				lname: data.LastName
			})
		);

		type FirebaseAuthPayload = {
			createdAt: string;
			lastLoginAt: string;
		};

		type BrevoResponseType = {
			message?: string; // Optional because Brevo may not always return it
			id?: number; // ID of the created contact (if available)
			code?: number; // Error codes (if applicable)
		};

		if (result.meta.requestStatus === 'fulfilled' && !authError) {
			try {
				const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY as string // Ensure this is set in env variables
					},
					body: JSON.stringify({
						email: data.Email,
						listIds: [5],
						attributes: {
							FIRSTNAME: data.FirstName,
							LASTNAME: data.LastName
						},
						updateEnabled: true // 🔥 Ensures existing contacts are updated
					})
				});

				let brevoData: BrevoResponseType = {}; // Initialize with default empty object

				if (brevoResponse.status !== 204) {
					const textResponse = await brevoResponse.text();
					if (textResponse) {
						brevoData = JSON.parse(textResponse);
					}
				}

				if (!brevoResponse.ok) {
					console.error('❌ Brevo API Error:', brevoData);
					throw new Error(`Brevo Error: ${brevoData.message || 'Unknown error'}`);
				}
			} catch (error) {
				console.error('🔥 Brevo API Error:', error);
			}

			// ✅ Safely cast 'result.payload' to expected type
			const payload = result.payload as FirebaseAuthPayload;

			const isUserNew = payload.createdAt === payload.lastLoginAt;

			redirectUrl
				? router.push(`${redirectUrl}&isUserNew=${isUserNew}`)
				: isUserNew
					? router.push(`${PROFILE}?tab=${ACCOUNT}`)
					: router.push(HOME);
		}
	};

	const handleSignIn = () => {
		let signInUrl = SIGN_IN;

		if (redirectUrl) {
			params.append('redirect', redirectUrl);
		}

		const queryString = params.toString();
		if (queryString) {
			signInUrl += `?${queryString}`;
		}

		router.push(signInUrl);
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
		<Container sx={{ width: '90%' }}>
			<Heading
				title='Welcome to mittag dabbas!'
				titleAlign='left'
				caption='Sign Up'
				captionAlign='left'
			/>

			<Box
				component='form'
				onSubmit={handleSubmit(onSubmit)}
				sx={{ mt: 4 }}
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
				<Stack
					spacing={2}
					direction={'row'}
					justifyContent={'space-between'}
					sx={{ width: '100%', mb: 2 }}
				>
					{/* first name */}
					<Controller
						name='FirstName'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								label='First Name'
								error={!!errors.FirstName}
								helperText={errors.FirstName?.message}
							/>
						)}
					/>

					{/* last name */}
					<Controller
						name='LastName'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								label='Last Name'
								error={!!errors.LastName}
								helperText={errors.LastName?.message}
							/>
						)}
					/>
				</Stack>
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

					{/* terms and conditions checkbox */}
					<Controller
						name='TermsAndConditions'
						control={control}
						render={({ field }) => (
							<Stack
								direction='row'
								alignItems='center'
							>
								<Checkbox
									{...field}
									color='primary'
								/>
								<Typography
									variant='body2'
									color='textSecondary'
								>
									Sign up to this site with a public profile{' '}
									<span
										style={{
											color: theme.palette.primary.main,
											fontWeight: 500,
											textDecoration: 'underline'
										}}
									>
										Read More
									</span>
									. By signing up, you agree to our{' '}
									<Link
										href='https://lieferservice-tandoorinachte.de/terms-of-use'
										target='_black'
										style={{
											color: theme.palette.primary.main,
											fontWeight: 500,
											textDecoration: 'underline'
										}}
									>
										Terms of Use
									</Link>{' '}
									and{' '}
									<Link
										href='https://lieferservice-tandoorinachte.de/privacy-promise'
										target='_black'
										style={{
											color: theme.palette.primary.main,
											fontWeight: 500,
											textDecoration: 'underline'
										}}
									>
										Privacy Policy
									</Link>
								</Typography>
								{errors.TermsAndConditions && (
									<Typography
										variant='body2'
										color='error'
									>
										{errors.TermsAndConditions.message}
									</Typography>
								)}
							</Stack>
						)}
					/>
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
						Sign Up
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
						Sign Up with Google
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
						Already a member?
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
						onClick={handleSignIn}
					>
						Sign In
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default SignUpForm;
