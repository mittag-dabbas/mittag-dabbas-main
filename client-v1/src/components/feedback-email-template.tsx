import React from 'react';
import { Html, Body, Container, Text, Link, Preview, Section, Button } from '@react-email/components';

interface FeedbackEmailTemplateProps {
	customerName: string;
	feedbackLink: string;
}

const FeedbackEmailTemplate: React.FC<FeedbackEmailTemplateProps> = ({ customerName, feedbackLink }) => {
	return (
		<Html>
			<Preview>Share your feedback about your Mittag Dabbas experience</Preview>
			<Body style={{ backgroundColor: '#f6f9fc', padding: '20px 0' }}>
				<Container>
					<Section style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '5px' }}>
						<Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
							Hello {customerName},
						</Text>
						<Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
							Thank you for ordering from Mittag Dabbas! We hope you enjoyed your meal.
						</Text>
						<Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
							We would love to hear about your experience. Your feedback helps us improve our service.
						</Text>
						<Button
							href={feedbackLink}
							style={{
								backgroundColor: '#0E6E37',
								color: '#ffffff',
								padding: '12px 24px',
								borderRadius: '5px',
								textDecoration: 'none',
								display: 'inline-block',
								marginBottom: '20px'
							}}
						>
							Share Your Feedback
						</Button>
						<Text style={{ fontSize: '14px', color: '#666666' }}>This link will expire in 7 days.</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default FeedbackEmailTemplate;
