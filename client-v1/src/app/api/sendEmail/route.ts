import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAIL_1, ADMIN_EMAIL_2, DOMAIN_EMAIL } from '@/lib/constants';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface EmailData {
	sender: {
		name: string;
		email: string;
	};
	to: {
		email: string;
		name: string;
	}[];
	subject: string;
	htmlContent: string;
}

interface UserAttributes {
	Email: string;
	FirstName: string;
	LastName: string;
	DeliveryAddress?: string;
	customer_delivery_addresses?: {
		data: Array<{
			attributes: {
				Address: string;
			};
		}>;
	};
	orders?: {
		data: Array<{
			attributes: {
				id: number;
				deliveryDate: string;
				Name: string;
			};
		}>;
	};
}

interface OrderDetails {
	amount: number;
	quantity: number;
	cartData: any;
	userData: {
		attributes: UserAttributes;
	};
	invoiceUrl?: string;
}

function parseDeliveryDate(rawDate: string): string {
	if (!rawDate) return '<span style="color: red;">No valid delivery date</span>';

	// Convert from DD/MM/YYYY to YYYY-MM-DD for correct parsing
	const dateParts = rawDate.split('/');
	if (dateParts.length === 3) {
		const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
		return new Date(formattedDate).toLocaleDateString();
	}
	return '<span style="color: red;">No valid delivery date</span>';
}

function renderCartItems(cartData: any): string {
	if (!cartData || Object.keys(cartData).length === 0) {
		console.warn('Cart data is empty or not structured correctly:', cartData);
		return '<p style="color: red;">No items found in the order.</p>';
	}

	let hasValidItems = false;
	const cartContent = Object.keys(cartData)
		.map(key => {
			const cartSection = cartData[key];
			const itemsArray = cartSection?.items ?? [];
			const deliveryDate = parseDeliveryDate(cartSection?.deliveryDate);

			if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
				console.warn('No items found in this section of the cart:', itemsArray);
				return ''; // Skip this section if it's empty
			}

			hasValidItems = true; // Mark that at least one valid item exists

			return itemsArray
				.map(
					(item: { data?: { attributes?: { Name?: string; OfferedPrice?: string } }; quantity?: string }) => {
						const name =
							item.data?.attributes?.Name || '<span style="color: red;">Missing Item Name</span>';
						const quantity = item.quantity ?? '<span style="color: red;">Missing Quantity</span>';
						const price =
							item.data?.attributes?.OfferedPrice ?? '<span style="color: red;">Missing Price</span>';

						return `
                            <div style="border-bottom: 1px solid #dee2e6; padding: 10px 0;">
                                <p style="margin: 5px 0;">Item: ${name}</p>
                                <p style="margin: 5px 0;">Quantity: ${quantity}</p>
                                <p style="margin: 5px 0;">Price: €${price}</p>
                                <p style="margin: 5px 0;">Delivery Date: ${deliveryDate}</p>
                            </div>
                        `;
					}
				)
				.join('');
		})
		.join('<hr>');

	// If no valid items were found, return the "No items found" message
	if (!hasValidItems) {
		return '<p style="color: red;">No items found in the order.</p>';
	}

	return cartContent;
}

function generateUserEmailHtml(data: OrderDetails) {
	const deliveryAddress =
		data.userData.attributes.DeliveryAddress ||
		data.userData.attributes.customer_delivery_addresses?.data?.[0]?.attributes?.Address ||
		'No address provided';
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">Order Confirmation</h1>
          
          <p>Dear ${data.userData.attributes.FirstName},</p>
          
          <p>Thank you for your order! Here are your order details:</p>
          <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p>Total Amount: €${data.amount.toFixed(2)}</p>
            <p>Items Ordered: ${data.quantity}</p>
            
            ${renderCartItems(data.cartData)}
          </div>
          
          ${data.invoiceUrl ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${data.invoiceUrl}" 
               style="background-color: #0E6E37; 
                      color: white; 
                      padding: 10px 20px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
              View Invoice
            </a>
          </div>
          ` : ''}
          
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>Mittag-dabbas Team</p>
        </div>
      </body>
    </html>
  `;
}

function generateAdminEmailHtml(data: OrderDetails) {
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">New Order Received</h1>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Information</h3>
            <p>Name: ${data.userData.attributes.FirstName} ${data.userData.attributes.LastName}</p>
            <p>Email: ${data.userData.attributes.Email}</p>
            <p><strong>Delivery Address:</strong> ${data.userData.attributes.DeliveryAddress || 'No address provided'}</p>
            <p>Total Amount: €${data.amount.toFixed(2)}</p>
            <p>Items Ordered: ${data.quantity}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            ${renderCartItems(data.cartData)}
          </div>

          ${data.invoiceUrl ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${data.invoiceUrl}" 
               style="background-color: #0E6E37; 
                      color: white; 
                      padding: 10px 20px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
              View Invoice
            </a>
          </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.userDetails || !body.adminDetails) {
			throw new Error('Missing required details in request body');
		}

		const { userDetails, adminDetails } = body;

		// Fetch Delivery Address properly
		const deliveryAddress =
			userDetails.userData.attributes.customer_delivery_addresses?.data?.[0]?.attributes?.Address ??
			userDetails.userData.attributes.orders?.data?.[0]?.attributes?.Address ??
			'No address provided';

		// Add extracted address to userDetails
		userDetails.userData.attributes.DeliveryAddress = deliveryAddress;
		adminDetails.userData.attributes.DeliveryAddress = deliveryAddress;

		// Validate required fields
		if (!userDetails.userData?.attributes?.Email) {
			throw new Error('User email is required');
		}

		// Generate email content
		const userHtmlContent = generateUserEmailHtml(userDetails);
		const adminHtmlContent = generateAdminEmailHtml(adminDetails);

		const emailPayload = {
			firstEmail: {
				sender: {
					name: 'Mittag-dabbas',
					email: DOMAIN_EMAIL
				},
				to: [
					{
						email: userDetails.userData.attributes.Email,
						name: `${userDetails.userData.attributes.FirstName} ${userDetails.userData.attributes.LastName}`
					}
				],
				subject: `Order Confirmation | ${userDetails.userData.attributes.FirstName} ${userDetails.userData.attributes.LastName}`,
				htmlContent: userHtmlContent
			},
			secondEmail: {
				sender: {
					name: 'Mittag-dabbas',
					email: DOMAIN_EMAIL
				},
				to: [
					{ email: ADMIN_EMAIL_1, name: 'Admin 1' },
					{ email: ADMIN_EMAIL_2, name: 'Admin 2' }
				],
				subject: `New Order Placed By | ${adminDetails.userData.attributes.FirstName} ${adminDetails.userData.attributes.LastName}`,
				htmlContent: adminHtmlContent
			}
		};

		// Send emails
		const sendEmail = async (emailData: EmailData) => {
			if (!emailData.htmlContent || emailData.htmlContent.trim() === '') {
				throw new Error('HTML content is empty');
			}

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
		};

		const userEmailResponse = await sendEmail(emailPayload.firstEmail);
		const adminEmailResponse = await sendEmail(emailPayload.secondEmail);

		return NextResponse.json({
			message: 'Emails sent successfully.',
			userEmailResponse,
			adminEmailResponse
		});
	} catch (error) {
		console.error('Detailed error in email POST handler:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Invalid request or internal error.',
				details: error instanceof Error ? error.stack : undefined
			},
			{
				status: 500
			}
		);
	}
}
