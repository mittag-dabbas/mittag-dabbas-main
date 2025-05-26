'use client';

import {
	Alert,
	Autocomplete,
	Box,
	Grid,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Tab,
	Tabs,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import FilterComponent from './filters';
import Image from 'next/image';
import {
	AvailableDeliveryAddress,
	AvailableDeliveryAddressesApiReturnType,
	CompanySubsidariesApiReturnType,
	CustomerDetails,
	MenuItemType,
	StoreClosingTimeApiReturnType,
	WeekDayItemType
} from '@/types';
import Loading from '@/components/loading';
import ItemCard from './item-card';
import { addresses, dayWiseTabMenuApiEndPoint, deliveryTimes } from '@/lib/constants';
import MobileFilterDrawer from './mobile-filter-drawer';
import {
	EmailToCompanySubsidaryDetails,
	findCompanySubsidaryDetailsByEmail,
	getLatestClosingTime,
	getTabDataForCurrentWeek,
	isUserNormal
} from '@/lib/helper';
import ItemDetailDialog from './item-detail-dialog';
import moment from 'moment';
import {
	setDefaultDeliveryAddress,
	setDeliveryAddress,
	setDeliveryDate,
	setDeliveryTime
} from '@/store/slices/cart-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { setCompanyDetails } from '@/store/slices/company-slice';

const defaultFilters: any = {
	Categories: {},
	FoodPreference: {},
	Allergens: {},
	SpiceLevel: {}
};

const AllItems = () => {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { days } = useAppSelector(state => state.cart);
	const { user } = useAppSelector(state => state.auth);
	const { defaultDeliveryAddress, isCartEmpty } = useAppSelector(state => state.cart);
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState<any>(defaultFilters);
	const [menu, setMenu] = useState<WeekDayItemType[]>([]);
	const [filteredMenu, setFilteredMenu] = useState<WeekDayItemType[]>([]);
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
	const [existingUserDetails, setExistingUserDetails] = useState<CustomerDetails>();
	const [companySubsidaries, setCompanySubsidaries] = useState<CompanySubsidariesApiReturnType>();

	const { tabData, todayIndex } = getTabDataForCurrentWeek();

	const {
		data: storeClosingTimeData,
		isLoading: storeClosingTimeLoading,
		error: storeClosingTimeError
	} = useSWR<StoreClosingTimeApiReturnType>(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/store-timings`, fetcher);

	// Access the cutoffType and cutoffTime
	const cutoffType = storeClosingTimeData?.data[0]?.attributes?.cutoffType;
	const cutoffTime = storeClosingTimeData?.data[0]?.attributes?.cutoffTime;
	// Initialize selectedTab based on current day of the week
	// Initialize selectedTab for next available day or Monday if it's Friday
	const nextAvailableTab = moment().isoWeekday() === 5 ? 0 : todayIndex + 1;

	const getInitialTab = () => {
		const currentDay = moment().isoWeekday(); // 1-7 (Monday-Sunday)
		const currentHour = moment().hour();
		// If it's after 8 PM (20:00)
		if (currentHour >= getLatestClosingTime(storeClosingTimeData)) {
			if (currentDay === 5) return 0; // Friday after 8 PM -> Monday
			if (currentDay > 5) return 0; // Weekend -> Monday
			return currentDay; // Next day's index for Mon-Thu
		}

		// If it's Weekend
		if (currentDay > 5) return 0; // Show Monday

		// If it's Friday before 8 PM
		if (currentDay === 5) return 0; // Show Monday

		return currentDay;
	};

	const [selectedTab, setSelectedTab] = useState(getInitialTab());

	// Fetch all available addresses from the CMS
	const {
		data,
		isLoading: loading,
		error
	} = useSWR<AvailableDeliveryAddressesApiReturnType>(
		`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/available-deliveries`,
		fetcher
	);

	// Format address options from the API data
	const addressOptions =
		data?.data?.map((address: AvailableDeliveryAddress) => ({
			label: `${address.attributes.CompanyName}, ${
				address.attributes.StreetName ? address.attributes.StreetName + ', ' : ''
			} ${
				address.attributes.StreetNumber ? address.attributes.StreetNumber + ', ' : ''
			} ${address.attributes.PostalCode}`
		})) || [];

	// Get current delivery address from Redux state
	const deliveryAddress = useAppSelector(state => state.cart.deliveryAddress);

	// Find matching address option for the current delivery address
	const currentAddressOption =
		addressOptions.find(option => {
			// Remove extra spaces and compare
			const normalizedOption = option.label.replace(/\s+/g, ' ').trim();
			const normalizedAddress = deliveryAddress?.replace(/\s+/g, ' ').trim();
			return normalizedOption === normalizedAddress;
		}) || null;

	const isWeekend = moment().isoWeekday() > 5;
	const isFriday = moment().isoWeekday() === 5;
	const isTodayWeekendOrFriday = isWeekend || !isFriday;

	const isTodayDayBetweenMondayAndThursday = moment().isoWeekday() >= 1 && moment().isoWeekday() <= 4;

	const isDayFridayOrDayBetweenMondayAndThursday = isFriday || isTodayDayBetweenMondayAndThursday;

	// Check if the selected tab represents a day in the future
	const isTodayTab =
		(selectedTab <= todayIndex - 1 && isTodayWeekendOrFriday) ||
		(isTodayDayBetweenMondayAndThursday && selectedTab === 0);

	const tabDay = tabData[selectedTab]?.label;
	const tabDate = tabData[selectedTab]?.date;
	const currentDayCart = useAppSelector(state => state.cart.days[selectedTab]);
	const selectedDeliveryTime = currentDayCart?.deliveryTime || deliveryTimes[0].label;

	useEffect(() => {
		getCompanySubsidaries();
	}, []);

	useEffect(() => {
		if (selectedTab > 4) {
			setSelectedTab(getInitialTab());
		}
	}, [todayIndex, selectedTab]);

	useEffect(() => {
		fetchMenuItems(selectedTab);
		dispatch(setDeliveryDate({ endpointIndex: selectedTab, deliveryDate: tabDate }));
		if (!currentDayCart?.deliveryTime) {
			dispatch(setDeliveryTime({ endpointIndex: selectedTab, deliveryTime: deliveryTimes[0].label }));
		}
	}, [selectedTab]);

	useEffect(() => {
		applyFilters();
	}, [filters, menu]);

	// function to fetch company subsidary details
	const getCompanySubsidaries = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/company-subsidaries?populate=*`
			);

			if (response.ok) {
				const data: CompanySubsidariesApiReturnType = await response.json();
				setCompanySubsidaries(data);

				if (data.data.length > 0) {
					if (isUserNormal(data, user?.email)) {
						// fetch the global discounts collection
						const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/discount-globals`);

						if (response.ok) {
							const discounts = await response.json();
							const discountValue = discounts.data[0]
								? discounts.data[0].attributes.DiscountPercent
								: null;

							dispatch(
								setCompanyDetails({
									companyName: null,
									discountPercentage: discountValue ?? null,
									domain: null,
									menuItemPrice: null
								})
							);
						}
					} else {
						let companyDetails: EmailToCompanySubsidaryDetails = findCompanySubsidaryDetailsByEmail(
							user.email,
							data
						);

						dispatch(
							setCompanyDetails({
								companyName: companyDetails.CompanyName ?? null,
								discountPercentage: companyDetails.DiscountPercent ?? null,
								domain: companyDetails.Domain ?? null,
								menuItemPrice: companyDetails.MenuItemPrice ?? null
							})
						);
					}
				}
			}
		} catch (error) {
			console.error('Error fetching company subsidaries:', error);
		}
	};

	// function to check valid company email and rehydrate the company slice

	const fetchMenuItems = async (tabIndex: number) => {
		try {
			setIsLoading(true);
			const endPoint = dayWiseTabMenuApiEndPoint[tabIndex];
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}${endPoint}?populate[MenuItem][populate][Categories]=true&populate[MenuItem][populate][FoodPreference]=true&populate[MenuItem][populate][SpiceLevel]=true&populate[MenuItem][populate][Allergens]=true&populate[MenuItem][populate][ItemImage]=true`
			);
			const data = await response.json();
			setMenu(data.data);
			setFilteredMenu(data.data);
		} catch (error) {
			console.error('An error occurred while fetching menu items', error);
		} finally {
			setIsLoading(false);
		}
	};

	const getExistingUserData = useCallback(async () => {
		if (!user?.uid) return;
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${user.uid}&populate=*`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			const data = await response.json();
			if (data?.data.length > 0) {
				setExistingUserDetails(data.data[0]);

				const defaultAddress = data.data[0]?.attributes.customer_delivery_addresses?.data.find(
					(address: any) => address.attributes.isDefaultAddress
				);

				if (defaultAddress?.attributes?.Address) {
					dispatch(
						setDeliveryAddress({
							deliveryAddress: defaultAddress?.attributes?.Address
						})
					);
				}
			}
		} catch (error) {
			console.error('Error in fetching user details:', error);
		}
	}, [user?.uid, dispatch]);

	useEffect(() => {
		getExistingUserData();
	}, [getExistingUserData]);

	const applyFilters = () => {
		const filtered = menu?.filter(item => {
			const categoryMatch =
				!filters.Categories ||
				Object.keys(filters.Categories).every(
					category =>
						!filters.Categories[category] ||
						item.attributes.MenuItem.data.attributes.Categories.data.attributes.Title === category
				);
			const preferenceMatch =
				!filters.FoodPreference ||
				Object.keys(filters.FoodPreference).every(
					preference =>
						!filters.FoodPreference[preference] ||
						item.attributes.MenuItem.data.attributes.FoodPreference.data.attributes.Title === preference
				);
			const allergensMatch =
				!filters.Allergens ||
				Object.keys(filters.Allergens).every(
					allergen =>
						!filters.Allergens[allergen] ||
						item.attributes.MenuItem.data.attributes.Allergens.data.some(
							a => a.attributes.Title === allergen
						)
				);
			const spiceLevelMatch =
				!filters.SpiceLevel ||
				Object.keys(filters.SpiceLevel).every(
					level =>
						!filters.SpiceLevel[level] ||
						item.attributes.MenuItem.data.attributes.SpiceLevel.data.attributes.Title === level
				);

			return categoryMatch && preferenceMatch && allergensMatch && spiceLevelMatch;
		});

		setFilteredMenu(filtered);
	};

	const handleAddressChange = (event: SyntheticEvent<Element, Event>, value: { label: string } | null) => {
		const address = value?.label || '';
		// checking if the user have atleast one address
		// if (existingUserDetails?.attributes.customer_delivery_addresses.data.length === 0) {
		// 	// createa default address
		// 	// dispatch(
		// 	// 	setDefaultDeliveryAddress({
		// 	// 		defaultDeliveryAddress: address
		// 	// 	})
		// 	// );

		// }
	};

	const handleTimeChange = (event: SelectChangeEvent) => {
		const selectedTime = event.target.value;
		dispatch(setDeliveryTime({ endpointIndex: selectedTab, deliveryTime: selectedTime }));
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setSelectedTab(newValue);
		fetchMenuItems(newValue);
		dispatch(setDeliveryDate({ endpointIndex: newValue, deliveryDate: tabData[newValue].date }));
	};

	const handleDropdownChange = (event: SelectChangeEvent) => {
		setSelectedTab(Number(event.target.value));
		fetchMenuItems(Number(event.target.value));
	};

	const handleFilterDrawerOpen = () => {
		setIsFilterDrawerOpen(true);
	};

	const handleFilterDrawerClose = () => {
		setIsFilterDrawerOpen(false);
	};

	const handleFilterChange = (updatedFilters: any) => {
		setFilters(updatedFilters);
	};

	const handleCardClick = (item: MenuItemType) => {
		setSelectedItem(item);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedItem(null);
	};

	const isOrderingAllowed = (deliveryDate: string) => {
		const now = moment();
		const deliveryMoment = moment(deliveryDate, 'DD/MM/YYYY');

		// Get the cutoff type and time from the API
		const cutoffType = storeClosingTimeData?.data[0]?.attributes?.cutoffType; // "evening" or "morning"
		const cutoffTime = storeClosingTimeData?.data[0]?.attributes?.cutoffTime; // e.g., "20:00" or "08:00"

		let cutoffMoment;

		if (cutoffType === 'evening') {
			// Evening cutoff: Set cutoff time the previous day
			cutoffMoment = moment(deliveryDate, 'DD/MM/YYYY')
				.subtract(1, 'days')
				.set('hour', parseInt(cutoffTime?.split(':')[0] || '20', 10))
				.set('minute', parseInt(cutoffTime?.split(':')[1] || '0', 10))
				.set('second', 0);
		} else if (cutoffType === 'morning') {
			// Morning cutoff: Set cutoff time on the delivery day
			cutoffMoment = moment(deliveryDate, 'DD/MM/YYYY')
				.set('hour', parseInt(cutoffTime?.split(':')[0] || '8', 10))
				.set('minute', parseInt(cutoffTime?.split(':')[1] || '0', 10))
				.set('second', 0);
		} else {
			// Default to evening cutoff if cutoffType is not specified
			cutoffMoment = moment(deliveryDate, 'DD/MM/YYYY')
				.subtract(1, 'days')
				.set('hour', 20) // 8 PM
				.set('minute', 0)
				.set('second', 0);
		}

		// Allow ordering if the current time is before the cutoff time
		return now.isBefore(cutoffMoment);
	};
	const isOrderingDisabled = !isOrderingAllowed(tabDate);

	return (
		<Grid
			container
			spacing={4}
		>
			<Grid
				item
				md={3}
				lg={3}
			>
				{!isMobile && <FilterComponent onChangeFilters={handleFilterChange} />}
			</Grid>
			<Grid
				item
				md={9}
				lg={9}
			>
				<Grid
					container
					alignItems='center'
					justifyContent={'space-between'}
					spacing={2}
				>
					{/* Delivery Address */}
					<Grid
						item
						xs={12}
						md={7}
					>
						<Stack
							direction={isMobile ? 'column' : 'row'}
							alignItems={isMobile ? 'flex-start' : 'center'}
							spacing={2}
							flexWrap={'nowrap'}
						>
							<Typography variant='h6'>Delivery Address</Typography>
							<Autocomplete
								options={addressOptions || []}
								value={currentAddressOption}
								getOptionLabel={option => option.label}
								onChange={(event, newValue) => {
									if (newValue) {
										dispatch(setDeliveryAddress({ deliveryAddress: newValue.label }));
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										label='Address'
										margin='normal'
										variant='outlined'
										placeholder='eg. Delivery Hero'
									/>
								)}
								sx={{
									width: '60%',
									borderRadius: theme.shape.borderRadius
								}}
								openOnFocus={true}
								blurOnSelect={true}
								isOptionEqualToValue={(option, value) => {
									// Normalize strings by removing extra spaces before comparison
									const normalizedOption = option.label.replace(/\s+/g, ' ').trim();
									const normalizedValue = value?.label?.replace(/\s+/g, ' ').trim();
									return normalizedOption === normalizedValue;
								}}
							/>
						</Stack>
					</Grid>

					{/* Delivery Time */}
					<Grid
						item
						xs={12}
						md={5}
					>
						<Stack
							direction={isMobile ? 'column' : 'row'}
							alignItems={isMobile ? 'flex-start' : 'center'}
							justifyContent={isMobile ? 'flex-start' : 'flex-end'}
							spacing={2}
						>
							<Typography variant='h6'>Delivery Time</Typography>
							<Select
								value={selectedDeliveryTime} // Defaults to current day's time or first option in deliveryTimes
								onChange={handleTimeChange}
								startAdornment={
									<Box sx={{ mr: 1, mt: 0.6 }}>
										<Image
											src={'/assets/icons/time.svg'}
											alt='Time'
											width={24}
											height={24}
										/>
									</Box>
								}
								sx={{ width: 'auto', borderRadius: theme.shape.borderRadius }}
								size='small'
							>
								{deliveryTimes.map(time => (
									<MenuItem
										key={time.label}
										value={time.label}
									>
										{time.label}
									</MenuItem>
								))}
							</Select>
						</Stack>
					</Grid>
				</Grid>

				<Grid
					item
					md={12}
					lg={12}
				>
					{/* Tab / Dropdown */}
					<Box
						sx={{
							border: !isMobile ? `1px solid ${theme.palette.divider}` : 'none',
							borderRadius: theme.shape.borderRadius,
							marginTop: theme.spacing(2),
							backgroundColor: isMobile
								? theme.palette.background.default
								: theme.palette.background.paper
						}}
					>
						{isMobile ? (
							<Stack
								direction='row'
								alignItems='center'
								spacing={1}
							>
								<>
									<Select
										value={selectedTab.toString()}
										onChange={event => handleDropdownChange(event)}
										displayEmpty
										fullWidth
										sx={{
											borderRadius: theme.shape.borderRadius,
											backgroundColor: theme.palette.background.paper
										}}
									>
										{tabData?.map((tab, index) => (
											<MenuItem
												key={index}
												value={index.toString()}
											>
												{`${tab.label} (${tab.date})`}
											</MenuItem>
										))}
									</Select>
								</>
								<IconButton
									onClick={handleFilterDrawerOpen}
									sx={{
										backgroundColor: theme.palette.background.paper,
										borderRadius: theme.shape.borderRadius,
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Image
										src={'/assets/icons/filter.svg'}
										alt='Filter'
										width={24}
										height={24}
									/>
								</IconButton>
							</Stack>
						) : (
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
							>
								{tabData?.map((tab, index) => (
									<Tab
										key={index}
										label={`${tab.label} (${tab.date})`}
										disableRipple
										sx={{
											fontWeight: selectedTab === index ? 'bold' : 'normal',
											textTransform: 'none'
										}}
									/>
								))}
							</Tabs>
						)}
					</Box>

					<Box sx={{ mt: 4, mb: 2 }}>
						<Typography
							variant='h3'
							textTransform={'uppercase'}
						>
							{`${tabDay} Mealboxes (${tabDate})`}
						</Typography>
						{/* <Typography variant='body1'>
							This menu will be closed by 18:00 on{' '}
							{moment(tabDate, 'DD/MM/YYYY').subtract(1, 'days').format('dddd')} evening
						</Typography> */}

						<Box
							sx={{
								mt: 2
							}}
						>
							{isOrderingDisabled ? (
								<Alert
									variant='standard'
									severity='warning'
									sx={{
										border: `1px solid ${theme.palette.warning.main}`,
										borderRadius: theme.shape.borderRadius
									}}
								>
									<Typography variant='body1'>{`We are no longer accepting orders for ${tabDay}'s meal box items, as we operate on a pre-order basis. However, you can still place orders for the remaining meals for the rest of the week.`}</Typography>
								</Alert>
							) : (
								<Alert
									variant='standard'
									severity='success'
									icon={
										<Image
											src={'/assets/icons/menu.svg'}
											alt='Menu Icon'
											width={20}
											height={20}
										/>
									}
									sx={{
										border: `1px solid ${theme.palette.success.main}`,
										borderRadius: theme.shape.borderRadius
									}}
								>
									<Typography variant='body1'>
										You can place the order for {tabDay}, but you will receive this meal on{' '}
										<strong>
											{tabDay}, {moment(tabDate, 'DD/MM/YYYY').format('MMMM D, YYYY')}
										</strong>
										, between{' '}
										<strong>
											{selectedDeliveryTime.split('-')[0]} and{' '}
											{selectedDeliveryTime.split('-')[1]}
										</strong>
										.
									</Typography>
								</Alert>
							)}
						</Box>
					</Box>

					{/* Items */}
					{isLoading ? (
						<Loading />
					) : (
						<Grid
							container
							spacing={2}
							sx={{ mt: 2 }}
						>
							{filteredMenu && filteredMenu.length > 0 ? (
								filteredMenu?.map((item: WeekDayItemType) => (
									<Grid
										item
										xs={12}
										md={6}
										lg={4}
										key={item.id}
									>
										<ItemCard
											item={item.attributes.MenuItem}
											endpointIndex={selectedTab}
											onItemClick={handleCardClick}
											isTodayTab={isOrderingDisabled}
										/>
									</Grid>
								))
							) : (
								<Typography sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
									No menu items found for the selected filters.
								</Typography>
							)}
						</Grid>
					)}
				</Grid>

				{/* Dialog for item details */}
				{selectedItem && (
					<ItemDetailDialog
						open={dialogOpen}
						onClose={handleDialogClose}
						item={selectedItem}
						endpointIndex={selectedTab}
						isTodayTab={isOrderingDisabled}
					/>
				)}
			</Grid>
			<MobileFilterDrawer
				open={isFilterDrawerOpen}
				onClose={handleFilterDrawerClose}
				onApply={() => {}}
				onChangeFilters={handleFilterChange}
			/>
		</Grid>
	);
};

export default AllItems;
