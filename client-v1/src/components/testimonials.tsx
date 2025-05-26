import React, { useState } from 'react';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import Slider, { Settings } from 'react-slick';
import { Testimonial } from '@/types';
import Heading from './heading';
import TestimonialCard from './testimonial-card';

type Props = {
	title: string;
	caption: string;
	testimonials: Testimonial[];
};

const Testimonials = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const [currentSlide, setCurrentSlide] = useState(0);

	const settings: Settings = {
		dots: true,
		infinite: props.testimonials ? props.testimonials.length > 1 : false,
		speed: 500,
		slidesToShow: isMobile ? 1 : isTablet ? 2 : Math.min(props.testimonials ? props.testimonials.length : 3, 3),
		slidesToScroll: 1,
		beforeChange: (current: number, next: number) => setCurrentSlide(next),
		appendDots: (dots: React.ReactNode) => (
			<Box>
				<Stack
					direction='row'
					spacing={1}
					justifyContent={'center'}
				>
					{React.Children.map(dots, (dot, index) => (
						<Box
							key={index}
							sx={{
								width: currentSlide === index ? '30px' : '10px',
								height: '10px',
								borderRadius: '5px',
								backgroundColor: currentSlide === index ? theme.palette.primary.main : 'transparent',
								border: `1px solid ${theme.palette.primary.main}`,
								transition: 'width 0.3s ease'
							}}
						/>
					))}
				</Stack>
			</Box>
		)
	};

	return (
		<>
			<Heading
				title={props.title}
				caption={props.caption}
				captionAlign='center'
				titleAlign='center'
			/>
			<Box
				sx={{
					width: props.testimonials ? (props.testimonials.length === 2 ? '55%' : '80%') : '80%',
					mx: 'auto',
					mt: 3
				}}
			>
				{props.testimonials && props.testimonials.length === 1 ? (
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						{/* Render a single testimonial without the slider */}
						<TestimonialCard
							key={props.testimonials[0].id}
							testimonial={props.testimonials[0]}
						/>
					</Box>
				) : props.testimonials && props.testimonials.length > 1 ? (
					<Slider {...settings}>
						{props.testimonials.map(testimonial => (
							<TestimonialCard
								key={testimonial.id}
								testimonial={testimonial}
							/>
						))}
					</Slider>
				) : (
					<Box sx={{ textAlign: 'center', mt: 2 }}>
						<p>No testimonials available</p>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Testimonials;
