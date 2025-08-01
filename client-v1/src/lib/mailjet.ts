import mailjet from 'node-mailjet';

export const mailjetClient = mailjet.apiConnect(
	process.env.MAILJET_API_PUBLIC_KEY as string,
	process.env.MAILJET_API_PRIVATE_KEY as string
);

// export async function sendEmail({ to:, from, subject, message }) {
// 	const emailData = {
// 		Messages: [
// 			{
// 				From: {
// 					Email: from,
// 					Name: 'Your Name'
// 				},
// 				To: [
// 					{
// 						Email: to,
// 						Name: 'Recipient Name'
// 					}
// 				],
// 				Subject: subject,
// 				TextPart: message
// 			}
// 		]
// 	};

// 	try {
// 		const result = await mailjetClient.post('send', { version: 'v3.1' }).request(emailData);
// 		console.log('Email sent successfully!');
// 		return result;
// 	} catch (error) {
// 		console.error('Error sending email:', error);
// 		throw error;
// 	}
// }
