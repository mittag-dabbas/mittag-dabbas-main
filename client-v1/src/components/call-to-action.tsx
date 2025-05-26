import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/navigation';
import { ENQUIRY } from '@/lib/constants';

type Props = {};

const CallToAction = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const { formatMessage } = useIntl();
	return (
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
				{formatMessage({ id: 'home.call.to.action.title' }).toUpperCase()}
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
	);
};

export default CallToAction;
