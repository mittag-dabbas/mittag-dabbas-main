'use server';

import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/helper';
import { DayCart } from '@/store/slices/cart-slice';
import { CANCEL, THANKYOU } from '@/lib/constants';

export const createStripeUrl = async (
	days: { [key: number]: DayCart },
	totalQuantity: number,
	totalPrice: number,
	userEmail?: string
) => {
	try {
		// Calculate proportional prices for each item
		const allItems = Object.values(days).flatMap(day => day.items);

		// Calculate original total before any discounts
		const originalTotal = allItems.reduce((sum, item) => {
			const itemPrice =
				item.data.attributes.OfferedPrice > 0
					? item.data.attributes.OfferedPrice
					: item.data.attributes.OriginalPrice;
			return sum + itemPrice * item.quantity;
		}, 0);

		// Create line items with proportionally adjusted prices
		const line_items = Object.values(days).flatMap((dayCart, index) =>
			dayCart.items.map(item => {
				const itemPrice =
					item.data.attributes.OfferedPrice > 0
						? item.data.attributes.OfferedPrice
						: item.data.attributes.OriginalPrice;

				// Calculate this item's contribution ratio to the original total
				const contributionRatio = (itemPrice * item.quantity) / originalTotal;

				// Calculate this item's proportional price from the final total
				const adjustedItemPrice = (totalPrice * contributionRatio) / item.quantity;

				return {
					price_data: {
						currency: 'eur',
						unit_amount: Math.round(adjustedItemPrice * 100), // Convert to cents
						product_data: {
							name: item.data.attributes.Name,
							description: `Quantity: ${item.quantity}`,
							metadata: {
								documentId: item.data.id,
								originalPrice: itemPrice.toString(), // Convert to string as Stripe metadata only accepts strings
								quantity: item.quantity.toString(),
								dayIndex: index.toString(),
								day: index.toString(),
								_DAY: index.toString() // Adding the _DAY format you requested
							}
						}
					},
					quantity: item.quantity
				};
			})
		);

		// Handle free orders (total < 0.5)
		if (totalPrice < 0.5) {
			const coupon = await stripe.coupons.create({
				percent_off: 100,
				duration: 'once'
			});

			const session = await stripe.checkout.sessions.create({
				automatic_tax: { enabled: false },
				customer_email: userEmail,
				payment_method_types: ['card'],
				mode: 'payment',
				success_url: absoluteUrl(THANKYOU),
				cancel_url: absoluteUrl(CANCEL),
				line_items: [
					{
						price_data: {
							currency: 'eur',
							unit_amount: 50,
							product_data: {
								name: 'Order',
								description: Object.values(days)
									.map(dayCart => dayCart.items.map(item => item.data.attributes.Name).join(', '))
									.join(', '),
								metadata: {
									quantity: totalQuantity
								}
							}
						},
						quantity: 1
					}
				],
				discounts: [
					{
						coupon: coupon.id
					}
				]
			});

			return session.url;
		}

		// Create normal session with proportional line items
		const session = await stripe.checkout.sessions.create({
			automatic_tax: { enabled: false },
			customer_email: userEmail,
			payment_method_types: ['card'],
			mode: 'payment',
			success_url: absoluteUrl(THANKYOU),
			cancel_url: absoluteUrl(CANCEL),
			line_items
		});

		return session.url;
	} catch (error) {
		console.error('Error creating Stripe checkout session:', error);
		throw new Error('Unable to create Stripe checkout session. Please try again later.');
	}
};

export async function createPayment(paymentData: any) {
	try {
		const body = { data: paymentData };

		const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/payments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		const responseText = await response.text();

		if (!response.ok) {
			throw new Error(
				`Failed to create payment record: ${response.status} ${response.statusText} - ${responseText}`
			);
		}

		return JSON.parse(responseText);
	} catch (error) {
		console.error('Detailed error in createPayment:', error);
		throw new Error('Unable to process payment. Please try again later.');
	}
}
