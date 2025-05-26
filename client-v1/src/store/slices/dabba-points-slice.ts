import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDabbaPoints, updateDabbaPoints } from '../services/dabba-points-service';

export interface DabbaPointsState {
	dabbaPoints: number;
	status: 'idle' | 'loading' | 'failed';
	redeemedPoints: number;
	isPointsApplied: boolean;
}

const initialState: DabbaPointsState = {
	dabbaPoints: 0,
	status: 'idle',
	redeemedPoints: 0,
	isPointsApplied: false
};

// Thunk to fetch points from the API
export const fetchDabbaPoints = createAsyncThunk(
	'dabbaPoints/fetchDabbaPoints',
	async (userId: string | undefined, { rejectWithValue }) => {
		if (!userId) {
			return rejectWithValue('User ID is required');
		}
		try {
			const points = await getDabbaPoints(userId);
			return points;
		} catch (error) {
			return rejectWithValue(error || 'Failed to fetch DabbaPoints');
		}
	}
);

// Thunk to update points after an order
export const incrementDabbaPoints = createAsyncThunk(
	'dabbaPoints/incrementDabbaPoints',
	async ({ userId, points }: { userId: string; points: number }, { rejectWithValue }) => {
		if (!userId) {
			return rejectWithValue('User ID is required');
		}
		try {
			await updateDabbaPoints(userId, points, 'increment');
			return points;
		} catch (error) {
			return rejectWithValue(error || 'Failed to update DabbaPoints');
		}
	}
);

export const decrementDabbaPoints = createAsyncThunk(
	'dabbaPoints/decrementDabbaPoints',
	async ({ userId, points }: { userId: string; points: number }, { rejectWithValue }) => {
		if (!userId) {
			return rejectWithValue('User ID is required');
		}
		try {
			await updateDabbaPoints(userId, points, 'decrement');
			return points;
		} catch (error) {
			return rejectWithValue(error || 'Failed to update DabbaPoints');
		}
	}
);

const dabbaPointsSlice = createSlice({
	name: 'dabbaPoints',
	initialState,
	reducers: {
		resetDabbaPoints(state) {
			state.dabbaPoints = 0;
		},
		setRedeemedPoints(state, action: PayloadAction<{ points: number }>) {
			state.redeemedPoints = action.payload.points;
			state.isPointsApplied = true;
		},
		clearRedeemedPoints(state) {
			state.redeemedPoints = 0;
			state.isPointsApplied = false;
		},
		clearDabbaPoints(state) {
			state.dabbaPoints = 0;
			state.redeemedPoints = 0;
			state.isPointsApplied = false;
		}
	},
	extraReducers: builder => {
		builder
			// Handle fetching points
			.addCase(fetchDabbaPoints.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchDabbaPoints.fulfilled, (state, action) => {
				state.dabbaPoints = action.payload;
				state.status = 'idle';
			})
			.addCase(fetchDabbaPoints.rejected, state => {
				state.status = 'failed';
			})
			// Handle incrementing points
			.addCase(incrementDabbaPoints.pending, state => {
				state.status = 'loading';
			})
			.addCase(incrementDabbaPoints.fulfilled, (state, action) => {
				state.dabbaPoints += action.payload;
				state.status = 'idle';
			})
			.addCase(incrementDabbaPoints.rejected, state => {
				state.status = 'failed';
			})
			// Handle decrementing points
			.addCase(decrementDabbaPoints.pending, state => {
				state.status = 'loading';
			})
			.addCase(decrementDabbaPoints.fulfilled, (state, action) => {
				state.dabbaPoints -= action.payload;
				state.status = 'idle';
			})
			.addCase(decrementDabbaPoints.rejected, state => {
				state.status = 'failed';
			});
	}
});

export const { resetDabbaPoints, setRedeemedPoints, clearRedeemedPoints, clearDabbaPoints } = dabbaPointsSlice.actions;
export const dabbaPointsReducer = dabbaPointsSlice.reducer;
