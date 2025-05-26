import { testFeedbackFlow } from './feedback-test-utils.js';

testFeedbackFlow()
	.then(() => console.log('Test completed'))
	.catch(console.error);
