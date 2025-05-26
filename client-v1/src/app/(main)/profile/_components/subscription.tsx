'use client';

import { Alert, Box, Button, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';

type Props = {};

const Subscription = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [isSubsidairy, setIsSubsidairy] = useState(false);

	return (
		<Box
			sx={{
				p: 2,
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				mb: 2
			}}
		>
			<Typography
				variant='h6'
				gutterBottom
			>
				Company Info
			</Typography>
			<Typography
				variant='body2'
				sx={{ mb: 3 }}
			>
				View if the company subsidiary is available
			</Typography>

			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					md={3}
				>
					<Typography
						variant='body1'
						color='textSecondary'
					>
						Company
					</Typography>
					<Typography variant='h6'>Mittag Dabbas</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					md={3}
				>
					<Typography
						variant='body1'
						color='textSecondary'
					>
						Subsidiary
					</Typography>
					<Typography
						variant='h6'
						color={isSubsidairy ? 'primary' : 'error'}
					>
						{isSubsidairy ? 'Available' : 'Not Available'}
					</Typography>
				</Grid>
			</Grid>

			{!isSubsidairy && (
				<Alert
					severity='warning'
					sx={{
						mt: 3,
						borderRadius: theme.shape.borderRadius,
						border: `1px solid ${theme.palette.warning.main}`,
						alignItems: 'center'
					}}
					action={
						<Button
							size='small'
							variant='contained'
							sx={{
								fontSize: theme.typography.pxToRem(12)
							}}
						>
							Upgrade Now
						</Button>
					}
				>
					Looks like you don't have a company subscription no worries! Subscribe now for premium benefits!
				</Alert>
			)}
		</Box>
	);
};

export default Subscription;
