'use client';

import defaultSEO from '@/app/next-seo.config';
import { DefaultSeo } from 'next-seo';

export default function SEOProvider() {
	return <DefaultSeo {...defaultSEO} />;
}
