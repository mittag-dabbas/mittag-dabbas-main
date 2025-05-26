import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useIntl } from 'react-intl';

type Props = {};

const HeroCaption = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const { formatMessage } = useIntl();

	return (
		<Box
			sx={{
				bgcolor: theme.palette.background.paper,
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
				position: 'relative',
				p: isMobile ? 2 : isTablet ? 3 : 4,
				overflow: 'hidden'
			}}
		>
			<Stack
				direction={isMobile ? 'column' : 'row'}
				alignItems={isMobile ? 'center' : 'flex-end'}
				justifyContent={isMobile ? 'center' : 'space-evenly'}
				width={isMobile ? '100%' : '80%'}
				sx={{ position: 'relative' }}
			>
				{/* Left Spoon */}
				<Image
					src={'/assets/icons/hero-caption.svg'}
					alt={'Hero Image'}
					width={60}
					height={60}
					style={{
						position: 'absolute',
						left: isMobile ? '10px' : isTablet ? '5%' : 0,
						bottom: isMobile ? '-25px' : '-30px'
					}}
				/>

				{/* Text and Dots */}
				<Stack
					direction={isMobile ? 'column' : 'row'}
					alignItems={'center'}
					spacing={2}
					sx={{ zIndex: 1 }}
				>
					<Typography
						variant={isMobile ? 'body1' : isTablet ? 'h6' : 'h5'}
						color={theme.palette.primary.main}
						sx={{ textAlign: 'center' }}
					>
						{formatMessage({ id: 'home.hero.caption1' })}
					</Typography>

					<Image
						src={'/assets/icons/dot.svg'}
						alt={'Dot'}
						width={12}
						height={12}
					/>

					<Typography
						variant={isMobile ? 'body1' : isTablet ? 'h6' : 'h5'}
						color={theme.palette.primary.main}
						sx={{ textAlign: 'center' }}
					>
						{formatMessage({ id: 'home.hero.caption2' })}
					</Typography>

					<Image
						src={'/assets/icons/dot.svg'}
						alt={'Dot'}
						width={12}
						height={12}
					/>

					<Typography
						variant={isMobile ? 'body1' : isTablet ? 'h6' : 'h5'}
						color={theme.palette.primary.main}
						sx={{ textAlign: 'center' }}
					>
						{formatMessage({ id: 'home.hero.caption3' })}
					</Typography>
				</Stack>

				{/* Right Spoon */}
				<Image
					src={'/assets/icons/hero-caption.svg'}
					alt={'Hero Image'}
					width={60}
					height={60}
					style={{
						position: 'absolute',
						right: isMobile ? '10px' : isTablet ? '5%' : 0,
						bottom: isMobile ? '-25px' : '-30px'
					}}
				/>
			</Stack>
		</Box>
	);
};

export default HeroCaption;
