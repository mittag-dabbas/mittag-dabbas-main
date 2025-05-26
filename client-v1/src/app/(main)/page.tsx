'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import useSWR, { SWRResponse } from 'swr';
import {
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	Stack,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import HeroCaption from '@/components/hero-caption';
import { fetcher } from '@/lib/fetcher';
import { BannerStripApiReturnType, TestimonialsApiReturnType } from '@/types';
import { useRouter } from 'next/navigation';
import { CORPORATE_CATERING, DAILY_OFFICE_MEAL, ENQUIRY, LOYALTY, MENU, PROFILE } from '@/lib/constants';
import Loading from '@/components/loading';
import { useAppSelector } from '@/store/store';
import Slider, { Settings } from 'react-slick';
import { useState } from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NextSeo } from 'next-seo';
import HomeBanner from '@/components/home-banner';

const AdsStrip = dynamic(() => import('@/components/ads-strip'), {
	loading: () => <Loading />
});

const FeatureCard = dynamic(() => import('@/components/feature-card'), {
	loading: () => <Loading />
});

const Features = dynamic(() => import('@/components/features'), {
	loading: () => <Loading />
});

const Testimonials = dynamic(() => import('@/components/testimonials'), {
	loading: () => <Loading />
});

const Referral = dynamic(() => import('@/components/referral'), {
	loading: () => <Loading />
});

const CallToAction = dynamic(() => import('@/components/call-to-action'), {
	loading: () => <Loading />
});

// ------------------------------------------------------------------------------------------------------------------

export default function Home() {
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const [currentSlide, setCurrentSlide] = useState(0);

	const sliderRef = React.useRef<Slider>(null);

	const referralRef = React.useRef<HTMLDivElement>(null);

	const { formatMessage } = useIntl();

	// fetch testimonials
	const { data, isLoading }: SWRResponse<TestimonialsApiReturnType, boolean> = useSWR(
		`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/testimonials${process.env.NEXT_PUBLIC_STRAPI_FETCH_ALL_DATA_FLAG_QUERY}`,
		fetcher
	);

	// fetch banner strip
	const { data: bannerStripData, isLoading: bannerStripLoading }: SWRResponse<BannerStripApiReturnType, boolean> =
		useSWR(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/banner-strips${process.env.NEXT_PUBLIC_STRAPI_FETCH_ALL_DATA_FLAG_QUERY}`,
			fetcher
		);

	const bannerStripText =
		bannerStripData?.data && bannerStripData.data.length > 0 ? bannerStripData.data[0].attributes.Text : '';

	const company = useAppSelector(state => state.company);

	const heroSlides = [
		{
			image: '/assets/images/home-hero.png',
			title: formatMessage({ id: 'home.hero.title' }),
			content: formatMessage({ id: 'home.hero.content' }),
			button: {
				text: formatMessage({ id: 'btn.enquire.now' }),
				link: ENQUIRY
			}
		},
		{
			image: '/assets/images/home-hero-2.png',
			title: formatMessage({ id: 'home.hero.title2' }),
			content: '',
			button: {
				text: formatMessage({ id: 'btn.discover.menu' }),
				link: MENU
			}
		},
		{
			image: '/assets/images/home-hero-3.png',
			title: formatMessage({ id: 'home.hero.title3' }),
			content: formatMessage({ id: 'home.hero.content3' }),
			button: {
				text: formatMessage({ id: 'btn.refer.now' }),
				action: () => {
					referralRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		}
	];

	return (
		<>
			<NextSeo
				title='About Mittag-Dabbas | Corporate Meal Delivery'
				description='Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering.'
				canonical='https://mittag-dabbas.com'
				openGraph={{
					title: 'About Mittag-Dabbas | Corporate Meal Delivery',
					description:
						'Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering.',
					url: 'https://mittag-dabbas.com'
				}}
			/>
			<Box sx={{ overflowX: 'hidden' }}>
				{/* Ads Strip */}
				{bannerStripText && (
					<Box sx={{ bgcolor: theme.palette.primary.main }}>
						<AdsStrip stripText={bannerStripText} />
					</Box>
				)}

				<Container
					maxWidth='xl'
					sx={{
						position: 'relative',
						zIndex: 1,
						py: 2,
						px: { xs: 2, md: 3 }
					}}
				>
					{/* Hero Section */}
					<HomeBanner referralRef={referralRef} />
				</Container>

				{/* Hero Caption */}
				<HeroCaption />

				{/* Section 0 */}
				<Box>
					<FeatureCard
						title={formatMessage({ id: 'home.section0.title' })}
						caption={formatMessage({ id: 'home.section0.caption' })}
						captionAlign='left'
						reverse={true}
						featureImage={'/assets/images/home-section-0.png'}
						anchorId='about-us'
						featureDescription={[
							{
								content: formatMessage({ id: 'home.section0.content1' })
							},
							{
								content: formatMessage({ id: 'home.section0.content2' })
							}
						]}
					/>
				</Box>

				<Box>
					<Features />
				</Box>
				{/* Referral program */}

				<Box
					ref={referralRef}
					sx={{ bgcolor: theme.palette.background.paper }}
				>
					<Referral />
				</Box>

				{/* Section 2 */}
				<Box
					sx={{
						bgcolor: theme.palette.background.paper
					}}
				>
					<FeatureCard
						title={formatMessage({ id: 'home.section2.title' })}
						caption={formatMessage({ id: 'home.section2.caption' })}
						captionAlign='left'
						reverse={true}
						featureImage={'/assets/images/home-section-2.png'}
						buttonText={formatMessage({ id: 'btn.learn.more' })}
						navigateUrl={DAILY_OFFICE_MEAL}
						featureDescription={[
							{
								content: formatMessage({ id: 'home.section2.content1' }),
								icon: '/assets/icons/dom-1.svg'
							},
							{
								content: formatMessage({ id: 'home.section2.content2' }),
								icon: '/assets/icons/dom-2.svg'
							},
							{
								content: formatMessage({ id: 'home.section2.content3' }),
								icon: '/assets/icons/dom-3.svg'
							}
						]}
					/>
				</Box>

				{/* Section 3 */}
				<Box>
					<FeatureCard
						title={formatMessage({ id: 'home.section3.title' })}
						caption={formatMessage({ id: 'home.section3.caption' })}
						captionAlign='left'
						reverse={false}
						featureImage={'/assets/images/home-section-3.png'}
						buttonText={formatMessage({ id: 'btn.learn.more' })}
						navigateUrl={CORPORATE_CATERING}
						featureDescription={[
							{
								content: formatMessage({ id: 'home.section3.content1' }),
								icon: '/assets/icons/cc-1.svg'
							},
							{
								content: formatMessage({ id: 'home.section3.content2' }),
								icon: '/assets/icons/cc-2.svg'
							},
							{
								content: formatMessage({ id: 'home.section2.content3' }),
								icon: '/assets/icons/cc-3.svg'
							}
						]}
					/>
				</Box>

				{/* Section 4 */}
				<Box
					sx={{
						bgcolor: theme.palette.background.paper
					}}
				>
					<FeatureCard
						title={formatMessage({ id: 'home.section4.title' })}
						caption={formatMessage({ id: 'home.section4.caption' })}
						captionAlign='left'
						reverse={true}
						featureImage={'/assets/images/home-section-4.png'}
						buttonText={formatMessage({ id: 'btn.discover.menu' })}
						navigateUrl={MENU}
						featureDescription={[
							{
								content: formatMessage({ id: 'home.section4.content1' })
							},
							{
								content: formatMessage({ id: 'home.section4.content2' })
							}
						]}
					/>
				</Box>

				{/* Testimonials */}
				{!isLoading && data ? (
					<Box
						sx={{
							mt: 4,
							mb: 8
						}}
					>
						<Testimonials
							title={formatMessage({ id: 'home.testimonials.title' })}
							caption={formatMessage({ id: 'home.testimonials.caption' })}
							testimonials={data?.data}
						/>
					</Box>
				) : (
					<Stack
						justifyContent={'center'}
						alignItems={'center'}
						sx={{
							my: 5
						}}
					>
						<CircularProgress />
					</Stack>
				)}

				{/* Call to Action */}
				<CallToAction />
			</Box>
		</>
	);
}
