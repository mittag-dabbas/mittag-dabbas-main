'use client';

import { createContext, ReactNode, useState } from 'react';
import { IntlProvider } from 'react-intl';

// locales key value pair
import ENGLISH from '@/locales/en.json';
import GERMAN from '@/locales/de.json';

const messages: Record<string, Record<string, string>> = {
	en: ENGLISH,
	de: GERMAN
};

type LocaleContextProps = {
	locale: string;
	setLocale: (locale: string) => void;
};

const defaultLocale = 'en'; // default English

export const LocaleContext = createContext<LocaleContextProps>({
	locale: defaultLocale,
	setLocale: () => {}
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocale] = useState<string>(defaultLocale);

	return (
		<LocaleContext.Provider value={{ locale, setLocale }}>
			<IntlProvider
				locale={locale}
				messages={messages[locale]}
			>
				{children}
			</IntlProvider>
		</LocaleContext.Provider>
	);
};
