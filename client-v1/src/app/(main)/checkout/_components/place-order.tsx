import { EURO } from '@/lib/constants';
import { getGrandTotalAddingMWST, getMWST } from '@/lib/helper';
import { useAppSelector } from '@/store/store';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type Props = {};

const PlaceOrder = (props: Props) => {
	const theme = useTheme();
	const totalPrice = useAppSelector(state => state.cart.totalPrice);
	const discount = useAppSelector(state => state.cart.discount);
	const promoCode = useAppSelector(state => state.cart.promoCode);
	const isApplied = useAppSelector(state => state.cart.isPromoCodeApplied);

	return (
		<Box>
			<Stack
				direction='column'
				justifyContent='space-between'
				spacing={1}
			>
				<Stack
					direction={'row'}
					justifyContent='space-between'
				>
					<Typography variant='subtitle1'>Subtotal </Typography>
					<Typography variant='subtitle1'>
						{totalPrice.toFixed(2)} {EURO}{' '}
					</Typography>
				</Stack>
				<Stack
					direction={'row'}
					justifyContent='space-between'
				>
					<Typography variant='subtitle1'>Delivery Charges </Typography>
					<Typography
						variant='h6'
						color='success'
					>
						FREE
					</Typography>
				</Stack>
				{discount > 0 && (
					<Stack
						direction={'row'}
						justifyContent='space-between'
					>
						<Typography variant='subtitle1'>Discount </Typography>
						<Typography
							variant='subtitle1'
							color='success.main'
						>
							-{discount.toFixed(2)} {EURO}
						</Typography>
					</Stack>
				)}
				<Stack
					direction={'row'}
					justifyContent='space-between'
				>
					<Typography variant='subtitle1'>MWST </Typography>
					<Typography variant='subtitle1'>
						{getMWST(Number(totalPrice.toFixed(2)))} {EURO}
					</Typography>
				</Stack>
			</Stack>

			<Divider sx={{ my: 2 }} />

			<Stack
				direction={'row'}
				justifyContent='space-between'
				alignItems={'flex-start'}
			>
				<Box>
					<Typography variant='h6'>Grand Total </Typography>
					<Typography variant='body2'>*Tax included</Typography>
				</Box>
				<Box>
					<Typography variant='h6'>
						{getGrandTotalAddingMWST(Number(totalPrice.toFixed(2)), discount)} {EURO}
					</Typography>
				</Box>
			</Stack>

			<Box
				sx={{
					mt: 2,
					textAlign: 'center'
				}}
			>
				<Typography
					variant='body2'
					align='center'
				>
					We Accept
				</Typography>

				<Box
					sx={{
						mt: 1
					}}
				>
					<Image
						src='/assets/images/card.png'
						alt='Cards'
						width={200}
						height={30}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default PlaceOrder;
