export interface TestimonialsApiReturnType {
	data: Testimonial[];
	meta: Meta;
}

export interface Testimonial {
	id: number;
	attributes: TestimonialAttributesType;
}

export interface TestimonialAttributesType {
	Name: string;
	City: string;
	Description: string;
	Rating: number;
	Country: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	ProfilePicture: ProfilePicture;
}

export interface ProfilePicture {
	data: Data;
}

export interface Data {
	id: number;
	attributes: ProfilePictureAttributes;
}

export interface ProfilePictureAttributes {
	name: string;
	alternativeText: any;
	caption: any;
	width: number;
	height: number;
	formats: Formats;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: any;
	provider: string;
	provider_metadata: any;
	createdAt: string;
	updatedAt: string;
}

export interface Formats {
	thumbnail: Thumbnail;
	large?: Large;
	small?: Small;
	medium?: Medium;
}

export interface Thumbnail {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
}

export interface Large {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
}

export interface Small {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
}

export interface Medium {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
}

export interface Meta {
	pagination: Pagination;
}

export interface Pagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface DayMenuApiReturnType {
	data: WeekDayItemType[];
	meta: Meta;
}

export interface WeekDayItemType {
	id: number;
	attributes: WeekDayItemTypeAttributes;
}

export interface WeekDayItemTypeAttributes {
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	MenuItem: MenuItemType;
}

export interface MenuItemType {
	data: MenuItemData;
}

export interface MenuItemData {
	id: number;
	attributes: MenuItemDataAttributes;
}

export interface MenuItemDataAttributes {
	Name: string;
	Description: string;
	OriginalPrice: number;
	OfferedPrice: number;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	Categories: Categories;
	FoodPreference: FoodPreference;
	SpiceLevel: SpiceLevel;
	Allergens: Allergens;
	ItemImage: ItemImage;
	isMenuOutOfStock: boolean;
}

export interface Categories {
	data: CategoriesData;
}

export interface CategoriesData {
	id: number;
	attributes: CategoriesDataAttributes;
}

export interface CategoriesDataAttributes {
	Title: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface FoodPreference {
	data: FoodPreferenceData;
}

export interface FoodPreferenceData {
	id: number;
	attributes: FoodPreferenceAttributes;
}

export interface FoodPreferenceAttributes {
	Title: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface SpiceLevel {
	data: SpiceLevelData;
}

export interface SpiceLevelData {
	id: number;
	attributes: SpiceLevelAttributes;
}

export interface SpiceLevelAttributes {
	Title: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface Allergens {
	data: AllergensData[];
}

export interface AllergensData {
	id: number;
	attributes: AllergensDataAttributes;
}

export interface AllergensDataAttributes {
	Title: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface ItemImage {
	data: ItemImageData;
}

export interface ItemImageData {
	id: number;
	attributes: ProfilePictureAttributes;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface FilterOptionsApiReturnType {
	data: FilterOptions[];
	meta: Meta;
}

export interface FilterOptions {
	id: number;
	attributes: FilterOptionsAttributes;
}

export interface FilterOptionsAttributes {
	Title: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface AvailableDeliveryAddressesApiReturnType {
	data: AvailableDeliveryAddress[];
	meta: Meta;
}

export interface AvailableDeliveryAddress {
	id: number;
	attributes: AvailableDeliveryAddressAttributes;
}

export interface AvailableDeliveryAddressAttributes {
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	StreetName?: string;
	StreetNumber?: string;
	CompanyName: string;
	PostalCode: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface CustomerDetailsApiReturnType {
	data: CustomerDetails[];
	meta: Meta;
}

export interface CustomerDetails {
	id: number;
	attributes: CustomerDetailsAttributes;
}

export interface CustomerDetailsAttributes {
	Email: string;
	FirstName: string;
	LastName: string;
	LastLoginAt: string;
	UiD: string;
	PhoneNumber: string;
	CompanyName: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	DabbaPoints: number;
	customer_delivery_addresses: CustomerDeliveryAddresses;
}

export interface CustomerDeliveryAddresses {
	data: CustomerDeliveryAddressData[];
}

export interface CustomerDeliveryAddressData {
	id: number;
	attributes: CustomerDeliveryAddressDataAttributes;
}

export interface CustomerDeliveryAddressDataAttributes {
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	Address: string;
	CompanyName: string;
	PostalCode: string;
	isDefaultAddress: boolean;
	PhoneNumber: string;
	FirstName: string;
	LastName: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface POSTOrderToCMSReturnType {
	data: POSTOrderToCMSData;
	meta: Meta;
}

export interface POSTOrderToCMSData {
	id: number;
	attributes: POSTOrderToCMSDataAttributes;
}

export interface POSTOrderToCMSDataAttributes {
	Name: string;
	PhoneNumber: string;
	Email: string;
	UiD: string;
	Address: string;
	isOrderCancelled: boolean;
	isOrderCompleted: boolean;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface CustomerOrdersApiReturnType {
	data: CustomerOrdersData[];
	meta: Meta;
}

export interface CustomerOrdersData {
	id: number;
	attributes: CustomerOrdersDataAttributes;
}

export interface CustomerOrdersDataAttributes {
	Name: string;
	PhoneNumber: string;
	Email: string;
	UiD: string;
	Address: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	deliveryDate: string;
	isOrderCancelled: boolean;
	isOrderCompleted: boolean;
	SpecialRequest: string;
	Customer: CustomerDetailsApiReturnType;
	MenuItems: DayItem[];
	GrandTotal: number;
	OrderStatus: string;
	TotalItemContributingPrice: string;
}

export interface DayItem {
	id: number;
	Name: string;
	TotalPrice: string;
	Description: string;
	ItemImage: ItemImage;
	quantity: string;
	Allergens: string;
	FoodPreference: string;
	SpiceLevel: string;
	Categories: string;
	LabelImage?: ItemImage;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface RecentOrdersApiReturnType {
	data: OrderDetailsApiReturnType[];
	meta: Meta;
}

export interface OrderDetailsApiReturnType {
	id: number;
	attributes: OrderDetailsDataAttributes;
}

export interface OrderDetailsDataAttributes {
	Name: string;
	PhoneNumber: string;
	Email: string;
	UiD: string;
	Address: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	deliveryDate: string;
	isOrderCancelled: boolean;
	isOrderCompleted: boolean;
	SpecialRequest?: string;
	Customer: CustomerDetailsApiReturnType;
	MenuItems: DayItem[];
	OrderStatus: string;
	TotalItemContributingPrice: string;
}

export interface DayItem {
	id: number;
	Name: string;
	TotalPrice: string;
	Description: string;
	ItemImage: ItemImage;
	deliveryTime: any;
	quantity: string;
	Allergens: string;
	FoodPreference: string;
	SpiceLevel: string;
	Categories: string;
	LabelImage?: ItemImage;
}

export interface DefaultDeliveryAddress {
	id: number;
	documentId: string;
	AreaName: string;
	PostalCode: string;
	isDefaultAddress: boolean;
	PhoneNumber: string;
	FirstName: string;
	LastName: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	locale: string;
}

export interface TimeLineData {
	image: string;
	title: string;
	description: any;
}

export interface CartItem extends MenuItemType {
	quantity: number;
	endpointIndex: number; // New field to track the originating day index
}

export interface Option {
	label: string;
	value: string;
}

export interface FilterOptionsType {
	Categories: string[];
	FoodPreference: string[];
	Allergens: string[];
	SpiceLevel: string[];
}

export interface NavbarProfileMenuItemsType {
	icon: string;
	label: string;
	route?: string;
	tab?: string;
	actionType?: 'logout'; // Define specific action types if needed
	color?: 'error' | 'inherit';
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface CompanySubsidariesApiReturnType {
	data: CompanySubsidariesData[];
	meta: Meta;
}

export interface CompanySubsidariesData {
	id: number;
	attributes: CompanySubsidariesDataAttributes;
}

export interface CompanySubsidariesDataAttributes {
	CompanyName: string;
	Domain: string;
	DiscountPercent: number;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	Email: Email[];
	MenuItemPrice: number;
}

export interface Email {
	id: number;
	Email: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface CouponsApiReturnType {
	data: CouponsData[];
	meta: Meta;
}

export interface CouponsData {
	id: number;
	attributes: CouponsDataAttributes;
}

export interface CouponsDataAttributes {
	CouponCode: string;
	Expiry: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	TypeOfCoupon: TypeOfCoupon[];
}

export interface TypeOfCoupon {
	id: number;
	__component: 'shared.discount-amount' | 'shared.discount-percentage';
	Discount: number;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface BannerStripApiReturnType {
	data: BannerStripData[];
	meta: Meta;
}

export interface BannerStripData {
	id: number;
	attributes: BannerStripDataAttributes;
}

export interface BannerStripDataAttributes {
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	Text: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface ReferralApiReturnType {
	data: ReferralData[];
	meta: Meta;
}

export interface ReferralData {
	id: number;
	attributes: ReferralAttributes;
}

export interface ReferralAttributes {
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	referrer: Referrer;
	referring: Referring;
	coupon: Coupon;
	isReferralRedeemedBy: IsReferralRedeemedBy;
	timesIUsedThisCoupon: string;
}

export interface Referrer {
	data: ReferrerData;
}

export interface ReferrerData {
	id: number;
	attributes: ReferrerAttributes;
}

export interface ReferrerAttributes {
	Email: string;
	FirstName: string;
	LastName: string;
	LastLoginAt: string;
	UiD: string;
	PhoneNumber: any;
	CompanyName: any;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	DabbaPoints: any;
}

export interface Referring {
	data: ReferringData[];
}

export interface ReferringData {
	id: number;
	attributes: ReferringAttributes;
}

export interface ReferringAttributes {
	Email: string;
	FirstName: string;
	LastName: string;
	LastLoginAt: string;
	UiD: string;
	PhoneNumber?: string;
	CompanyName?: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	DabbaPoints: any;
}

export interface Coupon {
	data: CouponData;
}

export interface CouponData {
	id: number;
	attributes: CouponAttributes;
}

export interface CouponAttributes {
	Expiry: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	CouponCode: string;
}

export interface IsReferralRedeemedBy {
	data: IsReferralRedeemedByData[];
}

export interface IsReferralRedeemedByData {
	id: number;
	attributes: IsReferralRedeemedByAttributes;
}

export interface IsReferralRedeemedByAttributes {
	Email: string;
	FirstName: string;
	LastName: string;
	LastLoginAt: string;
	UiD: string;
	PhoneNumber: any;
	CompanyName: any;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	DabbaPoints: number;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface StrapiFile {
	id: number;
	name: string;
	alternativeText?: string;
	caption?: string;
	width: number;
	height: number;
	formats: Formats;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: any;
	provider: string;
	provider_metadata: any;
	createdAt: string;
	updatedAt: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface DiscountGlobalApiReturnType {
	data: DiscountGlobalData[];
	meta: Meta;
}

export interface DiscountGlobalData {
	id: number;
	attributes: DiscountGlobalAttributes;
}

export interface DiscountGlobalAttributes {
	DiscountPercent: number;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface ImageData {
	id: number;
	name: string;
	alternativeText: string;
	caption: string;
	width: number;
	height: number;
	formats: Formats;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: any;
	provider: string;
	provider_metadata: any;
	createdAt: string;
	updatedAt: string;
}

// export interface Formats {
// 	large: Large;
// 	small: Small;
// 	medium: Medium;
// 	thumbnail: Thumbnail;
// }

// export interface Large {
// 	ext: string;
// 	url: string;
// 	hash: string;
// 	mime: string;
// 	name: string;
// 	path: any;
// 	size: number;
// 	width: number;
// 	height: number;
// 	sizeInBytes: number;
// }

// export interface Small {
// 	ext: string;
// 	url: string;
// 	hash: string;
// 	mime: string;
// 	name: string;
// 	path: any;
// 	size: number;
// 	width: number;
// 	height: number;
// 	sizeInBytes: number;
// }

// export interface Medium {
// 	ext: string;
// 	url: string;
// 	hash: string;
// 	mime: string;
// 	name: string;
// 	path: any;
// 	size: number;
// 	width: number;
// 	height: number;
// 	sizeInBytes: number;
// }

// export interface Thumbnail {
// 	ext: string;
// 	url: string;
// 	hash: string;
// 	mime: string;
// 	name: string;
// 	path: any;
// 	size: number;
// 	width: number;
// 	height: number;
// 	sizeInBytes: number;
// }

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface OrderAllApiReturnType {
	data: OrderAllData[];
	meta: Meta;
}

export interface OrderAllData {
	id: number;
	attributes: OrderAllAttributes;
}

export interface OrderAllAttributes {
	Name: string;
	PhoneNumber: string;
	Email: string;
	UiD: string;
	Address: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	deliveryDate?: string;
	isOrderCancelled: boolean;
	isOrderCompleted: boolean;
	SpecialRequest: any;
	GrandTotal?: number;
	OrderStatus?: string;
	Customer: CustomerOrder;
	MenuItems: CustomerOrderedMenuItem[];
	DabbaPointsUsed?: number;
}

export interface CustomerOrder {
	data?: CustomerData;
}

export interface CustomerData {
	id: number;
	attributes: CustomerOrderAttributes;
}

export interface CustomerOrderAttributes {
	Email: string;
	FirstName: string;
	LastName: string;
	LastLoginAt: string;
	UiD: string;
	PhoneNumber?: string;
	CompanyName?: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	DabbaPoints?: number;
}

export interface CustomerOrderedMenuItem {
	id: number;
	Name: string;
	TotalPrice: string;
	Description: string;
	quantity: string;
	Allergens: string;
	FoodPreference: string;
	SpiceLevel: string;
	Categories: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface StoreClosingTimeApiReturnType {
	data: StoreClosingTimeData[];
	meta: Meta;
}

export interface StoreClosingTimeData {
	id: number;
	attributes: StoreClosingTimeAttributes;
}

export interface StoreClosingTimeAttributes {
	ClosingTime: string; // Existing field
	cutoffType: 'evening' | 'morning'; // New field
	cutoffTime: string; // New field
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface SingleOrderApiReturnType {
	data: SingleOrderData;
	meta: Meta;
}

export interface SingleOrderData {
	id: number;
	attributes: SingleOrderAttributes;
}

export interface SingleOrderAttributes {
	Name: string;
	PhoneNumber: string;
	Email: string;
	UiD: string;
	Address: string;
	deliveryDate: string;
	isOrderCancelled: boolean;
	isOrderCompleted: boolean;
	SpecialRequest: any;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	GrandTotal: number;
	OrderStatus: string;
	feedbackEmailSent: boolean;
	DabbaPointsUsed: any;
	MenuItems: SingleOrderMenuItem[];
	TotalItemContributingPrice: string;
}

export interface SingleOrderMenuItem {
	id: number;
	Name: string;
	Description: string;
	TotalPrice: string;
	quantity: string;
	Allergens: string;
	FoodPreference: string;
	SpiceLevel: string;
	Categories: string;
	ItemImage: SingleOrderItemImage;
	LabelImage: SingleOrderItemImage;
}

export interface SingleOrderItemImage {
	data: SingleOrderItemImageData[];
}

export interface SingleOrderItemImageData {
	id: number;
	attributes: SingleOrderItemImageAttributes;
}

export interface SingleOrderItemImageAttributes {
	name: string;
	alternativeText: any;
	caption: any;
	width: number;
	height: number;
	formats: Formats;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: any;
	provider: string;
	provider_metadata: any;
	createdAt: string;
	updatedAt: string;
}

export interface SingleOrderItemImageFormats {
	large: SingleOrderItemImageLarge;
	small: SingleOrderItemImageSmall;
	medium: SingleOrderItemImageMedium;
	thumbnail: SingleOrderItemImageThumbnail;
}

export interface SingleOrderItemImageLarge {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface SingleOrderItemImageSmall {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface SingleOrderItemImageMedium {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface SingleOrderItemImageThumbnail {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: any;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface Meta {
	pagination: Pagination;
}

export interface Pagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}
