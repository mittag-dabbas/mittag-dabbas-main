import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAIL_1, ADMIN_EMAIL_2, DOMAIN_EMAIL } from '@/lib/constants';
import UserEmailTemplate from '@/components/user-email-template';
import AdminEmailTemplate from '@/components/admin-email-template';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
	try {
		const { userDetails, adminDetails } = await request.json();

		try {
			const batchEmailResponse = await resend.batch.send([
				{
					from: DOMAIN_EMAIL,
					to: [userDetails.userData.attributes.Email],
					subject:
						'Order Confirmation' +
						' | ' +
						userDetails.userData.attributes.FirstName +
						' ' +
						userDetails.userData.attributes.LastName,
					react: UserEmailTemplate({
						amount: userDetails.amount,
						// currency: userDetails.currency,
						cartData: userDetails.cartData,
						userData: userDetails.userData,
						quantity: userDetails.quantity
						// invoiceUrl: userDetails.invoiceUrl
					})
				},
				{
					from: DOMAIN_EMAIL,
					to: [ADMIN_EMAIL_1, ADMIN_EMAIL_2],
					subject:
						'New Order Placed By' +
						' | ' +
						adminDetails.userData.attributes.FirstName +
						' ' +
						adminDetails.userData.attributes.LastName,
					react: AdminEmailTemplate({
						amount: adminDetails.amount,
						// currency: adminDetails.currency,
						cartData: adminDetails.cartData,
						userData: adminDetails.userData,
						quantity: adminDetails.quantity
						// invoiceUrl: adminDetails.invoiceUrl
					})
				}
			]);

			return NextResponse.json({
				message: 'Email sent successfully.',
				batchEmailResponse
			});
		} catch (emailError) {
			console.error('Error sending email:', emailError);
			return NextResponse.json({ error: emailError }, { status: 500 });
		}
	} catch (error) {
		console.error('Error in email POST handler:', error);
		return NextResponse.json({ error: 'Invalid request or internal error.' }, { status: 500 });
	}
}
