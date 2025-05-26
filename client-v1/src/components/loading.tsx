import { CircularProgress, Stack } from '@mui/material';
import React from 'react';

type Props = {};

const Loading = (props: Props) => {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			sx={{
				m: 5
			}}
		>
			<CircularProgress />
		</Stack>
	);
};

export default Loading;
