import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

type Props = {
	heroTitle: string;
	bannerImage: string;
};

const Hero = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				height: isMobile ? '18vh' : '35vh',
				width: '100%',
				backgroundImage: `url(${props.bannerImage})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				padding: isMobile ? '0 30px' : isTablet ? '0 100px' : '0 200px',
				color: 'white'
			}}
		>
			<Typography
				variant='h1'
				sx={{
					fontSize: isMobile ? '2.4em' : isTablet ? '3em' : '4em',
					lineHeight: '1em'
				}}
				align='center'
				textTransform={'uppercase'}
			>
				{props.heroTitle}
			</Typography>
		</Box>
	);
};

export default Hero;
