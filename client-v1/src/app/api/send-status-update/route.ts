import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAIL_1, ADMIN_EMAIL_2, DOMAIN_EMAIL } from '@/lib/constants';
import OrderStatusEmailTemplate from '@/components/order-status-email-template';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
	try {
		const { userDetails, adminDetails } = await request.json();

		// Skip sending email if status is ACCEPTED
		if (userDetails.newStatus === 'Accepted') {
			return NextResponse.json({
				message: 'Skipped sending email for ACCEPTED status'
			}, {status: 201});
		}

		try {
			const batchEmailResponse = await resend.batch.send([
				{
					from: DOMAIN_EMAIL,
					to: [userDetails.email],
					subject: `Order Status Update | ${userDetails.customerName}`,
					react: OrderStatusEmailTemplate({
						customerName: userDetails.customerName,
						orderItems: userDetails.orderItems,
						newStatus: userDetails.newStatus,
						deliveryAddress: userDetails.deliveryAddress,
						companyName: userDetails.companyName
					})
				},
				{
					from: DOMAIN_EMAIL,
					to: [ADMIN_EMAIL_1, ADMIN_EMAIL_2],
					subject: `Order Status Updated for ${adminDetails.customerName}`,
					react: OrderStatusEmailTemplate({
						customerName: adminDetails.customerName,
						orderItems: adminDetails.orderItems,
						newStatus: adminDetails.newStatus,
						deliveryAddress: adminDetails.deliveryAddress,
						companyName: adminDetails.companyName
					})
				}
			]);

			return NextResponse.json({
				message: 'Status update emails sent successfully.',
				batchEmailResponse
			});
		} catch (emailError) {
			console.error('Error sending status update email:', emailError);
			return NextResponse.json({ error: emailError }, { status: 500 });
		}
	} catch (error) {
		console.error('Error in status update email POST handler:', error);
		return NextResponse.json({ error: 'Invalid request or internal error.' }, { status: 500 });
	}
}
