import { Work_Sans, Caramel, Red_Rose } from 'next/font/google';
import { TypographyOptions } from '@mui/material/styles/createTypography';

// for h4, h5, h6, body, subtitle, caption
const workSans = Work_Sans({
	weight: ['200', '300', '400', '500', '600', '700'],
	subsets: ['latin'],
	display: 'swap'
});

// for h1, h2, h3
const redRose = Red_Rose({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	display: 'swap'
});

export const typography: TypographyOptions = {
	h1: {
		fontSize: '30px',
		lineHeight: '38px',
		fontWeight: 700, // bold
		fontFamily: redRose.style.fontFamily
	},
	h2: {
		fontSize: '28px',
		lineHeight: '36px',
		fontWeight: 600, // semibold
		fontFamily: redRose.style.fontFamily
	},
	h3: {
		fontSize: '24px',
		lineHeight: '32px',
		fontWeight: 600, // semibold
		fontFamily: redRose.style.fontFamily
	},
	h4: {
		fontSize: '20px',
		lineHeight: '30px',
		fontWeight: 500, // medium
		fontFamily: redRose.style.fontFamily
	},
	h5: {
		fontSize: '20px',
		lineHeight: '28px',
		fontWeight: 400, // medium
		fontFamily: redRose.style.fontFamily
	},
	h6: {
		fontSize: '16px',
		lineHeight: '24px',
		fontWeight: 500, // medium
		fontFamily: workSans.style.fontFamily
	},
	body1: {
		fontSize: '14px',
		lineHeight: '20px',
		fontWeight: 400, // regular
		fontFamily: workSans.style.fontFamily
	},
	body2: {
		fontSize: '13px',
		lineHeight: '18px',
		fontWeight: 300, // regular
		fontFamily: workSans.style.fontFamily
	},
	subtitle1: {
		fontSize: '14px',
		lineHeight: '24px',
		fontWeight: 500, // regular
		fontFamily: workSans.style.fontFamily
	},
	subtitle2: {
		fontSize: '13px',
		lineHeight: '16px',
		fontWeight: 500, // regular
		fontFamily: workSans.style.fontFamily
	},
	caption: {
		fontSize: '28px',
		lineHeight: '10px',
		fontWeight: 400, // regular
		fontFamily: workSans.style.fontFamily,
		color: '#0E6E37'
		// fontStyle: 'italic'
	}
};
