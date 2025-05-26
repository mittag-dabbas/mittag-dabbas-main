import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';
import { HOME } from '@/lib/constants';

export default function NotFound() {
	return (
		<Container
			maxWidth='sm'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				textAlign: 'center'
			}}
		>
			<Typography
				variant='h2'
				component='h2'
				gutterBottom
			>
				404
			</Typography>
			<Typography
				variant='h6'
				component='p'
				gutterBottom
			>
				Not Found
			</Typography>
			<Typography
				variant='body1'
				color='text.secondary'
				gutterBottom
			>
				Could not find the requested resource.
			</Typography>
			<Typography
				variant='body1'
				color='text.secondary'
				gutterBottom
			>
				Looks like you've taken a wrong turn! 🚀
			</Typography>
			<Box mt={2}>
				<Link
					href={HOME}
					passHref
				>
					<Button
						variant='contained'
						color='primary'
					>
						Return Home
					</Button>
				</Link>
			</Box>
		</Container>
	);
}
