'use client';

import { Analytics } from '@vercel/analytics/next';
import { GoogleTagManager, GoogleAnalytics, sendGTMEvent, sendGAEvent } from '@next/third-parties/google';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocaleProvider } from '@/providers/locale-provider';
import theme from '@/theme';
import { store, persistor } from '@/store/store';

// Global CSS
import './global.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useEffect } from 'react';
import BrevoIntegration from '@/components/brevoIntegration';
import { usePathname } from 'next/navigation';
import SEOProvider from '@/components/SEOProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const canonicalUrl = `https://mittag-dabbas.com${pathname}`;
	useEffect(() => {
		sendGTMEvent({
			event: 'add_to_cart',
			value: 'Item'
		});

		sendGAEvent({
			action: 'add_to_cart',
			category: 'cart',
			label: 'Item'
		});
	}, []);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: 'Mittag-Dabbas',
		url: 'https://mittag-dabbas.com/',
		logo: 'https://mittag-dabbas.com/logo.png',
		description:
			'Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering!',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Example Street 123',
			addressLocality: 'Berlin',
			postalCode: '10115',
			addressCountry: 'DE'
		},
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+49 30 1234567',
			contactType: 'customer service',
			areaServed: 'Berlin, Germany'
		},
		openingHours: 'Mo-Fr 09:00-18:00',
		sameAs: ['https://www.facebook.com/mittagdabbas', 'https://www.instagram.com/mittagdabbas']
	};

	return (
		<html lang='en'>
			<head>
				<title>Corporate Meal Delivery Berlin | Healthy Office Catering - Mittag-Dabbas</title>
				<link
					rel='canonical'
					href={canonicalUrl.split('?')[0]}
				/>
				<meta
					name='description'
					content='Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering!'
				/>
				<meta
					name='keywords'
					content='corporate meal delivery, Berlin food delivery, office catering, business lunch service, office meals, authentic meals Berlin'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<meta
					name='robots'
					content='index, follow'
				/>

				{/* Open Graph / Facebook */}
				<meta
					property='og:type'
					content='website'
				/>
				<meta
					property='og:title'
					content='Corporate Meal Delivery in Berlin | Healthy Office Catering – Mittag-Dabbas'
				/>
				<meta
					property='og:description'
					content='Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering!'
				/>
				<meta
					property='og:url'
					content='https://mittag-dabbas.com/'
				/>
				<meta
					property='og:locale'
					content='en_US'
				/>
				<meta
					property='og:site_name'
					content='Mittag-Dabbas'
				/>
				<meta
					property='og:image'
					content='/assets/images/home-section-0.png'
				/>

				<meta
					name='twitter:card'
					content='summary_large_image'
				/>
				<meta
					name='twitter:title'
					content='Corporate Meal Delivery in Berlin | Healthy Office Catering – Mittag-Dabbas'
				/>
				<meta
					name='twitter:description'
					content='Mittag-Dabbas offers fresh and delicious corporate meal delivery in Berlin. Warm & Soul filling office meals—hassle-free catering!'
				/>
				<meta
					name='twitter:image'
					content='/assets/images/home-section-0.png'
				/>
				<meta
					httpEquiv='content-language'
					content='en'
				/>

				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				/>

				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-Y18GWGJZ53'
				></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y18GWGJZ53');
            `
					}}
				/>
				<script
					src='https://cdn.brevo.com/js/sdk-loader.js'
					async
				></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              window.Brevo = window.Brevo || [];
              Brevo.push([
                "init",
                {
                  client_key: "bsxn3jnm8hd7dl1twzio1xz1",
                }
              ]);
            `
					}}
				/>
			</head>
			<body>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<ThemeProvider theme={theme}>
						<SnackbarProvider>
							<Provider store={store}>
								<PersistGate
									loading={null}
									persistor={persistor}
								>
									<LocaleProvider>
										<CssBaseline />
										<GoogleTagManager gtmId='GTM-TDJKQ33Q' />
										<BrevoIntegration />
										<SEOProvider />
										{children}
										<Analytics mode='production' />
										<GoogleAnalytics gaId='G-Y18GWGJZ53' />
									</LocaleProvider>
								</PersistGate>
							</Provider>
						</SnackbarProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
