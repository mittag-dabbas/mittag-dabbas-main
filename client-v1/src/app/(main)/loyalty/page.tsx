'use client';

import Loading from '@/components/loading';
import { ENQUIRY, LOYALTY_POINTS, PROFILE, SIGN_IN } from '@/lib/constants';
import { useAppSelector } from '@/store/store';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
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

const Loyalty = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const user = useAppSelector(state => state.auth.user);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const { formatMessage } = useIntl();

	return (
		<Box>
			{/* Hero Section */}
			<Hero
				bannerImage={'/assets/images/loyalty-hero.png'}
				heroTitle={formatMessage({ id: 'loyalty.program.hero.title' })}
			/>

			{/* Feature Section */}
			<Box>
				<FeatureCard
					title={formatMessage({ id: 'loyalty.program.section1.title' })}
					caption={formatMessage({ id: 'loyalty.program.section1.caption' })}
					captionAlign='left'
					reverse={false}
					featureImage={'/assets/images/loyalty-section-1.png'}
					buttonText={user ? formatMessage({ id: 'btn.view.points' }) : formatMessage({ id: 'btn.sign.in' })}
					navigateUrl={user ? `${PROFILE}?tab=${LOYALTY_POINTS}` : `${SIGN_IN}`}
					warningText={user ? '' : formatMessage({ id: 'loyalty.program.section1.warning' })}
					featureDescription={[
						{
							content: (
								<>
									<strong>{formatMessage({ id: 'loyalty.program.section1.content1.bold' })}</strong>
									{formatMessage({ id: 'loyalty.program.section1.content1' })}
								</>
							)
						},
						{
							content: (
								<>
									<strong>{formatMessage({ id: 'loyalty.program.section1.content2.bold' })}</strong>
									{formatMessage({ id: 'loyalty.program.section1.content2' })}
								</>
							)
						}
					]}
				/>
			</Box>

			{/* Work Flow */}
			<Box
				sx={{
					bgcolor: theme.palette.background.paper,
					pb: 4
				}}
			>
				<WorkFlow
					caption={formatMessage({ id: 'loyalty.program.flow.caption' })}
					title={formatMessage({ id: 'loyalty.program.flow.title' })}
					timeLineData={[
						{
							title: formatMessage({ id: 'loyalty.program.flow.step1.title' }),
							description: formatMessage({ id: 'loyalty.program.flow.step1.description' }),
							image: '/assets/images/loyalty-flow-1.png'
						},
						{
							title: formatMessage({ id: 'loyalty.program.flow.step2.title' }),
							description: (
								<>
									{formatMessage({ id: 'loyalty.program.flow.step2.description' })} <br />
									{formatMessage({ id: 'loyalty.program.flow.step2.description1' })}
								</>
							),
							image: '/assets/images/loyalty-flow-2.png'
						},
						{
							title: formatMessage({ id: 'loyalty.program.flow.step3.title' }),
							description: formatMessage({ id: 'loyalty.program.flow.step3.description' }),
							image: '/assets/images/loyalty-flow-3.png'
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
					{formatMessage({ id: 'btn.enquire.now' })}
				</Button>
			</Box>
		</Box>
	);
};

export default Loyalty;
