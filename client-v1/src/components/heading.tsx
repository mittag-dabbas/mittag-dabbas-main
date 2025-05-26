import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

type Props = {
	caption?: string;
	captionAlign?: 'left' | 'center' | 'right';
	title: string;
	titleAlign?: 'left' | 'center' | 'right';
	titleInCaps?: boolean;
};

const Heading = (props: Props) => {
	const theme = useTheme();
	return (
		<Box>
			{props.caption && (
				<Typography
					variant='h2'
					align={props.captionAlign}
					color={theme.palette.primary.main}
				>
					{props.caption}
				</Typography>
			)}
			<Typography
				variant='h5'
				sx={{ fontWeight: 'bold' }}
				align={props.titleAlign}
				textTransform={props.titleInCaps ? 'uppercase' : 'none'}
			>
				{props.title}
			</Typography>
		</Box>
	);
};

export default Heading;
