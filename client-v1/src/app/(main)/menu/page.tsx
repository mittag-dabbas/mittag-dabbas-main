'use client';

import AdsStrip from '@/components/ads-strip';
import Heading from '@/components/heading';
import Loading from '@/components/loading';
import { ENQUIRY } from '@/lib/constants';
import { fetcher } from '@/lib/fetcher';
import { BannerStripApiReturnType } from '@/types';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useIntl } from 'react-intl';
import useSWR, { SWRResponse } from 'swr';

// Lazy load components with a loading fallback
const Hero = dynamic(() => import('@/components/hero'), {
	loading: () => <Loading />
});

const Info = dynamic(() => import('./_components/info'), {
	loading: () => <Loading />
});

const AllItems = dynamic(() => import('./_components/all-items'), {
	loading: () => <Loading />
});

const CallToAction = dynamic(() => import('@/components/call-to-action'), {
	loading: () => <Loading />
});

const Menu = () => {
	const router = useRouter();
	const theme = useTheme();
	const { formatMessage } = useIntl();

	// fetch banner strip
	const { data: bannerStripData, isLoading: bannerStripLoading }: SWRResponse<BannerStripApiReturnType, boolean> =
		useSWR(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/banner-strips${process.env.NEXT_PUBLIC_STRAPI_FETCH_ALL_DATA_FLAG_QUERY}`,
			fetcher
		);

	const bannerStripText =
		bannerStripData?.data && bannerStripData.data.length > 0 ? bannerStripData.data[0].attributes.Text : '';

	return (
		<Box>
			{/* Ads Strip */}
			{bannerStripText && (
				<Box sx={{ bgcolor: theme.palette.primary.main }}>
					<AdsStrip stripText={bannerStripText} />
				</Box>
			)}
			{/* Hero Section */}
			<Hero
				bannerImage='/assets/images/menu-hero.png'
				heroTitle={formatMessage({ id: 'menu.hero.title' })}
			/>

			{/* Heading */}
			<Container
				sx={{
					my: 8
				}}
			>
				<Stack
					direction={'column'}
					spacing={4}
				>
					<Heading
						caption='Our Daily Office Mealboxes'
						title='Taste the Convenience: Delicious Meals Delivered Daily'
						captionAlign='center'
						titleAlign='center'
					/>
					<Box>
						<Typography
							variant='h6'
							align='center'
						>
							How To Order
						</Typography>
						<Typography
							variant='body1'
							align='center'
						>
							Choose the Delivery Address & Time. Toggle to the particular days Menu which you wish to
							order latest by 8am in the morning. Please make individual pre-orders for each days Menu
							incase you wish to plan for the whole week.
						</Typography>
					</Box>
				</Stack>
			</Container>

			{/* All Items */}
			<Container sx={{ mt: 4 }}>
				<AllItems />
			</Container>

			{/* Info Section */}
			<Info />

			{/* Call to Action Section */}
			<CallToAction />
		</Box>
	);
};

export default Menu;
