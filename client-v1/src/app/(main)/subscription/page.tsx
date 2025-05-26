'use client';

import Heading from '@/components/heading';
import Loading from '@/components/loading';
import { ENQUIRY } from '@/lib/constants';
import { Box, Button, Container, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useIntl } from 'react-intl';

const Hero = dynamic(() => import('@/components/hero'), {
	loading: () => <Loading />
});

const FeatureCard = dynamic(() => import('@/components/feature-card'), {
	loading: () => <Loading />
});

const PricingCard = dynamic(() => import('@/components/pricing-card'), {
	loading: () => <Loading />
});

const WorkFlow = dynamic(() => import('@/components/work-flow'), {
	loading: () => <Loading />
});

const CallToAction = dynamic(() => import('@/components/call-to-action'), {
	loading: () => <Loading />
});

type Props = {};

const Subscription = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const { formatMessage } = useIntl();

	return (
		<Box>
			{/* Hero Section */}
			<Hero
				bannerImage={'/assets/images/cc-hero.png'}
				heroTitle={formatMessage({ id: 'subscription.model.hero.title' })}
			/>

			{/* Feature Section */}
			<Box>
				<FeatureCard
					title={formatMessage({ id: 'subscription.model.section1.title' })}
					caption={formatMessage({ id: 'subscription.model.section1.caption' })}
					captionAlign='left'
					reverse={false}
					featureImage={'/assets/images/subscription-section-1.png'}
					buttonText={formatMessage({ id: 'btn.subscribe.now' })}
					navigateUrl={ENQUIRY}
					featureDescription={[
						{
							content: formatMessage({ id: 'subscription.model.section1.content1' })
						}
					]}
				/>
			</Box>

			{/* Pricing cards */}

			<Container sx={{ py: 5 }}>
				<Heading
					title={formatMessage({ id: 'subscription.model.section2.title' })}
					titleAlign='center'
					caption={formatMessage({ id: 'subscription.model.section2.caption' })}
					captionAlign='center'
				/>
				<Grid
					container
					spacing={3}
					justifyContent='center'
					sx={{ my: 3 }}
				>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
					>
						<PricingCard
							price={formatMessage({ id: 'subscription.model.plan1.price' })}
							planType={formatMessage({ id: 'subscription.model.plan1.title1' })}
							billingCycle={formatMessage({ id: 'subscription.model.plan1.title2' })}
							content={[
								formatMessage({ id: 'subscription.model.plan1.content1' }),
								formatMessage({ id: 'subscription.model.plan1.content2' }),
								formatMessage({ id: 'subscription.model.plan1.content3' }),
								formatMessage({ id: 'subscription.model.plan1.content4' })
							]}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
					>
						<PricingCard
							price={formatMessage({ id: 'subscription.model.plan2.price' })}
							planType={formatMessage({ id: 'subscription.model.plan2.title1' })}
							billingCycle={formatMessage({ id: 'subscription.model.plan2.title2' })}
							content={[
								formatMessage({ id: 'subscription.model.plan2.content1' }),
								formatMessage({ id: 'subscription.model.plan2.content2' }),
								formatMessage({ id: 'subscription.model.plan2.content3' }),
								formatMessage({ id: 'subscription.model.plan2.content4' })
							]}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
					>
						<PricingCard
							price={formatMessage({ id: 'subscription.model.plan3.price' })}
							planType={formatMessage({ id: 'subscription.model.plan3.title1' })}
							billingCycle={formatMessage({ id: 'subscription.model.plan3.title2' })}
							content={[
								formatMessage({ id: 'subscription.model.plan3.content1' }),
								formatMessage({ id: 'subscription.model.plan3.content2' }),
								formatMessage({ id: 'subscription.model.plan3.content3' }),
								formatMessage({ id: 'subscription.model.plan3.content4' })
							]}
						/>
					</Grid>
				</Grid>
			</Container>

			{/* Work Flow */}
			<Box
				sx={{
					bgcolor: theme.palette.background.paper
				}}
			>
				<WorkFlow
					caption={formatMessage({ id: 'subscription.model.flow.caption' })}
					title={formatMessage({ id: 'subscription.model.flow.title' })}
					timeLineData={[
						{
							title: formatMessage({ id: 'subscription.model.flow.step1.title' }),
							description: formatMessage({ id: 'subscription.model.flow.step1.description' }),
							image: '/assets/images/subscription-flow-1.png'
						},
						{
							title: formatMessage({ id: 'subscription.model.flow.step2.title' }),
							description: formatMessage({ id: 'subscription.model.flow.step2.description' }),
							image: '/assets/images/subscription-flow-2.png'
						},
						{
							title: formatMessage({ id: 'subscription.model.flow.step3.title' }),
							description: formatMessage({ id: 'subscription.model.flow.step3.description' }),
							image: '/assets/images/subscription-flow-3.png'
						},
						{
							title: formatMessage({ id: 'subscription.model.flow.step4.title' }),
							description: formatMessage({ id: 'subscription.model.flow.step4.description' }),
							image: '/assets/images/subscription-flow-4.png'
						}
					]}
				/>
			</Box>

			{/* Call to Action */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					height: isMobile ? '46vh' : '52vh',
					width: isMobile ? '46vh' : '41wh',
					maxWidth: '1200px',
					margin: 'auto',
					marginY: '100px',
					backgroundImage: isMobile
						? 'url(/assets/images/call-to-action-responsive.png)'
						: 'url(/assets/images/call-to-action.png)',
					backgroundPosition: 'center',
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					padding: isMobile ? '0 20px' : isTablet ? '0 60px' : '0 100px',
					borderRadius: theme.shape.borderRadius
				}}
			>
				<Typography
					variant='h2'
					sx={{
						fontSize: isMobile ? '2.4em' : isTablet ? '3em' : '4em',
						lineHeight: '1.2em',
						color: theme.palette.background.default
					}}
				>
					{formatMessage({ id: 'subscription.model.cta.title' }).toUpperCase()}
				</Typography>
				<Button
					variant='contained'
					sx={{
						mt: 4,
						bgcolor: theme.palette.background.default,
						color: theme.palette.primary.main,
						fontWeight: 'bold',
						'&:hover': {
							bgcolor: theme.palette.background.paper
						}
					}}
					onClick={() => router.push(ENQUIRY)}
				>
					{formatMessage({ id: 'btn.subscribe.now' })}
				</Button>
			</Box>
		</Box>
	);
};

export default Subscription;
