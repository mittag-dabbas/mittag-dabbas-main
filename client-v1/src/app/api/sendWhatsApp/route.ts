import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_WHATSAPP_API_URL = 'https://api.brevo.com/v3/whatsapp/sendMessage';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.contactNumbers || !body.templateId || !body.senderNumber) {
			throw new Error('Missing required fields: contactNumbers, templateId, or senderNumber');
		}

		const response = await fetch(BREVO_WHATSAPP_API_URL, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'api-key': BREVO_API_KEY ?? '',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				contactNumbers: body.contactNumbers,
				templateId: body.templateId,
				senderNumber: body.senderNumber
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Brevo WhatsApp API error response:', errorData);
			throw new Error(`Brevo WhatsApp API error: ${JSON.stringify(errorData)}`);
		}

		const responseData = await response.json();
		return NextResponse.json({ message: 'WhatsApp message sent successfully.', responseData });
	} catch (error) {
		console.error('Error in WhatsApp API handler:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Internal server error' },
			{ status: 500 }
		);
	}
}
