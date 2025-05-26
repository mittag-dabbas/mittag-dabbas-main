export const getFirebaseErrorMessage = (errorCode: string): string => {
	switch (errorCode) {
		case 'auth/user-not-found':
			return 'User not found. Please Sign Up.';
		case 'auth/wrong-password':
			return 'Incorrect Email or password. Please try again.';
		case 'auth/invalid-email':
			return 'Incorrect Email or password. Please try again.';
		case 'auth/email-already-in-use':
			return 'This email is already in use. Please try using another email.';
		case 'auth/too-many-requests':
			return 'Too many attempts. Please try again later.';
		case 'auth/popup-closed-by-user':
			return 'You closed the popup before completing the process. Please try again.';
		default:
			return 'An error occurred. Please try again.';
	}
};
