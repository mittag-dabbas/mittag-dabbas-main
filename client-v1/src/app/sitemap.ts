import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://www.mittag-dabbas.com',
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: 'https://www.mittag-dabbas.com/menu',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8
		},
		{
			url: 'https://www.mittag-dabbas.com/enquiry',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: 'https://www.mittag-dabbas.com/contact',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: 'https://www.mittag-dabbas.com/daily-office-meal',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: 'https://www.mittag-dabbas.com/corporate-catering',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: 'https://www.mittag-dabbas.com/loyalty',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		}
	];
}
