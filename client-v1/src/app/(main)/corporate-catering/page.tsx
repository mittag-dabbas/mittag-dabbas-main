'use client';

import Loading from '@/components/loading';
import { ENQUIRY } from '@/lib/constants';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import { useIntl } from 'react-intl';

const Hero = dynamic(() => import('@/components/hero'), {
	loading: () => <Loading />
});

const FeatureCard = dynamic(() => import('@/components/feature-card'), {
	loading: () => <Loading />
});

const WorkFlow = dynamic(() => import('@/components/work-flow'), {
	loading: () => <Loading />
});

const CallToAction = dynamic(() => import('@/components/call-to-action'), {
	loading: () => <Loading />
});

type Props = {};

const CorporateCatering = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const { formatMessage } = useIntl();
	return (
		<Box>
			{/* Hero Section */}
			<Hero
				bannerImage={'/assets/images/cc-hero.png'}
				heroTitle={formatMessage({ id: 'corporate.catering.hero.title' })}
			/>

			{/* Feature Section */}
			<Box>
				<FeatureCard
					title={formatMessage({ id: 'corporate.catering.section1.title' })}
					caption={formatMessage({ id: 'corporate.catering.section1.caption' })}
					captionAlign='left'
					reverse={false}
					featureImage={'/assets/images/cc-section-1.png'}
					buttonText={formatMessage({ id: 'btn.enquire.now' })}
					navigateUrl={ENQUIRY}
					featureDescription={[
						{
							content: formatMessage({ id: 'corporate.catering.section1.content1' })
						}
					]}
				/>
			</Box>

			{/* Work Flow */}
			<Box
				sx={{
					bgcolor: theme.palette.background.paper
				}}
			>
				<WorkFlow
					caption={formatMessage({ id: 'corporate.catering.flow.caption' })}
					title={formatMessage({ id: 'corporate.catering.flow.title' })}
					timeLineData={[
						{
							title: formatMessage({ id: 'corporate.catering.flow.step1.title' }),
							description: formatMessage({ id: 'corporate.catering.flow.step1.description' }),
							image: '/assets/images/cc-flow-1.png'
						},
						{
							title: formatMessage({ id: 'corporate.catering.flow.step2.title' }),
							description: formatMessage({ id: 'corporate.catering.flow.step2.description' }),
							image: '/assets/images/cc-flow-2.png'
						},
						{
							title: formatMessage({ id: 'corporate.catering.flow.step3.title' }),
							description: formatMessage({ id: 'corporate.catering.flow.step3.description' }),
							image: '/assets/images/cc-flow-3.png'
						},
						{
							title: formatMessage({ id: 'corporate.catering.flow.step4.title' }),
							description: formatMessage({ id: 'corporate.catering.flow.step4.description' }),
							image: '/assets/images/cc-flow-4.png'
						}
					]}
				/>
			</Box>

			{/* Call to Action */}
			<CallToAction />
		</Box>
	);
};

export default CorporateCatering;
