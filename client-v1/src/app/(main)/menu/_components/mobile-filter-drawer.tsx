import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Drawer,
	Typography,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Checkbox,
	FormControlLabel,
	IconButton,
	useTheme,
	Stack,
	Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { filterOptions } from '@/lib/constants';
import { FilterOptionsApiReturnType, FilterOptionsType } from '@/types';
import Loading from '@/components/loading';

type FilterState = {
	[K in keyof FilterOptionsType]: {
		[Option in FilterOptionsType[K][number]]: boolean;
	};
};

interface MobileFilterDrawerProps {
	open: boolean;
	onClose: () => void;
	onApply: (filters: FilterState) => void;
	onChangeFilters: (filters: FilterState) => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ open, onClose, onApply, onChangeFilters }) => {
	const theme = useTheme();
	const [allfilterOptions, setAllFilterOptions] = useState<FilterOptionsType | null>(null);
	const [filters, setFilters] = useState<FilterState | null>(null);

	useEffect(() => {
		fetchAllFilterOptions();
	}, []);

	const fetchAllFilterOptions = async () => {
		try {
			const [categories, foodPreferences, allergens, spiceLevels] = await Promise.all([
				fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/categories`).then(res => res.json()),
				fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/food-preferences`).then(res => res.json()),
				fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/allergens`).then(res => res.json()),
				fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/spice-levels`).then(res => res.json())
			]);

			const transformData = (apiData: FilterOptionsApiReturnType) => {
				return apiData.data.map(item => item.attributes.Title);
			};

			const transformedData: FilterOptionsType = {
				Categories: transformData(categories),
				FoodPreference: transformData(foodPreferences),
				Allergens: transformData(allergens),
				SpiceLevel: transformData(spiceLevels)
			};

			setAllFilterOptions(transformedData);

			// Initialize the filters state with all options set to false
			const initialFilters: FilterState = Object.fromEntries(
				Object.entries(transformedData).map(([category, options]) => [
					category,
					Object.fromEntries(options.map((option: any) => [option, false]))
				])
			) as FilterState;

			setFilters(initialFilters);
		} catch (error) {
			console.error('Error fetching filter options:', error);
		}
	};

	const handleCheckboxChange = (category: keyof FilterOptionsType, option: string) => {
		if (filters) {
			const updatedFilters = {
				...filters,
				[category]: {
					...filters[category],
					[option]: !filters[category][option]
				}
			};
			setFilters(updatedFilters);
			onChangeFilters(updatedFilters); // Pass updated filters to parent
		}
	};

	const handleClearAll = () => {
		if (allfilterOptions) {
			const clearedFilters: FilterState = Object.fromEntries(
				Object.entries(allfilterOptions).map(([category, options]) => [
					category,
					Object.fromEntries(options.map((option: any) => [option, false]))
				])
			) as FilterState;

			setFilters(clearedFilters);
			onChangeFilters(clearedFilters); // Pass cleared filters to parent
		}
	};

	const handleApply = () => {
		onApply(filters as FilterState);
		onClose();
	};

	if (!allfilterOptions || !filters) return <Loading />;

	return (
		<Drawer
			anchor='bottom'
			open={open}
			onClose={onClose}
			sx={{
				'& .MuiDrawer-paper': {
					height: '80vh',
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					display: 'flex',
					flexDirection: 'column'
				}
			}}
		>
			{/* Header */}
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				p={2}
				borderBottom={`1px solid ${theme.palette.divider}`}
			>
				<Typography
					variant='h6'
					fontWeight='bold'
				>
					Filters
				</Typography>
				<Button onClick={handleClearAll}>CLEAR ALL</Button>
			</Box>

			{/* Content - Scrollable */}
			<Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
				{Object.entries(allfilterOptions).map(([category, options]) => (
					<Accordion key={category}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant='h6'>
								{category}
								<Badge
									badgeContent={
										Object.values(filters[category as keyof FilterOptionsType]).filter(Boolean)
											.length
									}
									color='secondary'
									overlap='circular'
									sx={{
										'& .MuiBadge-badge': {
											border: `2px solid white`,
											padding: '0px'
										},
										ml: 2
									}}
								/>
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{options.map((option: any) => (
								<FormControlLabel
									key={option}
									control={
										<Checkbox
											checked={filters[category as keyof FilterOptionsType][option]}
											onChange={() =>
												handleCheckboxChange(category as keyof FilterOptionsType, option)
											}
										/>
									}
									label={option}
									sx={{
										display: 'flex',
										flexDirection: 'row-reverse',
										justifyContent: 'space-between',
										width: '100%',
										margin: 0
									}}
								/>
							))}
						</AccordionDetails>
					</Accordion>
				))}
			</Box>

			{/* Footer - Fixed Buttons */}
			<Stack
				sx={{
					p: 2,
					borderTop: `2px solid ${theme.palette.divider}`,
					// box shadow on border top
					boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.1)',
					position: 'sticky',
					bottom: 0
				}}
				direction={'row'}
				spacing={2}
			>
				<Button
					variant='outlined'
					fullWidth
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					fullWidth
					onClick={handleApply}
				>
					Apply
				</Button>
			</Stack>
		</Drawer>
	);
};

export default MobileFilterDrawer;
