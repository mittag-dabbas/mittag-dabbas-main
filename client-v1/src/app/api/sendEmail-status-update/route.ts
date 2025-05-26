import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAIL_1, ADMIN_EMAIL_2, DOMAIN_EMAIL } from '@/lib/constants';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function generateEmailHtml({ customerName, orderItems, newStatus, deliveryAddress, companyName }: any) {
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
      </head>
      <body>
        <h2>Order Status Update</h2>
        <p>Dear ${customerName},</p>
        <p>Your order status has been updated to <strong>${newStatus}</strong>.</p>
        <p>Delivery Address: ${deliveryAddress}</p>
        <p>Company: ${companyName}</p>
        <h3>Order Details:</h3>
        <ul>
           ${orderItems.map((item: any) => `<li>${item.menuItem} - ${item.quantity} pcs</li>`).join('')}
        </ul>
        <p>Thank you for your business.</p>
      </body>
    </html>`;
}

async function sendEmail(emailData: any) {
	const response = await fetch(BREVO_API_URL, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'api-key': BREVO_API_KEY ?? '',
			'content-type': 'application/json'
		},
		body: JSON.stringify(emailData)
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('Brevo API error response:', errorData);
		throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
	}

	return response.json();
}

export async function POST(request: NextRequest) {
	try {
		const { userDetails, adminDetails } = await request.json();

		if (userDetails.newStatus === 'Accepted') {
			return NextResponse.json({ message: 'Skipped sending email for ACCEPTED status' }, { status: 201 });
		}

		const userEmailContent = generateEmailHtml(userDetails);
		const adminEmailContent = generateEmailHtml(adminDetails);

		const emailPayloads = [
			{
				sender: { name: 'Mittag-dabbas', email: DOMAIN_EMAIL },
				to: [{ email: userDetails.email, name: userDetails.customerName }],
				subject: `Order Status Update | ${userDetails.customerName}`,
				htmlContent: userEmailContent
			},
			// {
			// 	sender: { name: 'Mittag-dabbas', email: DOMAIN_EMAIL },
			// 	to: [
			// 		{ email: ADMIN_EMAIL_1, name: 'Admin 1' },
			// 		{ email: ADMIN_EMAIL_2, name: 'Admin 2' }
			// 	],
			// 	subject: `Order Status Updated for ${adminDetails.customerName}`,
			// 	htmlContent: adminEmailContent
			// }
		];

		console;

		const emailResponses = await Promise.all(emailPayloads.map(payload => sendEmail(payload)));

		return NextResponse.json({ message: 'Emails sent successfully.', emailResponses });
	} catch (error) {
		console.error('Error in email POST handler:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Invalid request or internal error.' },
			{ status: 500 }
		);
	}
}
