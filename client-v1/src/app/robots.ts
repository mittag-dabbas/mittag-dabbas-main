import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/thankyou']
		},
		sitemap: 'https://www.mittag-dabbas.com/sitemap.xml'
	};
}
