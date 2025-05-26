// Fetch DabbaPoints for a specific user
export const getDabbaPoints = async (userId: string): Promise<number> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${userId}&populate=*`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch DabbaPoints: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data[0]?.attributes.DabbaPoints || 0;
	} catch (error) {
		console.error('Error fetching DabbaPoints:', error);
		throw error;
	}
};

// Update DabbaPoints for a user (e.g., after an order is completed)
export const updateDabbaPoints = async (
	userId: string,
	points: number,
	action: 'increment' | 'decrement'
): Promise<void> => {
	try {
		// First get the customer details
		const customerResponse = await fetch(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers?filters[UiD][$eq]=${userId}&populate=*`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (!customerResponse.ok) {
			throw new Error('Failed to fetch customer details');
		}

		const customerData = await customerResponse.json();
		const customer = customerData.data[0];

		// Then update the points
		const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/customers/${customer.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: {
					DabbaPoints:
						action === 'increment'
							? customer.attributes.DabbaPoints
								? customer.attributes.DabbaPoints + points
								: points
							: customer.attributes.DabbaPoints
								? customer.attributes.DabbaPoints - points
								: points
				}
			})
		});

		if (!response.ok) {
			throw new Error(`Failed to update DabbaPoints: ${response.statusText}`);
		}
	} catch (error) {
		console.error('Error updating DabbaPoints:', error);
		throw error;
	}
};
