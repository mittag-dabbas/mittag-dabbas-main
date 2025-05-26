import React from 'react';

interface OrderStatusEmailTemplateProps {
	customerName: string;
	orderItems: Array<{
		menuItem: string;
		quantity: number;
	}>;
	newStatus: string;
	deliveryAddress: string;
	companyName: string;
}

const OrderStatusEmailTemplate: React.FC<OrderStatusEmailTemplateProps> = ({
	customerName,
	orderItems,
	newStatus,
	deliveryAddress,
	companyName
}) => {
	return (
		<div style={{ backgroundColor: '#f6f9fc', padding: '24px' }}>
			<div
				style={{
					backgroundColor: 'white',
					borderRadius: '4px',
					padding: '32px',
					maxWidth: '600px',
					margin: '0 auto'
				}}
			>
				<div style={{ marginBottom: '24px', textAlign: 'center' }}>
					<img
						src='https://www.mittag-dabbas.com/assets/images/logo.png'
						alt='Mittag Dabbas Logo'
						style={{ maxWidth: '150px' }}
					/>
				</div>

				<h5 style={{ marginBottom: '16px' }}>Hello {customerName},</h5>

				<p style={{ marginBottom: '24px' }}>
					Your order status has been updated to: <strong>{newStatus}</strong>
				</p>

				{/* Vertical spacing */}
				<div style={{ margin: '16px 0' }}></div>

				<h6 style={{ marginBottom: '8px' }}>Order Details:</h6>

				<div style={{ marginBottom: '24px' }}>
					<p style={{ margin: 0 }}>Delivery Address: {deliveryAddress}</p>
					{companyName && <p style={{ margin: 0 }}>Company: {companyName}</p>}
				</div>

				<div style={{ marginBottom: '24px' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr>
								<th
									style={{
										textAlign: 'left',
										border: '1px solid #ddd',
										padding: '8px'
									}}
								>
									Item
								</th>
								<th
									style={{
										textAlign: 'right',
										border: '1px solid #ddd',
										padding: '8px'
									}}
								>
									Quantity
								</th>
							</tr>
						</thead>
						<tbody>
							{orderItems.map((item, index) => (
								<tr key={index}>
									<td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.menuItem}</td>
									<td
										style={{
											border: '1px solid #ddd',
											padding: '8px',
											textAlign: 'right'
										}}
									>
										{item.quantity}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<p
					style={{
						marginTop: '24px',
						textAlign: 'center',
						color: '#6e6e6e'
					}}
				>
					Thank you for choosing Mittag Dabbas!
				</p>
			</div>
		</div>
	);
};

export default OrderStatusEmailTemplate;
