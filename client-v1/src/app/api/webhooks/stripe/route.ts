import { buffer } from 'micro';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createPayment } from '@/actions/user-payment';
import UserEmailTemplate from '@/components/user-email-template';
import AdminEmailTemplate from '@/components/admin-email-template';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
	const sig = headers().get('Stripe-Signature') as string;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

	let event;

	try {
		const body = await request.text();
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
	} catch (err) {
		console.error('❌ Webhook signature verification failed:', err);
		return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;

		try {
			// Retrieve line items from the session
			const lineItemsDetails = await stripe.checkout.sessions.retrieve(session.id, {
				expand: ['line_items']
			});

			const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
				expand: ['data.price.product']
			});

			// Retrieve customer details from the session
			const { customer_email, amount_total, currency, id: sessionId } = session;

			const customer = await stripe.customers.create({ email: customer_email! });

			const invoice = await stripe.invoices.create({
				customer: customer.id
			});

			for (const item of lineItemsDetails.line_items?.data || []) {
				await stripe.invoiceItems.create({
					customer: customer.id,
					amount: item.amount_total,
					currency: item.currency,
					description: item.description,
					invoice: invoice.id
				});
			}

			// Finalize the invoice
			const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

			const paymentData = {
				CustomerEmail: customer_email,
				Amount: amount_total ? amount_total / 100 : 0,
				SessionID: sessionId,
				InvoiceID: finalizedInvoice.id,
				InvoiceUrl: finalizedInvoice.hosted_invoice_url,
				PaymentStatus: session.payment_status,
				AmountTax: session.total_details?.amount_tax
			};

			// Create payment record in Strapi
			await createPayment(paymentData);

			// Send confirmation emails with invoice URL
			const emailResponse = await fetch('/api/sendEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userDetails: {
						...session.metadata, // Any additional order details
						amount: amount_total ? amount_total / 100 : 0,
						quantity: lineItems.data.length,
						invoiceUrl: finalizedInvoice.hosted_invoice_url,
						cartData: lineItems.data,
						userData: {
							attributes: {
								Email: customer_email,
								FirstName: session.customer_details?.name?.split(' ')[0] || 'Valued',
								LastName: session.customer_details?.name?.split(' ')[1] || 'Customer'
							}
						}
					},
					adminDetails: {
						...session.metadata,
						amount: amount_total ? amount_total / 100 : 0,
						quantity: lineItems.data.length,
						invoiceUrl: finalizedInvoice.hosted_invoice_url,
						cartData: lineItems.data,
						userData: {
							attributes: {
								Email: customer_email,
								FirstName: session.customer_details?.name?.split(' ')[0] || 'Valued',
								LastName: session.customer_details?.name?.split(' ')[1] || 'Customer'
							}
						}
					}
				})
			});

			if (!emailResponse.ok) {
				console.error('Failed to send confirmation emails');
			}

			return NextResponse.json({ message: 'Payment and emails processed successfully.' }, { status: 200 });
		} catch (error) {
			console.error('❌ Error in payment processing:', error);
			return NextResponse.json({ error: `Server error: ${error}` }, { status: 500 });
		}
	} else {
		return NextResponse.json({ error: 'Unhandled event type' }, { status: 500 });
	}
}
