'use client';

import Heading from '@/components/heading';
import { SIGN_IN } from '@/lib/constants';
import { forgotPasswordForm } from '@/lib/form-schemas';
import { resetPassword } from '@/store/slices/auth-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Container, Stack, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {};

type ForgotPasswordData = z.infer<typeof forgotPasswordForm>;

const ForgotPassword = (props: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams(); // Initialize useSearchParams
	const dispatch = useAppDispatch();
	const { user, authError, loading } = useAppSelector(state => state.auth);
	const [success, setSuccess] = useState(false);

	const {
		control,
		handleSubmit,
		setValue, // Add setValue to set form values programmatically
		formState: { errors }
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(forgotPasswordForm),
		mode: 'onBlur',
		reValidateMode: 'onChange'
	});

	// flush the auth error when the component is mounted
	useEffect(() => {
		dispatch({ type: 'auth/clearError' });
	}, []);

	// Get the email from the query parameters and set it in the form
	useEffect(() => {
		const email = searchParams.get('email'); // Retrieve email from the query parameter
		if (email) {
			setValue('Email', email); // Set the email value in the form
		}
	}, [searchParams, setValue]);

	const onSubmit = async (data: ForgotPasswordData) => {
		const result = await dispatch(resetPassword(data.Email));
		if (result.meta.requestStatus === 'fulfilled' && !authError) {
			// trigger the success alert
			setSuccess(true);
		}
	};

	return (
		<Container
			sx={{
				width: '90%'
				// mx: isMobile ? 3 : isTablet ? 10 : 30,
				// p: '13vh'
			}}
		>
			{/* Set max width for the form */}
			<Heading
				title="Let's Get You Back In!"
				titleAlign='left'
				caption='Forget Password'
				captionAlign='left'
			/>
			<Box
				component='form'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				sx={{
					mt: success ? 1 : 3
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

				{/* Success message */}
				{success && !authError && (
					<Stack
						sx={{
							mb: 2
						}}
					>
						<Alert severity='success'>
							Password reset email has sent to your email
							<strong>{' ' + control._formValues.Email || ''}</strong> successfully .
						</Alert>
					</Stack>
				)}

				{/* Email */}
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

				<Stack
					spacing={2}
					sx={{ mt: 4 }}
				>
					{/* send email Button */}
					<LoadingButton
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						loading={loading}
					>
						Send Reset Email
					</LoadingButton>

					{/* go back */}
					<Button
						fullWidth
						variant='text'
						onClick={() => router.push(SIGN_IN)}
					>
						Go Back
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default ForgotPassword;
