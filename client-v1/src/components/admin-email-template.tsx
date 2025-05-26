import { EURO } from '@/lib/constants';
import React from 'react';

const AdminEmailTemplate: React.FC<{ cartData: any; userData: any; amount: any; quantity: any }> = ({
	cartData,
	userData,
	amount,
	quantity
}) => {
	const deliveryAddress = userData.attributes.customer_delivery_addresses?.data.find(
		(address: any) => address.attributes.isDefaultAddress
	);

	return (
		<div
			style={{
				fontFamily: 'Arial, sans-serif',
				color: '#333',
				lineHeight: '1.8',
				backgroundColor: '#f8f8f8',
				padding: '20px'
			}}
		>
			<table
				width='50%'
				style={{
					backgroundColor: '#ffffff',
					margin: '0 auto',
					padding: '20px',
					borderRadius: '10px',
					boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
				}}
			>
				<tr>
					<td style={{ textAlign: 'center', padding: '20px' }}>
						<img
							src={'https://www.mittag-dabbas.com/assets/images/logo.png'}
							alt='Company Logo'
							style={{ maxWidth: '150px', marginBottom: '10px' }}
						/>
						<h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#0E6E37' }}>
							Order Invoice
						</h1>
					</td>
				</tr>
				<tr>
					<td style={{ padding: '20px', textAlign: 'left' }}>
						<div style={{}}>
							<div style={{ flex: 1 }}>
								<h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Customer Information</h3>
								<p style={{ margin: '5px 0', fontSize: '16px' }}>
									<strong>Name:</strong> {userData.attributes.FirstName}{' '}
									{userData.attributes.LastName}
								</p>
								<p style={{ margin: '5px 0', fontSize: '16px' }}>
									<strong>Email:</strong> {userData.attributes.Email}
								</p>
							</div>
							<div style={{ flex: 1 }}>
								<h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Delivery Address</h3>
								<p style={{ margin: '5px 0', fontSize: '16px' }}>
									{deliveryAddress?.attributes.Address || 'No Address Provided'}
								</p>
								<p style={{ margin: '5px 0', fontSize: '16px' }}>
									{deliveryAddress?.attributes.PostalCode}
								</p>
								<p style={{ margin: '5px 0', fontSize: '16px' }}>
									{deliveryAddress?.attributes.CompanyName || ''}
								</p>
							</div>
						</div>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, 1fr)',
								gap: '20px',
								marginTop: '20px'
							}}
						>
							{Object.entries(cartData).map(([dayIndex, day]: [string, any]) => {
								if (day.items.length === 0) return null;

								return (
									<div
										key={dayIndex}
										style={{ padding: '10px', borderRadius: '8px' }}
									>
										<h3 style={{ fontSize: '18px', color: '#000', marginBottom: '10px' }}>
											{`Day: ${day.deliveryDate} (${day.deliveryTime})`}
										</h3>
										<ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
											{day.items.map((item: any, index: number) => (
												<li
													key={index}
													style={{ fontSize: '16px', marginBottom: '5px', color: '#555' }}
												>
													<strong>x{item.quantity}</strong> {item.data.attributes.Name}
													<br />
													{/* <span style={{ color: '#888' }}>
														{item.data.attributes.Description}
													</span> */}
													<br />
													<strong style={{ color: '#333' }}>
														€{item.data.attributes.OfferedPrice.toFixed(2) * item.quantity}
													</strong>
												</li>
											))}
											<br />
										</ul>
									</div>
								);
							})}
						</div>
						<div
							style={{
								marginTop: '20px',
								paddingTop: '20px',
								borderTop: '1px solid #ddd'
							}}
						>
							<p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
								Total Quantity: {quantity || 0}
							</p>
							<p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
								Total Price: €{(amount || 0).toFixed(2)}
							</p>
						</div>
					</td>
				</tr>
				<tr style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>
					<td style={{ padding: '20px' }}>
						<p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
							This email was sent from this site. If you no longer wish to receive this email, change your
							email preferences here.
						</p>
					</td>
				</tr>
			</table>
		</div>
	);
};

export default AdminEmailTemplate;
