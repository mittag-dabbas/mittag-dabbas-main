'use client';

import React, { useState } from 'react';
import { Box, Container, Button, Stack, Typography, Grid, Card, CardMedia, CardActions } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import Loading from '@/components/loading';
import { styled } from '@mui/material/styles';
import { StrapiFile } from '@/types';

interface ImageData {
	id: number;
	url: string;
	createdAt: string;
	name: string;
	width?: number;
	height?: number;
}

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
	'& .MuiInputBase-root': {
		borderRadius: '8px',
		backgroundColor: '#ffffff',
		fontSize: '13px',
		padding: '8px 12px',
		border: '1px solid #ccc',
		'&:hover': {
			borderColor: '#1B5E20'
		}
	}
}));

const Label = () => {
	const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
	const [images, setImages] = useState<ImageData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPdfLoading, setIsPdfLoading] = useState(false);

	const fetchImages = async () => {
		if (!selectedDate) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/upload/files`);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data: StrapiFile[] = await response.json();

			const filteredImages = data.filter((image: StrapiFile) => {
				try {
					const parts = image.name.split('_');
					if (parts.length < 2) return false;

					const datePart = parts[1].split('.')[0];
					const imageDate = moment(datePart, 'DD-MM-YYYY', true);

					return imageDate.isValid() && imageDate.isSame(selectedDate, 'day');
				} catch (error) {
					console.error(`Error parsing date for image ${image.name}:`, error);
					return false;
				}
			});

			const filterLabelsImages = filteredImages.filter(image => image.width === 2000 && image.height === 1000);
			setImages(filterLabelsImages);
		} catch (err) {
			setError('Failed to fetch images. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const generatePDF = async () => {
		if (images.length === 0) return;
		setIsPdfLoading(true);

		try {
			const pdf = new jsPDF({ orientation: 'l', unit: 'mm', format: [30, 60] });

			for (let i = 0; i < images.length; i++) {
				if (i > 0) pdf.addPage([30, 60]);
				const imgData = await fetch(images[i].url)
					.then(res => res.blob())
					.then(
						blob =>
							new Promise(resolve => {
								const reader = new FileReader();
								reader.onload = () => resolve(reader.result);
								reader.readAsDataURL(blob);
							})
					);
				pdf.addImage(imgData as string, 'PNG', 0, 0, 60, 30);
			}
			pdf.save('labels.pdf');
		} finally {
			setIsPdfLoading(false);
		}
	};

	return (
		<Container
			maxWidth='lg'
			sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'start' }}
		>
			<Box sx={{ py: 4 }}>
				<Typography
					variant='h4'
					gutterBottom
				>
					Label Generator
				</Typography>

				<Stack spacing={3}>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							alignItems='center'
						>
							<StyledDatePicker
								label='Select Date'
								value={selectedDate}
								onChange={newValue => setSelectedDate(newValue ? moment(newValue.toDate()) : null)}
								sx={{ width: { xs: '100%', sm: 200 } }}
							/>
							<Button
								variant='contained'
								onClick={fetchImages}
								disabled={!selectedDate}
							>
								Filter Images
							</Button>
						</Stack>
					</LocalizationProvider>
					{isLoading && <Loading />}
					{error && <Typography color='error'>{error}</Typography>}

					{/* Unified UI for Images */}
					{!isLoading && images.length > 0 && (
						<Box>
							<Typography
								variant='body1'
								gutterBottom
							>
								Found {images.length} image{images.length > 1 ? 's' : ''}
							</Typography>
							<Button
								variant='contained'
								onClick={generatePDF}
								disabled={isPdfLoading}
								sx={{ mt: 2, mb: 4 }}
							>
								{isPdfLoading ? 'Generating PDF...' : 'Download PDF'}
							</Button>

							{/* Unified Grid Layout for All */}
							<Grid
								container
								spacing={2}
							>
								{images.map(image => (
									<Grid
										item
										key={image.id}
									>
										<Card sx={{ padding: 2, textAlign: 'center', boxShadow: 3 }}>
											<CardMedia
												component='img'
												height='150'
												image={image.url}
												alt={image.name}
												sx={{ margin: '0 auto', width: 'auto' }}
											/>

											<CardActions sx={{ justifyContent: 'center' }}>
												<Button
													size='small'
													href={image.url}
													download
												>
													Download
												</Button>
											</CardActions>
										</Card>
									</Grid>
								))}
							</Grid>
						</Box>
					)}
				</Stack>
			</Box>
		</Container>
	);
};

export default Label;
