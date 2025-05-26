'use client';

import AdsStrip from '@/components/ads-strip';
import Loading from '@/components/loading';
import { fetcher } from '@/lib/fetcher';
import { BannerStripApiReturnType } from '@/types';
import { Box, Container, Grid, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import useSWR, { SWRResponse } from 'swr';

const Address = dynamic(() => import('./_components/address'), {
	loading: () => <Loading />
});

const OrderSummary = dynamic(() => import('./_components/order-summary'), {
	loading: () => <Loading />
});

type Props = {};

const Checkout = (props: Props) => {
	const theme = useTheme();
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
			{/* Ads Strip */}
			{bannerStripText && (
				<Box sx={{ bgcolor: theme.palette.primary.main }}>
					<AdsStrip stripText={bannerStripText} />
				</Box>
			)}
			<Container
				// maxWidth='lg'
				sx={{
					paddingTop: 4,
					paddingBottom: 4
				}}
			>
				<Grid
					container
					direction='row'
					spacing={2}
				>
					<Grid
						item
						xs={12}
						sm={12}
						md={8}
						lg={7}
					>
						<Address />
					</Grid>
					<Grid
						item
						xs={12}
						sm={12}
						md={4}
						lg={5}
					>
						<OrderSummary />
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Checkout;
