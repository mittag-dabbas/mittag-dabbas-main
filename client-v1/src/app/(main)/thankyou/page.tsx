'use client';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { Box, Button, Container, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { CustomerDetails, OrderDetailsApiReturnType, RecentOrdersApiReturnType, ReferralApiReturnType } from '@/types';
import {
	convertMenuItemToOrderItemType,
	getGrandTotalAddingMWST,
	isEmailInReferrer,
	isEmailInReferring
} from '@/lib/helper';
import moment from 'moment';
import { ORDERS, ORDER_STATUS, PROFILE, daysOfWeek } from '@/lib/constants';
import DayItems from './_components/day-items';
import { DayCart, clearCart, clearPromoCode } from '@/store/slices/cart-slice';
import Loading from '@/components/loading';
import {
	clearDabbaPoints,
	clearRedeemedPoints,
	decrementDabbaPoints,
	fetchDabbaPoints,
	incrementDabbaPoints
} from '@/store/slices/dabba-points-slice';

type Props = {};

const ThankYou = (props: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { width, height } = useWindowSize();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { user } = useAppSelector(state => state.auth);
	const cartData = useAppSelector(state => state.cart.days);
	const { totalPrice, totalQuantity, isCartEmpty } = useAppSelector(state => state.cart);
	const defaultDeliveryAddress = useAppSelector(state => state.cart.defaultDeliveryAddress);
	const discount = useAppSelector(state => state.cart.discount);
	const promoCode = useAppSelector(state => state.cart.promoCode);
	const isPointsApplied = useAppSelector(state => state.dabbaPoints.isPointsApplied);
	const redeemedPoints = useAppSelector(state => state.dabbaPoints.redeemedPoints);
	const pointsStatus = useAppSelector(state => state.dabbaPoints.status);
	const [isDataSubmitted, setIsDataSubmitted] = useState(false);
	const [existingUserDetails, setExistingUserDetails] = useState<CustomerDetails | null>(null);
	const [recentOrder, setRecentOrder] = useState<RecentOrdersApiReturnType | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const isPromoCodeReferral = promoCode?.startsWith('REFERRAL');

	const isProcessing = pointsStatus === 'loading' || isLoading;

	useEffect(() => {
		if (isCartEmpty) {
			router.push(`${PROFILE}?tab=${ORDERS}`);
		}
		if (user?.uid) {
			getExistingUserDetails();
		}
	}, [user, isCartEmpty]);

	const getExistingUserDetails = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${user.uid}&populate=*`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch user details');
			}

			const data = await response.json();
			if (data?.data?.length > 0) {
				setExistingUserDetails(data.data[0]);

				const defaultAddress = data.data[0].attributes.customer_delivery_addresses.data.find(
					(address: any) => address.attributes.isDefaultAddress
				);
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	};

	useEffect(() => {
		if (existingUserDetails && !isDataSubmitted) {
			// addCartDataToCMS();
			handlePOSTCartToCMS();
			setIsDataSubmitted(true);
			// handleSendEmail();
		}
	}, [existingUserDetails, isDataSubmitted]);

	const handleReferralCode = async () => {
		try {
			// get the referral code details from customer-referrals api

			const referralCodeDetails = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals?populate=*&filters[coupon][CouponCode][$eq]=${promoCode}`
			);

			if (!referralCodeDetails.ok) {
				throw new Error('Failed to fetch referral code details');
			}

			const data: ReferralApiReturnType = await referralCodeDetails.json();

			if (existingUserDetails?.attributes.Email) {
				if (isEmailInReferring(data, existingUserDetails.attributes.Email)) {
					// update existing is referral redeemed by
					const existingIsReferralRedeemedBy =
						data?.data[0]?.attributes?.referring.data.map(referring => referring.id) || [];
					const updatedIsReferralRedeemedBy = [...existingIsReferralRedeemedBy, existingUserDetails.id];

					const payload = {
						data: {
							isReferralRedeemedBy: {
								connect: updatedIsReferralRedeemedBy
							}
						}
					};

					const updateResponse = await fetch(
						`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals/${data.data[0].id}`,
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(payload)
						}
					);

					if (!updateResponse.ok) {
						throw new Error('Failed to update referral redeemed by');
					}

					const updatedData = await updateResponse.json();
				}

				if (isEmailInReferrer(data, existingUserDetails.attributes.Email)) {
					// increase count of the referrer
					// Retrieve the current `timesIUsedThisCoupon` value
					const currentReferral = data?.data[0];

					if (currentReferral?.attributes?.timesIUsedThisCoupon) {
						const currentCount = parseInt(currentReferral.attributes.timesIUsedThisCoupon, 10) || 0;

						// Increment the count
						const updatedCount = currentCount + 1;

						// Make a PUT request to update `timesIUsedThisCoupon`
						const updateResponse = await fetch(
							`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customer-referrals/${currentReferral.id}`,
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									data: {
										timesIUsedThisCoupon: updatedCount
									}
								})
							}
						);

						if (!updateResponse.ok) {
							throw new Error('Failed to update referral count');
						}

						const updatedData = await updateResponse.json();
					} else {
						console.error('Failed to retrieve current referral count');
					}
				}
			}
		} catch (error) {
			console.error('Error in handleReferralCode:', error);
		}
	};

	const handleSendEmail = async () => {
		try {
			const response = await fetch('/api/sendEmail', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					adminDetails: {
						cartData: cartData,
						userData: existingUserDetails,
						amount: totalPrice,
						currency: 'EUR',
						quantity: totalQuantity
					},
					userDetails: {
						cartData: cartData,
						userData: existingUserDetails,
						amount: totalPrice,
						currency: 'EUR',
						quantity: totalQuantity
					}
				})
			});
			if (!response.ok) {
				throw new Error(`Failed to send email: ${response.statusText}`);
			}
			const data = await response.json();
		} catch (error) {
			console.error('Error in handleSendEmail:', error);
		}
	};

	const handleSendWhatsApp = async () => {
		const defaultAddress = existingUserDetails?.attributes.customer_delivery_addresses?.data.find(
			address => address.attributes.isDefaultAddress
		);
		try {
			const response = await fetch('/api/sendWhatsApp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contactNumbers: ['+4915778559164'],
					templateId: 2,
					senderNumber: `${defaultAddress?.attributes.PhoneNumber || '+4915778559164'}`
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
			}

			const data = await response.json();
		} catch (error) {
			console.error('Error in handleSendWhatsApp:', error);
		}
	};

	const handlePOSTCartToCMS = async () => {
		try {
			setIsLoading(true);

			// Process cart items
			await Promise.all(
				Object.entries(cartData).map(async ([dayIndex, day]: [string, DayCart]) => {
					const numericDayIndex = Number(dayIndex);
					if (day.items.length === 0) return;
					await addCartDataToCMS(numericDayIndex, day.deliveryDate, day.deliveryTime);
				})
			);

			try {
				await handleSendEmail();
				await handleSendWhatsApp();
			} catch (error) {
				console.error('Error sending email:', error);
			}

			// Handle points
			try {
				if (isPointsApplied) {
					await updateCustomerDabbaPoints(redeemedPoints, 'decrement');
				} else {
					await updateCustomerDabbaPoints(Math.round(totalPrice), 'increment');
				}
				// Fetch updated points after the operation
				await dispatch(fetchDabbaPoints(user?.uid));
			} catch (error) {
				console.error('Error handling points:', error);
				throw error;
			}

			// Handle referral code if present
			if (isPromoCodeReferral) {
				await handleReferralCode();
			}

			// Get recent order and clear states
			await getRecentOrder();
			dispatch(clearCart());
			dispatch(clearRedeemedPoints());
			dispatch(clearPromoCode());

			// Redirect to orders page
			router.push(`${PROFILE}?tab=${ORDERS}`);
		} catch (error) {
			console.error('Error in handlePOSTCartToCMS:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const uploadFileToStrapi = async (file: File, deliveryDate: string, customerAddress: string) => {
		try {
			const formData = new FormData();
			formData.append('files', file);

			// Add caption metadata
			formData.append(
				'fileInfo',
				JSON.stringify({
					caption: `${deliveryDate}`,
					alternativeText: `Label for delivery on_${deliveryDate}`
				})
			);

			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/upload`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Failed to upload file: ${errorData?.error?.message || 'Unknown error'}`);
			}

			const data = await response.json();

			if (Array.isArray(data) && data.length > 0) {
				return {
					...data[0],
					caption: `Delivery Date: ${deliveryDate}`,
					alternativeText: `Label for delivery on ${deliveryDate}`
				};
			} else {
				throw new Error('Unexpected response from Strapi upload API.');
			}
		} catch (error) {
			console.error('Error in uploadFileToStrapi:', error);
			throw error;
		}
	};

	const addCartDataToCMS = async (dayIndex: number, deliveryDate: string, deliveryTime: string) => {
		try {
			const [startTime, endTime] = deliveryTime.split(' - ');
			const startDateTime = moment(`${deliveryDate} ${startTime}`, 'DD/MM/YYYY HH:mm').toISOString();

			const defaultAddress = existingUserDetails?.attributes.customer_delivery_addresses?.data.find(
				address => address.attributes.isDefaultAddress
			);

			const customerName =
				defaultAddress?.attributes.FirstName + ' ' + defaultAddress?.attributes.LastName || 'Guest';

			const customerAddress = defaultAddress?.attributes.Address || 'No Address';

			const menuItems = await convertMenuItemToOrderItemType(
				cartData,
				dayIndex,
				deliveryDate,
				customerName,
				JSON.stringify(customerAddress)
			);

			// Calculate total contribution for this day's items
			const totalContribution = menuItems.reduce((sum, item) => {
				return parseFloat((sum + (parseFloat(item.itemContribution) || 0)).toFixed(2));
			}, 0);

			// Upload LabelImage for each item
			const itemsWithUploadedImages = await Promise.all(
				menuItems.map(async item => {
					if (item.LabelImage) {
						try {
							// Check if LabelImage is an array of files
							if (Array.isArray(item.LabelImage)) {
								const uploadedMedias = await Promise.all(
									item.LabelImage.map(async file => {
										const uploadedMedia = await uploadFileToStrapi(
											file,
											deliveryDate,
											customerAddress
										);
										return { ...uploadedMedia };
									})
								);
								return { ...item, LabelImage: uploadedMedias };
							} else {
								// Fallback for single file (if any)
								const uploadedMedia = await uploadFileToStrapi(
									item.LabelImage,
									deliveryDate,
									customerAddress
								);
								return { ...item, LabelImage: { ...uploadedMedia } };
							}
						} catch (error) {
							console.error('Error uploading LabelImage:', error);
						}
					}
					return item;
				})
			);

			// total number of days the order is placed
			const totalDays = Object.keys(cartData).length || 0;

			const payload = {
				data: {
					Name: customerName || 'Guest',
					PhoneNumber: defaultAddress?.attributes.PhoneNumber || 'N/A',
					Email: existingUserDetails?.attributes.Email || 'N/A',
					UiD: existingUserDetails?.attributes.UiD,
					Customer: existingUserDetails?.id,
					Address: defaultAddress?.attributes.Address || customerAddress || 'N/A',
					isOrderCancelled: false,
					isOrderCompleted: false,
					MenuItems: itemsWithUploadedImages,
					deliveryDate: startDateTime,
					GrandTotal: getGrandTotalAddingMWST(Number(totalPrice.toFixed(2)), discount),
					OrderStatus: ORDER_STATUS.ACCEPTED,
					DabbaPointsUsed: isPointsApplied ? Math.round(redeemedPoints / (totalDays > 0 ? totalDays : 1)) : 0,
					TotalItemContributingPrice: totalContribution.toFixed(2)
				}
			};

			const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('ERROR IN ADD CART DATA TO CMS', errorData);
				throw new Error(`Failed to add cart data to CMS: ${errorData?.error?.message || 'Unknown error'}`);
			}

			const data = await response.json();
		} catch (error) {
			console.error('Error in addCartDataToCMS:', error);
		}
	};

	const updateCustomerDabbaPoints = async (dabbaPoints: number, action: 'increment' | 'decrement') => {
		if (!user?.uid) return;

		try {
			const actionThunk = action === 'increment' ? incrementDabbaPoints : decrementDabbaPoints;
			await dispatch(
				actionThunk({
					userId: user.uid,
					points: dabbaPoints
				})
			).unwrap();
		} catch (error) {
			console.error('Error updating customer dabba points:', error);
			throw error;
		}
	};

	const getRecentOrder = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders?pagination[pageSize]=5&filters[UiD][$eq]=${user.uid}&sort=createdAt:desc&${process.env.NEXT_PUBLIC_STRAPI_FETCH_ALL_DATA_FLAG_QUERY}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch recent order');
			}

			const data = await response.json();
			setRecentOrder(data.data);
		} catch (error) {
			console.error('Error fetching recent order:', error);
		}
	};

	if (!recentOrder || !existingUserDetails || isProcessing) {
		return (
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '70vh'
				}}
			>
				<Stack
					direction={isMobile ? 'column' : 'row'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<Image
						src={'/assets/icons/confirm-order.svg'}
						alt={'Thank you'}
						width={55}
						height={55}
					/>
				</Stack>
				<Box sx={{ my: 2 }}>
					<Typography
						variant='h3'
						align='center'
					>
						{isProcessing ? 'Processing your Order...' : 'We are placing your Order!'}
					</Typography>
					<Typography
						variant='body1'
						align='center'
					>
						Please do not refresh your browser or close the tab
					</Typography>
					<Typography
						variant='body1'
						align='center'
					>
						The order confirmation has been sent to your email address{' '}
						{existingUserDetails?.attributes.Email || 'your email'}
					</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />
				<Loading />
			</Container>
		);
	}

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '70vh'
			}}
		>
			<Confetti
				width={width}
				height={height}
				recycle={false}
				numberOfPieces={500}
				tweenDuration={10000}
			/>
			<Box
				sx={{
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					my: 2,
					p: 4
				}}
			>
				<Stack
					direction={isMobile ? 'column' : 'row'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<Image
						src={'/assets/icons/confirm-order.svg'}
						alt={'Thank you'}
						width={55}
						height={55}
					/>
				</Stack>
				<Box sx={{ my: 2 }}>
					<Typography
						variant='h3'
						align='center'
					>
						We are placing your Order!
					</Typography>
					<Typography
						variant='body1'
						align='center'
					>
						Please do not refresh your browser or close the tab
					</Typography>
					<Typography
						variant='body1'
						align='center'
					>
						The order confirmation has been sent to your email address{' '}
						{existingUserDetails?.attributes.Email || 'your email'}
					</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Stack
					direction={isMobile ? 'column' : 'row'}
					justifyContent={'center'}
					alignItems={'center'}
					spacing={2}
					sx={{
						my: 2,
						mt: 2
					}}
				>
					<Button
						variant='outlined'
						onClick={() => router.push(`${PROFILE}?tab=${ORDERS}`)}
					>
						View Orders
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default ThankYou;
