'use client';

import Heading from '@/components/heading';
import { enquireForm } from '@/lib/form-schemas';
import {
	Box,
	Button,
	Checkbox,
	Container,
	FormControlLabel,
	Grid,
	SvgIcon,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm, Controller } from 'react-hook-form';
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

type EnquireFormData = z.infer<typeof enquireForm>;

const Enquire = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { formatMessage } = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm<EnquireFormData>({
		resolver: zodResolver(enquireForm),
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: {
			FirstName: '',
			LastName: '',
			Email: '',
			PhoneNumber: '+49',
			CompanyName: '',
			OfficeAddress: '',
			AnythingElse: '',
			DailyOfficeMeal: false,
			CorporateCatering: false
		}
	});

	const onSubmit = async (data: EnquireFormData, event: any) => {
		try {
			setIsLoading(true);
			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/enquiries`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ data })
			});

			if (response.ok) {
				enqueueSnackbar('Enquire form submitted successfully', { variant: 'success' });
				event.target.reset();
			}
		} catch (error) {
			console.error('Error submitting enquire form: ', error);
			enqueueSnackbar('Error submitting enquire form', { variant: 'error' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container
			maxWidth='lg'
			sx={{
				my: isMobile ? 0 : '3.25em',
				mb: '3.25em'
			}}
			style={{ marginTop: '120px', marginBottom: '80px' }}
		>
			<Box
				component='form'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Grid
					container
					spacing={1}
				>
					{/* Image: left side */}
					<Grid
						item
						xs={12}
						md={6}
					>
						<Image
							src={'/assets/images/enquire-now.png'}
							alt={'Enquire now'}
							width={isMobile ? 388 : 500}
							height={isMobile ? 450 : 550}
							blurDataURL='/assets/images/enquire-now.png'
							style={{
								borderRadius: theme.shape.borderRadius,
								// display: 'block',
								margin: 'auto', // Ensure the image is centered within the Grid
								display: 'flex',
								justifyContent: 'center'
							}}
						/>
					</Grid>

					{/* Form: right side */}
					<Grid
						item
						xs={12}
						md={6}
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
						>
							<Heading
								title={formatMessage({ id: 'enquire.now.form.title' })}
								caption={formatMessage({ id: 'enquire.now.form.caption' })}
								titleInCaps={true}
							/>
						</Grid>

						{/* First Name */}
						<Grid
							item
							xs={12}
							sm={6}
						>
							<Controller
								name='FirstName'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.fname' })}
										error={!!errors.FirstName}
										helperText={errors.FirstName?.message}
									/>
								)}
							/>
						</Grid>

						{/* Last Name */}
						<Grid
							item
							xs={12}
							sm={6}
						>
							<Controller
								name='LastName'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.lname' })}
										error={!!errors.LastName}
										helperText={errors.LastName?.message}
									/>
								)}
							/>
						</Grid>

						{/* Email */}
						<Grid
							item
							xs={12}
						>
							<Controller
								name='Email'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.email' })}
										error={!!errors.Email}
										helperText={errors.Email?.message}
									/>
								)}
							/>
						</Grid>

						{/* Phone Number */}
						<Grid
							item
							xs={12}
						>
							<Controller
								name='PhoneNumber'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.phone' })}
										error={!!errors.PhoneNumber}
										helperText={errors.PhoneNumber?.message}
									/>
								)}
							/>
						</Grid>

						{/* Company Name */}
						<Grid
							item
							xs={12}
						>
							<Controller
								name='CompanyName'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.company.name' })}
										error={!!errors.CompanyName}
										helperText={errors.CompanyName?.message}
									/>
								)}
							/>
						</Grid>

						{/* Office Address */}
						<Grid
							item
							xs={12}
						>
							<Controller
								name='OfficeAddress'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.office.address' })}
										error={!!errors.OfficeAddress}
										helperText={errors.OfficeAddress?.message}
									/>
								)}
							/>
						</Grid>

						{/* Anything Else */}
						<Grid
							item
							xs={12}
						>
							<Controller
								name='AnythingElse'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label={formatMessage({ id: 'enquire.now.form.additional.info' })}
										multiline
										rows={2}
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
						>
							<Typography
								variant='h6'
								sx={{ mb: 1 }}
							>
								{formatMessage({ id: 'enquire.now.form.services.title' })}

								{(errors.DailyOfficeMeal || errors.CorporateCatering) && (
									<Grid
										item
										xs={12}
									>
										<Typography
											variant='body2'
											color='error'
										>
											{errors.DailyOfficeMeal?.message || errors.CorporateCatering?.message}
										</Typography>
									</Grid>
								)}
							</Typography>
							<Grid
								container
								spacing={2}
							>
								{/* Daily Office Meals */}
								<Grid
									item
									md={6}
									xs={12}
								>
									<Controller
										name='DailyOfficeMeal'
										control={control}
										render={({ field }) => (
											<FormControlLabel
												control={
													<Box
														sx={{
															border: field.value
																? `1px solid ${theme.palette.primary.main}`
																: `1px solid ${theme.palette.grey[100]}`,
															borderRadius: theme.shape.borderRadius,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															px: 1,
															width: '100%',
															backgroundColor: theme.palette.background.paper,
															cursor: 'pointer'
														}}
													>
														{/* Left Icon and Label */}
														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<Image
																src='/assets/icons/service-option1.svg'
																alt='Service Option 1'
																width={24}
																height={24}
															/>
															<Typography
																variant='body1'
																sx={{ fontWeight: '500', marginLeft: '8px' }}
															>
																{formatMessage({
																	id: 'enquire.now.form.services.option1'
																})}
															</Typography>
														</Box>

														<Checkbox
															checked={field.value}
															onChange={() => field.onChange(!field.value)}
														/>
													</Box>
												}
												label=''
												sx={{ width: '100%', m: 0 }}
											/>
										)}
									/>
								</Grid>

								{/* Corporate Catering*/}
								<Grid
									item
									md={6}
									xs={12}
								>
									<Controller
										name='CorporateCatering'
										control={control}
										render={({ field }) => (
											<FormControlLabel
												control={
													<Box
														sx={{
															border: field.value
																? `1px solid ${theme.palette.primary.main}`
																: `1px solid ${theme.palette.grey[100]}`,
															borderRadius: theme.shape.borderRadius,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															px: 1,
															width: '100%',
															backgroundColor: theme.palette.background.paper,
															cursor: 'pointer'
														}}
													>
														{/* Left Icon and Label */}
														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<Image
																src='/assets/icons/service-option2.svg'
																alt='Service Option 2'
																width={24}
																height={24}
															/>
															<Typography
																variant='body1'
																sx={{ fontWeight: '500', marginLeft: '8px' }}
															>
																{formatMessage({
																	id: 'enquire.now.form.services.option2'
																})}
															</Typography>
														</Box>

														<Checkbox
															checked={field.value}
															onChange={() => field.onChange(!field.value)}
														/>
													</Box>
												}
												label=''
												sx={{ width: '100%', m: 0 }}
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Grid>

						{/* Submit Button */}
						<Grid
							item
							xs={12}
						>
							<LoadingButton
								type='submit'
								fullWidth
								variant='contained'
								color='primary'
								loading={isLoading}
							>
								{formatMessage({ id: 'enquire.now.form.submit' })}
							</LoadingButton>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default Enquire;
