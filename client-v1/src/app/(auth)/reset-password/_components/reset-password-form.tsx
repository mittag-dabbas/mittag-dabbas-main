import Heading from '@/components/heading';
import { resetPasswordForm } from '@/lib/form-schemas';
import { confirmResetPassword, verifyResetCode } from '@/store/slices/auth-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { z } from 'zod';
import { LoadingButton } from '@mui/lab';
import { SIGN_IN } from '@/lib/constants';

type Props = {};

type ForgotPasswordData = z.infer<typeof resetPasswordForm>;

const ResetPasswordForm = (props: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams(); // Initialize useSearchParams
	const dispatch = useAppDispatch();
	const { user, authError, loading } = useAppSelector(state => state.auth);
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false); // State for password visibility

	const {
		control,
		handleSubmit,
		setValue, // Add setValue to set form values programmatically
		formState: { errors }
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(resetPasswordForm),
		mode: 'onBlur',
		reValidateMode: 'onChange'
	});
	const mode = searchParams.get('mode');
	const oobCode = searchParams.get('oobCode') || '';
	const apiKey = searchParams.get('apiKey');

	const verifyResetCodeAndGetEmail = async (oobCode: string) => {
		const result = await dispatch(verifyResetCode(oobCode));
		if (result.meta.requestStatus === 'fulfilled' && !authError) {
			return result.payload;
		}
	};

	const onSubmit = async (data: ForgotPasswordData) => {
		const result = await dispatch(confirmResetPassword({ oobCode, newPassword: data.newPassword }));
		if (result.meta.requestStatus === 'fulfilled' && !authError) {
			// trigger the success alert
			setSuccess(true);
		}
	};
	useEffect(() => {
		if (oobCode) {
			verifyResetCodeAndGetEmail(oobCode);
		}
	}, [oobCode]);

	if (mode !== 'resetPassword') {
		dispatch({ type: 'auth/clearError' });
		router.push(SIGN_IN);
		// flush the authError state
	}

	if (authError) {
		return (
			<Container
				sx={{
					width: '90%'
					// mx: isMobile ? 3 : isTablet ? 10 : 30,
					// p: '13vh'
				}}
			>
				<Typography variant='h5'>This link is expired, please try again.</Typography>
			</Container>
		);
	}

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
				title='Let’s reset your password!'
				titleAlign='left'
				caption='Reset Password'
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
						<Alert severity='success'>{`You have successfully reset your password, now sign-in again`}</Alert>
					</Stack>
				)}

				<Stack spacing={3}>
					{!success && (
						<>
							<Controller
								name='newPassword'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label='New Password'
										type={showPassword ? 'text' : 'password'} // Toggle password visibility
										error={!!errors.newPassword}
										helperText={errors.newPassword?.message}
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

							<Controller
								name='confirmPassword'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label='Confirm Password'
										type={showPassword ? 'text' : 'password'} // Toggle password visibility
										error={!!errors.confirmPassword}
										helperText={errors.confirmPassword?.message}
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
						</>
					)}

					<Stack
						spacing={2}
						sx={{ mt: 4 }}
					>
						{/* send email Button */}
						{!success && (
							<LoadingButton
								type='submit'
								fullWidth
								variant='contained'
								color='primary'
								loading={loading}
							>
								Reset Password
							</LoadingButton>
						)}

						{/* go back */}
						<Button
							fullWidth
							variant='text'
							onClick={() => router.push(SIGN_IN)}
						>
							Back to Sign-in
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Container>
	);
};

export default ResetPasswordForm;
