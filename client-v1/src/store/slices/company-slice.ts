import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CompanyState {
	companyName: string | null;
	discountPercentage: number | null;
	domain: string | null;
	menuItemPrice: number | null;
}

const initialState: CompanyState = {
	companyName: null,
	discountPercentage: null,
	domain: null,
	menuItemPrice: null
};

const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		setCompanyDetails: (state, action: PayloadAction<CompanyState>) => {
			state.companyName = action.payload.companyName;
			state.discountPercentage = action.payload.discountPercentage;
			state.domain = action.payload.domain;
			state.menuItemPrice = action.payload.menuItemPrice;

			console.log(
				'COMPANY DETAILS::: ',
				state.companyName,
				state.discountPercentage,
				state.domain,
				state.menuItemPrice
			);
		},
		clearCompanyDetails: state => {
			state.companyName = null;
			state.discountPercentage = null;
			state.domain = null;
			state.menuItemPrice = null;
		}
	}
});

export const { setCompanyDetails, clearCompanyDetails } = companySlice.actions;
export default companySlice.reducer;
