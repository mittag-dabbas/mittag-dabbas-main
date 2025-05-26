import { NextSeoProps } from 'next-seo';

const defaultSEO: NextSeoProps = {
	title: 'Corporate Meal Delivery Berlin | Healthy Office Catering - Mittag-Dabbas',
	description:
		'Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering!',
	canonical: 'https://mittag-dabbas.com',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://mittag-dabbas.com',
		title: 'Corporate Meal Delivery in Berlin | Healthy Office Catering – Mittag-Dabbas',
		description:
			'Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering!',
		site_name: 'Mittag-Dabbas',
		images: [
			{
				url: 'https://mittag-dabbas.com/assets/images/home-section-0.png',
				width: 1200,
				height: 630,
				alt: 'Mittag-Dabbas Office Meal Delivery in Berlin'
			}
		]
	},
	twitter: {
		handle: '@mittag-dabbas',
		site: '@mittag-dabbas',
		cardType: 'summary_large_image'
	}
};

export default defaultSEO;
