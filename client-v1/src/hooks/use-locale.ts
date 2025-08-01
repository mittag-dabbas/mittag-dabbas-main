import { useContext } from 'react';
import { LocaleContext } from '@/providers/locale-provider';

export const useLocale = () => {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error('useLocale must be used within a LocaleProvider');
	}
	return context;
};
