export async function testFeedbackFlow() {
	try {
		// 1. Create test order
		// const createOrderResponse = await fetch('http://localhost:3000/api/test/create-test-order', {
		//   method: 'POST'
		// });
		// console.log('Test order created:', await createOrderResponse.json());

		// 2. Wait a few seconds
		await new Promise(resolve => setTimeout(resolve, 5000));

		// 3. Trigger feedback email
		const sendFeedbackResponse = await fetch('http://localhost:3000/api/cron/send-feedback');
		console.log('Feedback email result:', await sendFeedbackResponse.json());
	} catch (error) {
		console.error('Test failed:', error);
	}
}
