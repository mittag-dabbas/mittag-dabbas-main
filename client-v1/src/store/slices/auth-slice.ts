import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	User,
	onAuthStateChanged,
	sendPasswordResetEmail,
	confirmPasswordReset,
	verifyPasswordResetCode
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { postUserToBackend } from '../services/auth-service';
import { getFirebaseErrorMessage } from '@/lib/errors';

export interface AuthState {
	user: User | null | any;
	loading: boolean;
	authError: string | null;
}

const initialState: AuthState = {
	user: null,
	loading: false,
	authError: null
};

// Thunk to initialize the user session (persistent login)
export const initializeUserSession = createAsyncThunk('auth/initializeUserSession', async (_, { rejectWithValue }) => {
	return new Promise<User | null>((resolve, reject) => {
		onAuthStateChanged(auth, async user => {
			if (user) {
				//   await postUserToBackend(user);
				resolve(user);
			} else {
				resolve(null); // No user is signed in
			}
		});
	});
});

// Thunk to sign in using Google
export const signInUsingGoogle = createAsyncThunk('auth/signInUsingGoogle', async (_, { rejectWithValue }) => {
	try {
		const googleProvider = new GoogleAuthProvider();
		googleProvider.setCustomParameters({ prompt: 'select_account' });
		const response = await signInWithPopup(auth, googleProvider);

		// Post the user data to the backend after successful authentication
		const data = await postUserToBackend(response.user);
		return response.user.toJSON();
	} catch (error: any) {
		const errorMessage = getFirebaseErrorMessage(error.code);
		return rejectWithValue(errorMessage);
	}
});

// Thunk to sign in using email and password
export const signInUsingEmailAndPassword = createAsyncThunk(
	'auth/signInUsingEmailAndPassword',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const response = await signInWithEmailAndPassword(auth, email, password);

			// Post the user data to the backend after successful authentication
			await postUserToBackend(response.user);

			return response.user.toJSON();
		} catch (error: any) {
			const errorMessage = getFirebaseErrorMessage(error.code);
			return rejectWithValue(errorMessage);
		}
	}
);

// Thunk to create a new user with email and password
export const createUserUsingEmailAndPassword = createAsyncThunk(
	'auth/createUserUsingEmailAndPassword',
	async (
		{ email, password, fname, lname }: { email: string; password: string; fname: string; lname: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await createUserWithEmailAndPassword(auth, email, password);

			// Post the user data to the backend after successful authentication
			await postUserToBackend(response.user, fname, lname);

			return response.user.toJSON();
		} catch (error: any) {
			const errorMessage = getFirebaseErrorMessage(error.code);
			return rejectWithValue(errorMessage);
		}
	}
);

// Thunk to reset password
export const resetPassword = createAsyncThunk('auth/resetPassword', async (email: string, { rejectWithValue }) => {
	try {
		await sendPasswordResetEmail(auth, email);
		return 'Password reset email sent successfully.';
	} catch (error: any) {
		const errorMessage = getFirebaseErrorMessage(error.code);
		return rejectWithValue(errorMessage);
	}
});

// Thunk to verify the password reset code
export const verifyResetCode = createAsyncThunk(
	'auth/verifyResetCode',
	async (oobCode: string, { rejectWithValue }) => {
		try {
			const email = await verifyPasswordResetCode(auth, oobCode); // Await the result
			return email; // Return the resolved email
		} catch (error: any) {
			const errorMessage = getFirebaseErrorMessage(error.code);
			return rejectWithValue(errorMessage);
		}
	}
);

// Thunk to confirm the password reset
export const confirmResetPassword = createAsyncThunk(
	'auth/confirmResetPassword',
	async ({ oobCode, newPassword }: { oobCode: string; newPassword: string }, { rejectWithValue }) => {
		try {
			await confirmPasswordReset(auth, oobCode, newPassword);
			return 'Password reset successfully.';
		} catch (error: any) {
			const errorMessage = getFirebaseErrorMessage(error.code);
			return rejectWithValue(errorMessage);
		}
	}
);

// Thunk to sign out the user
export const signOutUser = createAsyncThunk('auth/signOutUser', async (_, { rejectWithValue }) => {
	try {
		await signOut(auth);
		return null;
	} catch (error: any) {
		const errorMessage = getFirebaseErrorMessage(error.code);
		return rejectWithValue(errorMessage);
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: state => {
			state.authError = null;
		},
		clearUser: state => {
			state.user = null;
		},
		clearAuth: state => {
			state.user = null;
			state.authError = null;
		}
	},
	extraReducers: builder => {
		// Google sign-in cases
		builder.addCase(signInUsingGoogle.pending, state => {
			state.loading = true;
			state.authError = null;
		});
		builder.addCase(signInUsingGoogle.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload;
		});
		builder.addCase(signInUsingGoogle.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});

		// Email sign-in cases
		builder.addCase(signInUsingEmailAndPassword.pending, state => {
			state.loading = true;
			state.authError = null;
		});
		builder.addCase(signInUsingEmailAndPassword.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload;
		});
		builder.addCase(signInUsingEmailAndPassword.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});

		// Create user cases
		builder.addCase(createUserUsingEmailAndPassword.pending, state => {
			state.loading = true;
			state.authError = null;
		});
		builder.addCase(createUserUsingEmailAndPassword.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload;
		});
		builder.addCase(createUserUsingEmailAndPassword.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});

		// Reset password cases
		builder.addCase(resetPassword.pending, state => {
			state.loading = true;
			state.authError = null;
		});
		builder.addCase(resetPassword.fulfilled, (state, action) => {
			state.loading = false;
			state.authError = null;
		});
		builder.addCase(resetPassword.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});

		// Verify reset code cases
		builder.addCase(verifyResetCode.pending, state => {
			state.loading = true;
			state.authError = null;
		});
		builder.addCase(verifyResetCode.fulfilled, (state, action) => {
			state.loading = false;
			// Store email in state if needed
			state.user = { ...state.user, resetEmail: action.payload };
		});
		builder.addCase(verifyResetCode.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});

		// Confirm reset password cases
		builder.addCase(confirmResetPassword.pending, state => {
			state.loading = true;
			state.authError = null;
		});
		builder.addCase(confirmResetPassword.fulfilled, (state, action) => {
			state.loading = false;
			state.authError = null;
		});
		builder.addCase(confirmResetPassword.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});

		// Sign out cases
		builder.addCase(signOutUser.pending, state => {
			state.loading = true;
		});
		builder.addCase(signOutUser.fulfilled, state => {
			state.loading = false;
			state.user = null;
		});
		builder.addCase(signOutUser.rejected, (state, action) => {
			state.loading = false;
			state.authError = action.payload as string;
		});
	}
});

export const { clearError, clearUser, clearAuth } = authSlice.actions;

export const authReducer = authSlice.reducer;
