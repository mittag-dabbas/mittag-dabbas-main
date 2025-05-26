import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

type Props = {
	stripText: string;
};

const AdsStrip = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Container
			sx={{
				height: 'auto',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: theme.palette.primary.main
			}}
		>
			<Typography
				variant={isMobile ? 'subtitle1' : 'h5'}
				color={theme.palette.primary.contrastText}
				sx={{
					textAlign: 'center',
					paddingX: isMobile ? '10px' : '20px',
					paddingY: isMobile ? '5px' : '10px'
				}}
			>
				{props.stripText}
			</Typography>
		</Container>
	);
};

export default AdsStrip;
