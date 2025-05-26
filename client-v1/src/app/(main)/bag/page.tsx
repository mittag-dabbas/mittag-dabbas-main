'use client';

import Heading from '@/components/heading';
import Loading from '@/components/loading';
import { useAppSelector } from '@/store/store';
import { Box, Button, Container, Grid, Typography, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import AllDaysItems from './_components/all-days-items';
import { MENU } from '@/lib/constants';
import AdsStrip from '@/components/ads-strip';
import useSWR, { SWRResponse } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { BannerStripApiReturnType } from '@/types';

const OrderSummary = dynamic(() => import('./_components/order-summary'), {
	loading: () => <Loading />
});

type Props = {};

const Bag = (props: Props) => {
	const theme = useTheme();
	const cartData = useAppSelector(state => state.cart.days);

	const isCartEmpty = Object.values(cartData).every(day => day.items.length === 0);

	// fetch banner strip
	const { data: bannerStripData, isLoading: bannerStripLoading }: SWRResponse<BannerStripApiReturnType, boolean> =
		useSWR(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/banner-strips${process.env.NEXT_PUBLIC_STRAPI_FETCH_ALL_DATA_FLAG_QUERY}`,
			fetcher
		);

	const bannerStripText =
		bannerStripData?.data && bannerStripData.data.length > 0 ? bannerStripData.data[0].attributes.Text : '';

	return (
		<>
			{bannerStripText && (
				<Box sx={{ bgcolor: theme.palette.primary.main }}>
					<AdsStrip stripText={bannerStripText} />
				</Box>
			)}
			<Container>
				{/* Ads Strip */}
				<Box
					sx={{
						mt: 4,
						mb: 2
					}}
				>
					<Heading
						title='Fill Your Bag, Satisfy Your Cravings'
						titleAlign='center'
						caption='My Bag'
						captionAlign='center'
					/>
				</Box>

				{isCartEmpty ? (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '60vh'
						}}
					>
						<Typography
							variant='h6'
							color='text.secondary'
						>
							Your bag is empty. Add some items to get started!
						</Typography>
						<Button
							variant='contained'
							color='primary'
							href={MENU}
						>
							Go to Menu
						</Button>
					</Box>
				) : (
					<Grid
						container
						spacing={2}
						sx={{
							my: 3
						}}
					>
						<Grid
							item
							xs={12}
							sm={8}
						>
							<Box
								sx={{
									mt: 2
								}}
							>
								{Object.entries(cartData).map(([dayIndex, dayCart]) => {
									if (dayCart.items.length === 0) return null;

									return (
										<AllDaysItems
											key={dayIndex}
											dayIndex={parseInt(dayIndex)}
											dayCart={dayCart}
										/>
									);
								})}
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<OrderSummary />
						</Grid>
					</Grid>
				)}
			</Container>
		</>
	);
};

export default Bag;
