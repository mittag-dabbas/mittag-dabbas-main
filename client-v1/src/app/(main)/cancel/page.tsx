'use client';

import React from 'react';
import { Container, Typography, Button, Box, Stack, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/navigation';
import { CHECKOUT } from '@/lib/constants';
import { useIntl } from 'react-intl';

type Props = {};

const Cancel = (props: Props) => {
	const router = useRouter();
	const theme = useTheme();
	const { formatMessage } = useIntl();

	const handleGoBack = () => {
		router.push(CHECKOUT);
	};

	return (
		<Container maxWidth='sm'>
			<Stack
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					height: '50vh',
					borderRadius: theme.shape.borderRadius,
					padding: 4,
					my: 4
				}}
			>
				<ErrorOutlineIcon
					color='error'
					sx={{ fontSize: 60, mb: 2 }}
				/>
				<Typography
					variant='h4'
					gutterBottom
				>
					{formatMessage({ id: 'payment.cancelled' })}
				</Typography>
				<Typography
					variant='body1'
					color='textSecondary'
					sx={{ mb: 3 }}
					align='center'
				>
					{formatMessage({ id: 'payment.cancelled.content' })}{' '}
				</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={handleGoBack}
					sx={{ mt: 2 }}
				>
					{'Go to checkout'}
				</Button>
			</Stack>
		</Container>
	);
};

export default Cancel;
