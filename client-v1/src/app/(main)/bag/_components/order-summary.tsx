import { CHECKOUT, EURO } from '@/lib/constants';
import { getBestCouponCode, getGrandTotalAddingMWST, getMWST, isEmailInIsReferralRedeemedBy } from '@/lib/helper';
import { useAppSelector } from '@/store/store';
import {
	Box,
	Button,
	Divider,
	Stack,
	TextField,
	Typography,
	useTheme,
	IconButton,
	InputAdornment,
	Chip
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { setPromoCode, clearPromoCode, setPromoCodeApplied, setDiscount } from '@/store/slices/cart-slice';
import { useAppDispatch } from '@/store/store';
import CloseIcon from '@mui/icons-material/Close';
import { setRedeemedPoints, clearRedeemedPoints } from '@/store/slices/dabba-points-slice';
import { CouponsApiReturnType, ReferralApiReturnType, ReferralData } from '@/types';

type Props = {};

const isValidDate = (expiryDate: string): boolean => {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
	const expiry = new Date(expiryDate);
	return expiry >= today;
};

const OrderSummary = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const user = useAppSelector(state => state.auth.user);
	const totalPrice = useAppSelector(state => state.cart.totalPrice);
	const discount = useAppSelector(state => state.cart.discount);
	const promoCode = useAppSelector(state => state.cart.promoCode);
	const isApplied = useAppSelector(state => state.cart.isPromoCodeApplied);
	const dabbaPoints = useAppSelector(state => state.dabbaPoints.dabbaPoints);
	const redeemedPoints = useAppSelector(state => state.dabbaPoints.redeemedPoints);
	const isPointsApplied = useAppSelector(state => state.dabbaPoints.isPointsApplied);
	const [statusMessage, setStatusMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
	const [redeemPoints, setRedeemPoints] = useState('');
	const [redeemError, setRedeemError] = useState('');
	const [referralData, setReferralData] = useState<ReferralApiReturnType | null>(null);
	const [bestCouponCode, setBestCouponCode] = useState<string | null>(null);

	useEffect(() => {
		if (promoCode && !isApplied) {
			handleApplyPromoCode();
		}
		if (redeemedPoints > 0 && !isPointsApplied) {
			handleRedeemPoints(redeemedPoints.toString());
		}
	}, []);

	useEffect(() => {
		if (user) {
			getAllReferralDetails();
		}
	}, [user]);

	const getAllReferralDetails = async () => {
		if (!user) {
			return;
		}
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals?populate=*`
			);

			const data = await response.json();
			setReferralData(data);
			const myReferralDetails = data.data.find(
				(referral: ReferralData) => referral.attributes.referrer.data?.attributes.Email === user?.email
			);
			const myCouponCode = myReferralDetails?.attributes.coupon?.data?.attributes.CouponCode || 'N/A';
			const bestCouponCode = getBestCouponCode(data, myCouponCode);
			setBestCouponCode(bestCouponCode);
		} catch (error) {
			console.error('Error occurred in fetching all referral details', error);
		}
	};

	const handleApplyPromoCode = async () => {
		if (!promoCode.trim()) {
			setStatusMessage('Please enter a promo code');
			setMessageType('warning');
			return;
		}

		if (isPointsApplied) {
			setStatusMessage('Please remove Dabba points before applying a promo code');
			setMessageType('warning');
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/coupons?filters[CouponCode][$eq]=${promoCode}&populate=*`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (response.ok) {
				const data: CouponsApiReturnType = await response.json();

				if (data.data && data.data.length > 0) {
					const coupon = data.data[0].attributes;
					const isCouponReferralCoupon = coupon.CouponCode.startsWith('REFERRAL');

					if (isCouponReferralCoupon) {
						const referralCodeDetails = await getReferralCodeDetail(coupon.CouponCode);

						if (referralCodeDetails) {
							if (
								parseInt(referralCodeDetails.data[0].attributes.timesIUsedThisCoupon) >=
								referralCodeDetails.data[0].attributes.referring.data.length
							) {
								setStatusMessage('You have already redeemed this referral code');
								setMessageType('error');
								return;
							}

							if (isEmailInIsReferralRedeemedBy(referralCodeDetails, user.email)) {
								setStatusMessage('You have already redeemed this referral code');
								setMessageType('error');
								return;
							}
						}
					}

					if (!isValidDate(coupon.Expiry)) {
						// dispatch(clearPromoCode());
						setStatusMessage('This promo code has expired');
						setMessageType('error');
						return;
					}

					// COUPON TYPE
					if (coupon.TypeOfCoupon[0].__component === 'shared.discount-amount') {
						dispatch(setDiscount({ discount: coupon.TypeOfCoupon[0].Discount }));
					} else if (coupon.TypeOfCoupon[0].__component === 'shared.discount-percentage') {
						dispatch(setDiscount({ discount: (totalPrice * coupon.TypeOfCoupon[0].Discount) / 100 }));
					}

					dispatch(setPromoCodeApplied({ isApplied: true }));
					setStatusMessage(`Promo code "${promoCode}" applied successfully!`);
					setMessageType('success');
				} else {
					// dispatch(clearPromoCode());
					setStatusMessage('Invalid promo code');
					setMessageType('error');
				}
			}
		} catch (error) {
			console.error('Error applying promo code:', error);
			setStatusMessage('Error applying promo code');
			setMessageType('error');
			dispatch(setPromoCodeApplied({ isApplied: false }));
		} finally {
			setIsLoading(false);
		}
	};

	const getReferralCodeDetail = async (referralCode: string) => {
		try {
			const referralCodeDetails = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals?populate=*&filters[coupon][CouponCode][$eq]=${promoCode}`
			);

			if (!referralCodeDetails.ok) {
				throw new Error('Failed to fetch referral code details');
			}

			const data: ReferralApiReturnType = await referralCodeDetails.json();

			if (data.data && data.data.length > 0) {
				return data;
			}
		} catch (error) {
			console.error('Error getting referral code detail:', error);
		}
	};

	const handleRemovePromoCodeDiscount = () => {
		dispatch(clearPromoCode());
		setStatusMessage('');
		setMessageType('info');
	};

	const handleRedeemPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only allow numbers
		if (value === '' || /^\d+$/.test(value)) {
			setRedeemPoints(value);
			setRedeemError('');
		}
	};

	const handleApplyChipPromoCode = () => {
		dispatch(setPromoCode({ promoCode: bestCouponCode }));
		dispatch(setPromoCodeApplied({ isApplied: true }));
		handleApplyPromoCode();
		setStatusMessage(`Promo code "${bestCouponCode}" applied successfully!`);
		setMessageType('success');
	};

	const handleRedeemPoints = (points?: string) => {
		const pointsToRedeem = Number(points || redeemPoints);

		if (isApplied) {
			setRedeemError('Please remove promo code before redeeming points');
			return;
		}

		// Validation checks
		if (!pointsToRedeem) {
			setRedeemError('Please enter points to redeem');
			return;
		}

		if (pointsToRedeem > dabbaPoints) {
			setRedeemError('Cannot redeem more points than you have or more than 99 points');
			return;
		}

		// Calculate discount amount (1 point = €0.10)
		const discountAmount = pointsToRedeem * 0.1;

		// Ensure discount doesn't make total go negative
		if (discountAmount >= totalPrice + 0.1) {
			const maxPointsPossible = Math.floor(totalPrice / 0.1);
			setRedeemError(`You can only redeem up to ${maxPointsPossible} points for this order`);
			return;
		}

		// Update redux state
		dispatch(setRedeemedPoints({ points: pointsToRedeem }));
		dispatch(setDiscount({ discount: discountAmount }));
		setRedeemError('');
	};

	const handleRemovePoints = () => {
		dispatch(clearRedeemedPoints());
		dispatch(setDiscount({ discount: 0 }));
		setRedeemPoints('');
		setRedeemError('');
	};

	// Add disabled state checks
	const isPromoCodeDisabled = isApplied || isPointsApplied;
	const isDabbaPointsDisabled = isApplied || isPointsApplied;

	return (
		<Box
			sx={{
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				p: theme.spacing(3),
				backgroundColor: theme.palette.background.paper,
				maxWidth: 400,
				margin: 'auto'
			}}
		>
			<Box sx={{ mb: theme.spacing(3) }}>
				<Typography variant='h5'>Order Summary</Typography>
			</Box>

			<Stack spacing={2}>
				<Stack
					direction='row'
					justifyContent='space-between'
				>
					<Typography variant='subtitle1'>Subtotal</Typography>
					<Typography variant='subtitle1'>
						{totalPrice.toFixed(2)} {EURO}
					</Typography>
				</Stack>

				<Stack
					direction='row'
					justifyContent='space-between'
				>
					<Typography variant='subtitle1'>Delivery Charges</Typography>
					<Typography
						variant='h6'
						color='success.main'
					>
						FREE
					</Typography>
				</Stack>

				<Divider sx={{ my: theme.spacing(2) }} />

				<Stack spacing={1}>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						justifyContent='space-between'
						spacing={1}
					>
						<TextField
							label='Promo Code'
							variant='outlined'
							fullWidth
							value={promoCode}
							onChange={e => dispatch(setPromoCode({ promoCode: e.target.value }))}
							disabled={isPromoCodeDisabled}
							sx={{ flexGrow: 1 }}
							InputProps={{
								endAdornment: promoCode && (
									<InputAdornment position='end'>
										<IconButton
											onClick={handleRemovePromoCodeDiscount}
											edge='end'
											size='small'
										>
											<CloseIcon />
										</IconButton>
									</InputAdornment>
								)
							}}
							helperText={isPointsApplied ? 'Remove Dabba points to use promo code' : ''}
						/>
						<Button
							variant='contained'
							sx={{ flexShrink: 0, height: '100%' }}
							onClick={handleApplyPromoCode}
							disabled={isLoading || isApplied || !promoCode.trim() || isPointsApplied}
						>
							{isLoading ? 'Applying...' : isApplied ? 'Applied' : 'Apply'}
						</Button>
					</Stack>

					{bestCouponCode && (
						<Stack
							direction='row'
							alignItems='center'
							spacing={1}
						>
							<Typography variant='body2'>Use this coupon code</Typography>
							<Chip
								label={bestCouponCode}
								color='primary'
								variant='outlined'
								sx={{ ml: 1 }}
								size='small'
								onClick={() => {
									// copy to clipboard
									navigator.clipboard.writeText(bestCouponCode);
									setStatusMessage('Coupon code copied to clipboard');
									setMessageType('success');
								}}
							/>
						</Stack>
					)}

					{/* Status Message */}
					{statusMessage && (
						<Typography
							variant='body1'
							sx={{
								color:
									messageType === 'success'
										? theme.palette.success.main
										: messageType === 'error'
											? theme.palette.error.main
											: messageType === 'warning'
												? theme.palette.warning.main
												: undefined,
								ml: 1
							}}
						>
							{statusMessage}
						</Typography>
					)}
				</Stack>
			</Stack>

			<Stack
				direction='row'
				alignItems='center'
				spacing={2}
				sx={{ my: 2 }}
			>
				<Divider sx={{ flex: 1 }} />
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{
						px: 2,
						fontWeight: 500
					}}
				>
					OR
				</Typography>
				<Divider sx={{ flex: 1 }} />
			</Stack>

			{/* DABBA POINTS */}
			<Stack
				direction={'column'}
				justifyContent='space-between'
				spacing={1}
			>
				<Typography variant='body2'>You have {dabbaPoints} Dabba Points</Typography>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					justifyContent='space-between'
					spacing={1}
				>
					<TextField
						variant='outlined'
						fullWidth
						sx={{ flexGrow: 1 }}
						placeholder={`Enter points (max ${dabbaPoints})`}
						value={redeemPoints}
						onChange={handleRedeemPointsChange}
						error={!!redeemError}
						helperText={isApplied ? 'Remove promo code to use Dabba points' : redeemError}
						type='text'
						disabled={isDabbaPointsDisabled}
						InputProps={{
							endAdornment: redeemedPoints > 0 && (
								<InputAdornment position='end'>
									<IconButton
										onClick={handleRemovePoints}
										edge='end'
										size='small'
									>
										<CloseIcon />
									</IconButton>
								</InputAdornment>
							)
						}}
						inputProps={{
							inputMode: 'numeric',
							pattern: '[0-9]*',
							max: dabbaPoints
						}}
					/>
					<Button
						variant='contained'
						sx={{ flexShrink: 0, height: '100%' }}
						onClick={() => handleRedeemPoints()}
						disabled={!redeemPoints || !!redeemError || isPointsApplied || isApplied}
					>
						{isPointsApplied ? 'Applied' : 'Redeem'}
					</Button>
				</Stack>
				{redeemedPoints > 0 && (
					<Typography
						variant='body2'
						color='success.main'
					>
						{redeemedPoints} points applied for {EURO}
						{(redeemedPoints * 0.1).toFixed(2)} discount
					</Typography>
				)}
				<Typography variant='body2'>Flexible rewards: 1 Dabba Point = {EURO} 0.10 off</Typography>
			</Stack>

			<Divider sx={{ my: theme.spacing(2) }} />

			{discount > 0 && (
				<Stack
					direction='row'
					justifyContent='space-between'
				>
					<Typography variant='subtitle1'>Discount</Typography>
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
				<Typography variant='subtitle1'>{getMWST(Number(totalPrice.toFixed(2)))}</Typography>
			</Stack>

			<Stack
				direction='row'
				justifyContent='space-between'
				alignItems='flex-start'
			>
				<Box>
					<Typography variant='h6'>Grand Total</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
					>
						*Tax included
					</Typography>
				</Box>
				<Typography variant='h6'>
					{getGrandTotalAddingMWST(Number(totalPrice.toFixed(2)), discount)} {EURO}
				</Typography>
			</Stack>

			<Box sx={{ mt: theme.spacing(3) }}>
				<Button
					fullWidth
					variant='contained'
					size='large'
					onClick={() => router.push(CHECKOUT)}
				>
					Checkout
				</Button>
			</Box>

			<Box sx={{ mt: theme.spacing(3), textAlign: 'center' }}>
				<Typography variant='body2'>We Accept</Typography>
				<Box sx={{ mt: theme.spacing(1) }}>
					<Image
						src='/assets/images/card.png'
						alt='Cards'
						width={200}
						height={30}
						style={{ maxWidth: '100%' }}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default OrderSummary;
