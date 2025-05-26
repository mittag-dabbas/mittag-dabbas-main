import { DayCart } from '@/store/slices/cart-slice';
import {
	CartItem,
	CompanySubsidariesApiReturnType,
	DayItem,
	DefaultDeliveryAddress,
	ReferralApiReturnType,
	StoreClosingTimeApiReturnType
} from '@/types';
import moment from 'moment';
import { ORDER_STATUS } from './constants';

export const getFoodPreferenceIcon = (foodPreference: string): string => {
	switch (foodPreference) {
		case 'Vegan':
			return '/assets/icons/vegan.svg';
		case 'Vegetarian':
			return '/assets/icons/vegetarian.svg';
		case 'Meat':
			return '/assets/icons/meat.svg';
		case 'Fish':
			return '/assets/icons/fish.svg';
		default:
			return '/assets/icons/vegan.svg';
	}
};

export const getSpiceLevelIcon = (spiceLevel: string): string => {
	switch (spiceLevel) {
		case 'Mild':
			return '/assets/icons/mild.svg';
		case 'Hot':
			return '/assets/icons/hot.svg';
		case 'Cold':
			return '/assets/icons/cold.svg';
		case 'Spicy':
			return '/assets/icons/spicy.svg';
		default:
			return '/assets/icons/mild.svg';
	}
};

export const getAllergensIcon = (allergens: string): string => {
	switch (allergens) {
		case 'Milk or Lactose':
			return '/assets/icons/milk.svg';
		case 'Nuts & Peanuts':
			return '/assets/icons/nuts.svg';
		case 'Eggs':
			return '/assets/icons/eggs.svg';
		case 'Gluten':
			return '/assets/icons/gluten.svg';
		case 'Sesames':
			return '/assets/icons/sesames.svg';
		case 'Mustard':
			return '/assets/icons/mustard.svg';
		case 'Celery':
			return '/assets/icons/celery.svg';
		case 'Soya':
			return '/assets/icons/soya.svg';
		default:
			return '/assets/icons/milk.svg';
	}
};

export const getAllergensText = (allergens: string): string => {
	switch (allergens) {
		case 'Milk or Lactose':
			return 'Milk';
		case 'Nuts & Peanuts':
			return 'Nuts & Peanuts';
		case 'Eggs':
			return 'Eggs';
		case 'Gluten':
			return 'Gluten';
		case 'Sesames':
			return 'Sesame';
		case 'Mustard':
			return 'Mustard';
		case 'Celery':
			return 'Cereals containing gluten (rye, wheat)';
		case 'Soya':
			return 'Soya';
		default:
			return 'Milk';
	}
};

export const getOrderStatus = (status: string): { color: string; text: string } => {
	switch (status) {
		case ORDER_STATUS.ACCEPTED:
			return { color: 'success', text: 'Accepted' };
		case ORDER_STATUS.CANCELLED:
			return { color: 'error', text: 'Cancelled' };
		case ORDER_STATUS.READY:
			return { color: 'warning', text: 'Ready' };
		case ORDER_STATUS.ON_THE_WAY:
			return { color: 'info', text: 'On the way' };
		case ORDER_STATUS.DELIVERED:
			return { color: 'success', text: 'Delivered' };
		default:
			return { color: 'error', text: 'Cancelled' };
	}
};

export const getTabDataForCurrentWeek = () => {
	let startOfWeek = moment().startOf('isoWeek'); // Start of this week (Monday)
	const today = moment();
	let todayIndex = 1; // Default to Tuesday if today is Monday

	// If today is Friday, Saturday, or Sunday, move startOfWeek to next Monday
	if (today.isoWeekday() >= 5) {
		startOfWeek = startOfWeek.add(1, 'week');
		todayIndex = 0; // Default to Monday for the new week
	}

	// Generate tabData from Monday to Friday of the identified week
	const tabData = [];

	for (let i = 0; i <= 4; i++) {
		const day = startOfWeek.clone().add(i, 'days');
		tabData.push({
			label: day.format('dddd'), // Day name (e.g., 'Monday')
			date: day.format('DD/MM/YYYY') // Date (e.g., '04/11/2024')
		});

		// If the current day in the loop is today, adjust todayIndex
		if (day.isSame(today, 'day') && today.isoWeekday() < 5) {
			todayIndex = i + 1; // Set the default tab to the next day
		}
	}

	return { tabData, todayIndex };
};

export const getGrandTotalAddingMWST = (total: number, discount: number = 0): number => {
	const value = Number((total - (discount || 0)).toFixed(2));

	if (value <= 0.5) {
		return 0;
	}

	return value;
};

export const getMWST = (total: number): number => {
	return Number((total * 0.07).toFixed(2));
};

export function absoluteUrl(path: string) {
	return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

// Add this helper function to calculate total cart value
const calculateCartTotal = (cartData: { [key: number]: DayCart }) => {
	const allItems = Object.values(cartData).flatMap(day => day.items);
	return allItems.reduce((sum, item) => {
		const itemPrice =
			item.data.attributes.OfferedPrice > 0
				? item.data.attributes.OfferedPrice
				: item.data.attributes.OriginalPrice;
		return sum + itemPrice * item.quantity;
	}, 0);
};

export async function convertMenuItemToOrderItemType(
	cartData: { [key: number]: DayCart },
	dayIndex: number,
	deliveryDate: string,
	customerName: string,
	customerAddress: string
) {
	const dayCart = cartData[dayIndex];
	if (!dayCart) return [];

	// Calculate original total before any discounts
	const originalTotal = calculateCartTotal(cartData);

	const items = await Promise.all(
		dayCart.items.map(async (item: CartItem) => {
			const attributes = item.data.attributes;
			const quantity = item.quantity;

			// Calculate item's price and contribution
			const itemPrice = attributes.OfferedPrice > 0 ? attributes.OfferedPrice : attributes.OriginalPrice;

			// Calculate this item's contribution ratio to the original total
			const contributionRatio = (itemPrice * quantity) / originalTotal;
			const itemContribution = (contributionRatio * originalTotal).toFixed(2);

			const formattedDate = moment(deliveryDate, 'DD/MM/YYYY').format('DD-MM-YYYY');

			// Create an array of promises to generate label images equal to the quantity
			const labelImagePromises = Array.from({ length: quantity }, (_, index) => {
				// You might want to add an extra query parameter (like an index or random seed)
				// if your image generation API should produce different images per call.
				const fetchURL = `/api/generate-image?name=${encodeURIComponent(
					customerName
				)}&address=${encodeURIComponent(customerAddress)}&itemName=${encodeURIComponent(attributes.Name)}`;
				return fetch(fetchURL).then(async res => {
					if (res.ok) {
						const blob = await res.blob();
						// Include the index in the file name to differentiate each file
						return new File([blob], `${attributes.Name || 'label'}_${formattedDate}_${index + 1}.png`, {
							type: 'image/png'
						});
					}
					return null;
				});
			});

			// Wait for all label images to be generated and filter out any failures (nulls)
			const labelImageFiles = (await Promise.all(labelImagePromises)).filter(file => file !== null);

			return {
				Name: attributes.Name || 'Unknown Item',
				TotalPrice: itemPrice.toFixed(2),
				Description: attributes.Description || '',
				ItemImage: attributes.ItemImage.data || {},
				quantity: quantity.toString(),
				Allergens: attributes.Allergens?.data
					? attributes.Allergens.data.map(allergen => allergen.attributes.Title).join(', ')
					: 'None',
				Categories: attributes.Categories?.data?.attributes?.Title || 'Uncategorized',
				FoodPreference: attributes.FoodPreference?.data?.attributes?.Title || 'None',
				SpiceLevel: attributes.SpiceLevel?.data?.attributes?.Title || 'None',
				LabelImage: labelImageFiles,
				// Add contribution metrics
				itemContribution: itemContribution
			};
		})
	);

	return items;
}

export type EmailToCompanySubsidaryDetails = {
	CompanyName: string | null;
	DiscountPercent: number | null;
	Domain: string | null;
	MenuItemPrice: number | null;
};

// get company subsidary discount percentage from email
export const findCompanySubsidaryDetailsByEmail = (
	email: string,
	inputCompanySubsidariesObject: CompanySubsidariesApiReturnType
): EmailToCompanySubsidaryDetails => {
	for (const company of inputCompanySubsidariesObject.data) {
		const emails = company.attributes.Email;
		if (emails.some(e => e.Email === email)) {
			return {
				CompanyName: company.attributes.CompanyName,
				Domain: company.attributes.Domain,
				DiscountPercent: company.attributes.DiscountPercent,
				MenuItemPrice: company.attributes.MenuItemPrice
			};
		}
	}

	// check if the domain of the email (only get whats between @ and .) is in the domain of the company
	// if so, return the company details
	const domain = email.split('@')[1].split('.')[0];

	const company = inputCompanySubsidariesObject.data.find(c => c.attributes.Domain === domain);
	if (company) {
		return {
			CompanyName: company.attributes.CompanyName,
			Domain: company.attributes.Domain,
			DiscountPercent: null,
			MenuItemPrice: company.attributes.MenuItemPrice
		};
	}

	return {
		CompanyName: null,
		Domain: null,
		DiscountPercent: null,
		MenuItemPrice: null
	};
};

export const isUserNormal = (
	inputCompanySubsidariesObject: CompanySubsidariesApiReturnType,
	email?: string
): boolean => {
	// if user is absent ie not signed in, return true
	if (email === null || email === undefined) {
		return true;
	}

	const emailDomain = email.split('@')[1].split('.')[0];
	if (!emailDomain) {
		throw new Error('Invalid email format');
	}

	// Check if the domain exists in any of the data object's Domain attributes
	for (const item of inputCompanySubsidariesObject.data) {
		if (item.attributes.Domain === emailDomain) {
			return false; // Domain exists
		}
	}

	return true; // Domain does not exist
};

export const calculatePrice = (
	originalPrice: number,
	offeredPrice: number,
	discountPercentage: number,
	companyMenuItemPrice?: number,
	isItemDrinks?: boolean
) => {
	if (isItemDrinks) {
		return originalPrice.toFixed(2);
	}

	if (companyMenuItemPrice) {
		const finalCompanyPrice =
			offeredPrice > 0
				? Math.min(originalPrice, Math.min(offeredPrice, companyMenuItemPrice))
				: Math.min(originalPrice, companyMenuItemPrice);
		return (finalCompanyPrice * (1 - discountPercentage / 100)).toFixed(2);
	} else if (discountPercentage && discountPercentage > 0) {
		const finalPrice = originalPrice * (1 - discountPercentage / 100);
		return finalPrice.toFixed(2);
	}

	// return originalPrice.toFixed(2);
};

export function isEmailInReferring(apiResponse: ReferralApiReturnType, email: string): boolean {
	try {
		// Extract the 'referring' data
		const referringData = apiResponse?.data?.[0]?.attributes?.referring?.data || [];
		// Iterate through the referring list to check if the email exists
		for (const referringItem of referringData) {
			if (referringItem?.attributes?.Email === email) {
				return true;
			}
		}

		// If no match is found, return false
		return false;
	} catch (error) {
		// Handle cases where the expected structure is missing or incorrect
		console.error('Error processing API response:', error);
		return false;
	}
}

export function isEmailInReferrer(apiResponse: ReferralApiReturnType, email: string): boolean {
	try {
		// Extract the 'referrer' data
		const referrerData = apiResponse?.data?.[0]?.attributes?.referrer?.data;

		// Check if the email matches
		if (referrerData?.attributes?.Email === email) {
			return true;
		}

		// If no match is found, return false
		return false;
	} catch (error) {
		// Handle cases where the expected structure is missing or incorrect
		console.error('Error processing API response:', error);
		return false;
	}
}

export function isEmailInIsReferralRedeemedBy(apiResponse: ReferralApiReturnType, email: string): boolean {
	try {
		const redeemedByData = apiResponse?.data?.[0]?.attributes?.isReferralRedeemedBy?.data || [];

		for (const redeemedItem of redeemedByData) {
			if (redeemedItem?.attributes?.Email === email) {
				return true;
			}
		}

		return false;
	} catch (error) {
		console.error('Error processing API response:', error);
		return false;
	}
}

export function getLatestClosingTime(response?: StoreClosingTimeApiReturnType): number {
	if (!response || !response.data || response.data.length === 0) {
		return 20; // default to 8 PM
	}

	// Find the most recently updated or created entry
	const latestEntry = response.data.reduce((latest, current) => {
		const latestTimestamp = moment(latest.attributes.updatedAt || latest.attributes.createdAt).valueOf();
		const currentTimestamp = moment(current.attributes.updatedAt || current.attributes.createdAt).valueOf();
		return currentTimestamp > latestTimestamp ? current : latest;
	});

	// Extract the ClosingTime and format it to HH (24-hour format)
	const closingTime = latestEntry.attributes.ClosingTime.split(':')[0];

	return parseInt(closingTime);
}

export function getBestCouponCode(coupons: ReferralApiReturnType, myCouponCode: string): string | null {
	// Filter out any coupon which is your own
	const filteredCoupons = coupons.data.filter(item => {
		const couponCode = item.attributes.coupon.data.attributes.CouponCode;
		return couponCode !== myCouponCode;
	});

	if (filteredCoupons.length === 0) {
		// No coupon available that is not yours.
		return null;
	}

	// Sort by "freshness" and then by expiry date.
	// We calculate a "date score" as the maximum of createdAt and updatedAt.
	filteredCoupons.sort((a, b) => {
		const aCreated = new Date(a.attributes.createdAt).getTime();
		const aUpdated = new Date(a.attributes.updatedAt).getTime();
		const bCreated = new Date(b.attributes.createdAt).getTime();
		const bUpdated = new Date(b.attributes.updatedAt).getTime();

		const aScore = Math.max(aCreated, aUpdated);
		const bScore = Math.max(bCreated, bUpdated);

		// Sort descending by the "freshness" score:
		if (bScore !== aScore) {
			return bScore - aScore;
		}

		// If both have the same score, compare expiry dates.
		// (Convert the Expiry string to a Date; note that the format "YYYY-MM-DD" works.)
		const aExpiry = new Date(a.attributes.coupon.data.attributes.Expiry).getTime();
		const bExpiry = new Date(b.attributes.coupon.data.attributes.Expiry).getTime();

		return bExpiry - aExpiry; // farthest expiry comes first.
	});

	// Return the CouponCode of the top (best) coupon.
	return filteredCoupons[0].attributes.coupon.data.attributes.CouponCode;
}

export function calculateRefundPoints(grandTotal: number): number {
	// Convert euros to points (1 euro = 10 points)
	return Math.round(grandTotal * 10);
}
