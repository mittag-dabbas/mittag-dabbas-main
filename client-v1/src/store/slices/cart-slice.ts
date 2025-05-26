import { createSlice } from '@reduxjs/toolkit';
import { CartItem, DefaultDeliveryAddress } from '@/types';

export interface DayCart {
	items: CartItem[]; // Items for a specific day (tab)
	deliveryTime: string; // Delivery time for that day
	deliveryDate: string; // Delivery date for that day
}

export interface CartState {
	days: { [key: number]: DayCart }; // Each day keyed by endpointIndex
	deliveryAddress: string; // Global delivery address for the entire cart
	defaultDeliveryAddress?: DefaultDeliveryAddress; // Default delivery address for the user
	totalQuantity: number; // Full total of all items across all days
	totalPrice: number; // Full total price across all days
	changed: boolean;
	discount: number;
	promoCode: string;
	isPromoCodeApplied: boolean;
	isBagOpen: boolean;
	isCartEmpty: boolean;
}

interface AddItemPayload {
	item: CartItem;
	endpointIndex: number;
}

interface SetDeliveryTimePayload {
	endpointIndex: number;
	deliveryTime: string;
}

interface SetDeliveryDatePayload {
	endpointIndex: number;
	deliveryDate: string;
}

interface SetDeliveryAddressPayload {
	deliveryAddress: string;
}

interface SetDefaultDeliveryAddressPayload {
	defaultDeliveryAddress: DefaultDeliveryAddress;
}

const initialState: CartState = {
	days: {},
	deliveryAddress: '',
	defaultDeliveryAddress: undefined,
	totalQuantity: 0,
	totalPrice: 0,
	changed: false,
	discount: 0,
	promoCode: '',
	isPromoCodeApplied: false,
	isBagOpen: false,
	isCartEmpty: true
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart(state, action) {
			const { item, endpointIndex } = action.payload as AddItemPayload;
			state.changed = true;

			// Initialize day cart if not present
			if (!state.days[endpointIndex]) {
				state.days[endpointIndex] = {
					items: [],
					deliveryTime: '',
					deliveryDate: ''
				};
			}

			const dayCart = state.days[endpointIndex];
			const existingItem = dayCart.items.find(cartItem => cartItem.data.id === item.data.id);
			const itemPrice =
				item.data.attributes.OfferedPrice > 0
					? item.data.attributes.OfferedPrice
					: item.data.attributes.OriginalPrice;

			if (!existingItem) {
				// Add a new item
				dayCart.items.push({ ...item, quantity: 1, endpointIndex });
				state.totalQuantity += 1; // Update total quantity
				state.totalPrice += itemPrice; // Update total price
			} else {
				// Increase quantity if item already exists
				existingItem.quantity += 1;
				state.totalQuantity += 1;
				state.totalPrice += itemPrice;
			}

			state.isCartEmpty = state.totalQuantity === 0;
		},

		removeItemFromCart(state, action) {
			const { id, endpointIndex } = action.payload;
			const dayCart = state.days[endpointIndex];

			if (dayCart) {
				const existingItem = dayCart.items.find(item => item.data.id === id);

				if (existingItem) {
					state.changed = true;
					const itemPrice =
						existingItem.data.attributes.OfferedPrice > 0
							? existingItem.data.attributes.OfferedPrice
							: existingItem.data.attributes.OriginalPrice;

					if (existingItem.quantity === 1) {
						// Remove the item if quantity is 1
						dayCart.items = dayCart.items.filter(item => item.data.id !== id);
						state.totalQuantity -= 1;
						state.totalPrice -= itemPrice;
					} else {
						// Decrease the quantity
						existingItem.quantity -= 1;
						state.totalQuantity -= 1;
						state.totalPrice -= itemPrice;
					}

					// Clean up empty day cart
					if (dayCart.items.length === 0) {
						delete state.days[endpointIndex];
					}
				}
				// Update isCartEmpty state
				state.isCartEmpty = state.totalQuantity === 0;
			}
		},

		deleteItemFromCart(state, action) {
			const { id, endpointIndex } = action.payload;
			const dayCart = state.days[endpointIndex];

			if (dayCart) {
				const itemToDelete = dayCart.items.find(item => item.data.id === id);

				if (itemToDelete) {
					state.changed = true;
					const itemPrice =
						itemToDelete.data.attributes.OfferedPrice > 0
							? itemToDelete.data.attributes.OfferedPrice
							: itemToDelete.data.attributes.OriginalPrice;

					// Update the total quantity and total price based on the item's quantity and price
					state.totalQuantity -= itemToDelete.quantity;
					state.totalPrice -= itemPrice * itemToDelete.quantity;

					// Remove the item from the day's cart
					dayCart.items = dayCart.items.filter(item => item.data.id !== id);

					// Remove the day cart if it has no items left
					if (dayCart.items.length === 0) {
						delete state.days[endpointIndex];
					}
				}

				// Update isCartEmpty state
				state.isCartEmpty = state.totalQuantity === 0;
			}
		},

		clearCart(state) {
			state.days = {};
			state.deliveryAddress = '';
			state.defaultDeliveryAddress = undefined;
			state.totalQuantity = 0;
			state.totalPrice = 0;
			state.changed = true;
			state.promoCode = '';
			state.discount = 0;
			state.isPromoCodeApplied = false;
			state.isBagOpen = false;
			state.isCartEmpty = true;
		},

		setCart(state, action) {
			const { days, totalQuantity, totalPrice, deliveryAddress } = action.payload;
			state.days = days;
			state.totalQuantity = totalQuantity || 0;
			state.totalPrice = totalPrice || 0;
			state.deliveryAddress = deliveryAddress || '';
			state.changed = false;
			state.isCartEmpty = state.totalQuantity === 0;
		},

		setDeliveryTime(state, action) {
			const { endpointIndex, deliveryTime } = action.payload as SetDeliveryTimePayload;
			state.changed = true;

			if (!state.days[endpointIndex]) {
				state.days[endpointIndex] = {
					items: [],
					deliveryTime: deliveryTime,
					deliveryDate: ''
				};
			} else {
				state.days[endpointIndex].deliveryTime = deliveryTime;
			}
		},

		setDeliveryDate(state, action) {
			const { endpointIndex, deliveryDate } = action.payload as SetDeliveryDatePayload;
			state.changed = true;

			if (!state.days[endpointIndex]) {
				state.days[endpointIndex] = {
					items: [],
					deliveryTime: '',
					deliveryDate: deliveryDate
				};
			} else {
				state.days[endpointIndex].deliveryDate = deliveryDate;
			}
		},

		setDeliveryAddress(state, action) {
			const { deliveryAddress } = action.payload as SetDeliveryAddressPayload;
			state.deliveryAddress = deliveryAddress;
			state.changed = true;
		},

		setDefaultDeliveryAddress(state, action) {
			const { defaultDeliveryAddress } = action.payload as SetDefaultDeliveryAddressPayload;
			state.defaultDeliveryAddress = defaultDeliveryAddress;
		},

		setDiscount(state, action) {
			state.discount = action.payload.discount;
		},

		setPromoCode(state, action) {
			state.promoCode = action.payload.promoCode;
			state.isPromoCodeApplied = false;
		},

		setPromoCodeApplied(state, action) {
			state.isPromoCodeApplied = action.payload.isApplied;
		},

		clearPromoCode(state) {
			state.promoCode = '';
			state.discount = 0;
			state.isPromoCodeApplied = false;
		},

		setIsBagOpen(state, action) {
			state.isBagOpen = action.payload.isBagOpen;
		}
	}
});

export const {
	addItemToCart,
	removeItemFromCart,
	clearCart,
	setCart,
	setDeliveryTime,
	setDeliveryDate,
	setDeliveryAddress,
	deleteItemFromCart,
	setDefaultDeliveryAddress,
	setDiscount,
	setPromoCode,
	setPromoCodeApplied,
	clearPromoCode,
	setIsBagOpen
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
