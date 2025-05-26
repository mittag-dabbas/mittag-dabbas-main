import { Card, CardContent, Typography, Button, Box, Stack, useTheme } from '@mui/material';
import Heading from './heading';
import Image from 'next/image';

interface PricingCardProps {
	price: string;
	planType: string;
	billingCycle: string;
	content: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ price, planType, billingCycle, content }) => {
	const theme = useTheme();
	return (
		<Box>
			<Card
				sx={{
					width: '100%',
					maxWidth: 320,
					textAlign: 'left',
					boxShadow: 3,
					margin: 'auto',
					padding: 1,
					bgcolor: 'background.default',
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius
				}}
			>
				<CardContent>
					<Typography
						variant='h6'
						fontWeight='bold'
					>
						{price}
					</Typography>
					<Typography
						variant='body1'
						fontWeight={'bold'}
						color='text.secondary'
					>
						{planType}
					</Typography>
					<Typography
						variant='subtitle2'
						color='text.secondary'
					>
						Billed {billingCycle}
					</Typography>

					<Box my={2}>
						<Stack spacing={1}>
							{content.map((item, index) => (
								<Stack
									direction={'row'}
									alignItems={'center'}
									spacing={1}
									key={index}
									justifyItems={'flex-start'}
								>
									<Image
										src='/assets/icons/tick.svg'
										alt='check'
										width={20}
										height={20}
									/>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										{item}
									</Typography>
								</Stack>
							))}
						</Stack>
					</Box>

					<Button
						variant='contained'
						size='small'
					>
						SUBSCRIBE NOW
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
};

export default PricingCard;
