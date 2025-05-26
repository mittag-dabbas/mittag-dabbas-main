import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DOMAIN_EMAIL } from '@/lib/constants';
import FeedbackEmailTemplate from '@/components/feedback-email-template';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const maxDuration = 60; // 5 minutes timeout

export async function GET() {
	try {
		// Get orders from the last 5-10 minutes
		const fiveMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
		const tenMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders?filters[createdAt][$gte]=${tenMinutesAgo}&filters[createdAt][$lte]=${fiveMinutesAgo}&filters[feedbackEmailSent][$eq]=false&populate=*`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch recent orders');
		}

		const { data: orders } = await response.json();

		// Send feedback emails for each order
		for (const order of orders) {
			const feedbackLink = `${process.env.NEXT_PUBLIC_APP_URL}/feedback?orderId=${order.id}`;

			await resend.emails.send({
				from: DOMAIN_EMAIL,
				to: [order.attributes.Email],
				subject: 'How was your Mittag Dabbas experience?',
				react: FeedbackEmailTemplate({
					customerName: order.attributes.Name,
					feedbackLink
				})
			});

			// Update order to mark feedback email as sent
			await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/orders/${order.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: {
						feedbackEmailSent: true
					}
				})
			});
		}

		return NextResponse.json({
			message: `Processed ${orders.length} orders for feedback emails`
		});
	} catch (error) {
		console.error('Error in feedback cron job:', error);
		return NextResponse.json({ error: 'Failed to process feedback emails' }, { status: 500 });
	}
}
