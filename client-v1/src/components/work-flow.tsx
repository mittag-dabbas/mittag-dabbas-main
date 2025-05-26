import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
	Timeline,
	TimelineItem,
	TimelineSeparator,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineOppositeContent
} from '@mui/lab';
import Image from 'next/image';
import Heading from './heading';
import { TimeLineData } from '@/types';

// Styled components
const CustomTimelineDot = styled(TimelineDot)(({ theme }) => ({
	width: 48,
	height: 48,
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.common.white,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	fontSize: '1.25rem',
	margin: 0
}));

const CustomTimelineConnector = styled(TimelineConnector)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	width: 2.4
}));

const CustomTimelineItem = styled(TimelineItem)(({ theme }) => ({
	':before': {
		display: 'none'
	}
}));

interface Props {
	title: string;
	caption?: string;
	timeLineData: TimeLineData[];
}

const TimelineComponent = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

	return (
		<Container
			sx={{ pt: 1 }}
			maxWidth='lg'
		>
			<Box
				sx={{
					my: 10
				}}
			>
				<Heading
					title={props.title}
					caption={props.caption}
					captionAlign={'center'}
					titleAlign='center'
					titleInCaps={false}
				/>
			</Box>
			<Timeline
				position={isMobile || isTablet ? 'right' : 'alternate'}
				sx={{
					ml: isMobile || isTablet ? 0 : 5,
					mx: isMobile || isTablet ? 0 : 5
				}}
			>
				{props.timeLineData.map((item, index) => (
					<CustomTimelineItem key={index}>
						{/* Hide opposite content for mobile and tablet */}
						{!(isMobile || isTablet) && (
							<TimelineOppositeContent
								sx={{
									display: 'flex',
									justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
								}}
							>
								<Image
									src={item.image}
									alt={item.title}
									width={400}
									height={250}
									style={{ borderRadius: theme.shape.borderRadius }}
								/>
							</TimelineOppositeContent>
						)}
						<TimelineSeparator
							sx={{
								mx: isMobile || isTablet ? 0 : 8
							}}
						>
							{!(isMobile || isTablet) && (
								<CustomTimelineConnector
									sx={{
										bgcolor: index === 0 ? 'transparent' : undefined
									}}
								/>
							)}
							<CustomTimelineDot>{index + 1}</CustomTimelineDot>
							<CustomTimelineConnector
								sx={{
									bgcolor: index + 1 === props.timeLineData.length ? 'transparent' : undefined
								}}
							/>
						</TimelineSeparator>
						<TimelineContent
							sx={{
								// py: '12px',
								// px: 2,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: index % 2 === 0 ? 'flex-start' : 'flex-start'
							}}
						>
							{(isMobile || isTablet) && (
								<Image
									src={item.image}
									alt={item.title}
									width={isMobile || isTablet ? 300 : 400}
									height={isMobile || isTablet ? 200 : 250}
									style={{
										borderRadius: theme.shape.borderRadius,
										marginBottom: isMobile || isTablet ? '1rem' : 0
									}}
								/>
							)}
							<Typography
								variant='h3'
								component='span'
							>
								{item.title}
							</Typography>
							<Typography
								variant='body1'
								align='justify'
							>
								{item.description}
							</Typography>
						</TimelineContent>
					</CustomTimelineItem>
				))}
			</Timeline>
		</Container>
	);
};

export default TimelineComponent;
