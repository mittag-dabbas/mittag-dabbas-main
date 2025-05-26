import { NavbarProfileMenuItemsType, Option } from '@/types';

// ROUTES CONSTANTS
export const HOME = '/';
export const SIGN_IN = '/sign-in';
export const SIGN_UP = '/sign-up';
export const ENQUIRY = '/enquiry';
export const DAILY_OFFICE_MEAL = '/daily-office-meal';
export const CORPORATE_CATERING = '/corporate-catering';
export const PROFILE = '/profile';
export const SUBSCRIPTION = '/subscription';
export const MENU = '/menu';
export const CHECKOUT = '/checkout';
export const BAG = '/bag';
export const THANKYOU = '/thankyou';
export const CANCEL = '/cancel';
export const FORGOTPASSWORD = '/forgot-password';
export const RESETPASSWORD = '/reset-password';
export const LOYALTY = '/loyalty';
export const REFERRAL = '/referral';
export const ADMIN = '/admin';

// QUERY PARAMS
export const ADDRESS = 'address';
export const ORDERS = 'orders';
export const SETTINGS = 'subscription';
export const ACCOUNT = 'account';
export const LOYALTY_POINTS = 'rewards';
export const REFERRALS = 'referrals';

// EURO CURRENCY
export const EURO = '€';

// order status
export const ORDER_STATUS = {
	ACCEPTED: 'ACCEPTED',
	CANCELLED: 'CANCELLED',
	READY: 'READY',
	ON_THE_WAY: 'ON-THE-WAY',
	DELIVERED: 'DELIVERED'
};

// navbar profile menu items
export const navbarProfileMenuItems: NavbarProfileMenuItemsType[] = [
	{
		icon: '/assets/icons/account.svg',
		label: 'My Account',
		route: PROFILE,
		tab: ACCOUNT
	},
	{
		icon: '/assets/icons/orders.svg',
		label: 'My Orders',
		route: PROFILE,
		tab: ORDERS
	},
	{
		icon: '/assets/icons/address.svg',
		label: 'My Address',
		route: PROFILE,
		tab: ADDRESS
	},
	// {
	// 	icon: '/assets/icons/settings.svg',
	// 	label: 'My Subscription',
	// 	route: PROFILE,
	// 	tab: SETTINGS
	// },
	{
		icon: '/assets/icons/rewards.svg',
		label: 'My Rewards',
		route: PROFILE,
		tab: LOYALTY_POINTS
	},
	{
		icon: '/assets/icons/account.svg',
		label: 'My Referrals',
		route: PROFILE,
		tab: REFERRALS
	},
	{
		icon: '/assets/icons/logout.svg',
		label: 'Logout',
		actionType: 'logout', // Special action type for logout
		color: 'error'
	}
];

export const addresses: Option[] = [
	{ label: 'Fregestraße, Berlin, 12159, Germany', value: 'address1' }
	// Add more addresses if needed
];

export const deliveryTimes: Option[] = [
	{ label: '11:00 - 12:00', value: '11-12' }
	// { label: '12:00 - 13:00', value: '12-13' },
	// { label: '13:00 - 14:00', value: '13-14' }
];

export const filterOptions = {
	Categories: ['Salads & Bowls', 'Sandwich & Wraps', 'Pasta', 'Lunch Classics', 'Soups & Desserts'],
	FoodPreference: ['Vegan', 'Vegetarian', 'Pasta', 'Meat', 'Fish'],
	Allergens: ['Milk or Lactose', 'Nuts & Peanuts', 'Eggs', 'Gluten', 'Sesames', 'Mustard', 'Celery', 'Soya'],
	SpiceLevel: ['Mild', 'Hot', 'Cold', 'Spicy']
};

export const dayWiseTabMenuApiEndPoint: string[] = [
	'/monday-menus',
	'/tuesday-menus',
	'/wednesday-menus',
	'/thursday-menus',
	'/friday-menus'
];

export const dayWiseTabMenu: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const daysOfWeek = [
	{ key: 'MondayItems', name: 'Monday' },
	{ key: 'TuesdayItems', name: 'Tuesday' },
	{ key: 'WednesdayItems', name: 'Wednesday' },
	{ key: 'ThursdayItems', name: 'Thursday' },
	{ key: 'FridayItems', name: 'Friday' }
];

export const DAY_KEYS = ['MondayItems', 'TuesdayItems', 'WednesdayItems', 'ThursdayItems', 'FridayItems'] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export const profileTabs = [
	{
		label: 'My Account',
		icon: '/assets/icons/account.svg',
		value: 0
	},
	{
		label: 'My Orders',
		icon: '/assets/icons/orders.svg',
		value: 1
	},
	{
		label: 'My Address',
		icon: '/assets/icons/address.svg',
		value: 2
	},
	// {
	// 	label: 'My Subscription',
	// 	icon: '/assets/icons/settings.svg',
	// 	value: 3
	// },
	{
		label: 'My Rewards',
		icon: '/assets/icons/rewards.svg',
		value: 4
	},
	{
		label: 'My Referrals',
		icon: '/assets/icons/account.svg',
		value: 5
	}
];

// social media links
export const FACEBOOK = 'https://www.facebook.com/profile.php?id=61569972157561';
export const INSTAGRAM = 'https://www.instagram.com/mittagdabbas/';
export const LINKEDIN = 'https://www.linkedin.com/company/mittag-dabbas';

// admin email
export const ADMIN_EMAIL_1 = 'Mittagdabbas@tandoori-naechte.com';
export const ADMIN_EMAIL_2 = 'strapi@tandoori-naechte.com';
export const DOMAIN_EMAIL = 'order@mittag-dabbas.com';
