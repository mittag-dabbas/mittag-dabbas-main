import axios from 'axios';
import moment from 'moment';
import { User } from 'firebase/auth';

export const postUserToBackend = async (user: User | null, fname?: string, lname?: string) => {
	if (!user) return;

	try {
		const userData = {
			Email: user.email,
			FirstName: user.displayName?.split(' ')[0] || fname || '',
			LastName: user.displayName?.split(' ')[1] || lname || '',
			LastLoginAt: user.metadata.lastSignInTime
				? moment(user.metadata.lastSignInTime).toDate().toISOString()
				: '',
			UiD: user.uid
		};

		// Step 1: Check if the user with the given UID already exists in Strapi
		const existingUserResponse = await fetch(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${user.uid}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		const existingUserData = await existingUserResponse.json();
		const existingUser = existingUserData.data.length > 0 ? existingUserData.data[0] : null;

		if (existingUser) {
			// Step 2: If the user exists, update their details
			const updateResponse = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers/${existingUser.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ data: userData })
				}
			);

			if (updateResponse.ok) {
				const updatedUser = await updateResponse.json();
				return updatedUser;
			} else {
				throw new Error('Failed to update user');
			}
		} else {
			// Step 3: If the user does not exist, create a new record
			const createResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ data: userData })
			});

			if (createResponse.ok) {
				const createdUser = await createResponse.json();
				return createdUser;
			} else {
				throw new Error('Failed to create user');
			}
		}
	} catch (error) {
		console.error('Error posting user data to backend:', error);
		return error;
	}
};
