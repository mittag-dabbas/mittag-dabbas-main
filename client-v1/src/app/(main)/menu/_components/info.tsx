import Heading from '@/components/heading';
import { ENQUIRY } from '@/lib/constants';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useIntl } from 'react-intl';

type Props = {};

const Info = (props: Props) => {
	const router = useRouter();
	const theme = useTheme();
	const { formatMessage } = useIntl();

	return (
		<Box
			sx={{
				bgcolor: theme.palette.background.paper,
				my: 8,
				px: 3
			}}
		>
			<Container>
				<Stack
					alignItems='center'
					spacing={4}
					sx={{
						maxWidth: '1200px',
						mx: 'auto',
						py: 6
					}}
				>
					<Heading
						title={formatMessage({ id: 'menu.title' })}
						titleAlign='center'
						titleInCaps
						caption={formatMessage({ id: 'menu.caption' })}
						captionAlign='center'
					/>

					<Typography
						variant='body1'
						align='center'
					>
						{formatMessage({ id: 'menu.feature.content1' })}
					</Typography>

					<Typography
						variant='body1'
						align='center'
					>
						{formatMessage({ id: 'menu.feature.content2' })}
					</Typography>

					<Button
						variant='contained'
						onClick={() => router.push(ENQUIRY)}
					>
						{formatMessage({ id: 'btn.enquire.now' })}
					</Button>
				</Stack>
			</Container>
		</Box>
	);
};

export default Info;
