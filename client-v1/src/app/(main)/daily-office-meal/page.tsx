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

const DailyOfficeMeal = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const { formatMessage } = useIntl();

	return (
		<Box>
			{/* Hero Section */}
			<Hero
				bannerImage={'/assets/images/dom-hero.png'}
				heroTitle={formatMessage({ id: 'daily.office.meal.hero.title' })}
			/>

			{/* Feature Section */}
			<Box>
				<FeatureCard
					title={formatMessage({ id: 'daily.office.meal.section1.title' })}
					caption={formatMessage({ id: 'daily.office.meal.section1.caption' })}
					captionAlign='left'
					reverse={false}
					featureImage={'/assets/images/dom-section-1.png'}
					buttonText={formatMessage({ id: 'btn.enquire.now' })}
					navigateUrl={ENQUIRY}
					featureDescription={[
						{
							content: formatMessage({ id: 'daily.office.meal.section1.content1' })
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
					caption={formatMessage({ id: 'daily.office.meal.flow.caption' })}
					title={formatMessage({ id: 'daily.office.meal.flow.title' })}
					timeLineData={[
						{
							title: formatMessage({ id: 'daily.office.meal.flow.step1.title' }),
							description: formatMessage({ id: 'daily.office.meal.flow.step1.description' }),
							image: '/assets/images/dom-flow-1.png'
						},
						{
							title: formatMessage({ id: 'daily.office.meal.flow.step2.title' }),
							description: formatMessage({ id: 'daily.office.meal.flow.step2.description' }),
							image: '/assets/images/dom-flow-2.png'
						},
						{
							title: formatMessage({ id: 'daily.office.meal.flow.step3.title' }),
							description: formatMessage({ id: 'daily.office.meal.flow.step3.description' }),
							image: '/assets/images/dom-flow-3.png'
						},
						{
							title: formatMessage({ id: 'daily.office.meal.flow.step4.title' }),
							description: formatMessage({ id: 'daily.office.meal.flow.step4.description' }),
							image: '/assets/images/dom-flow-4.png'
						}
					]}
				/>
			</Box>

			{/* Call to Action */}
			<CallToAction />
		</Box>
	);
};

export default DailyOfficeMeal;
