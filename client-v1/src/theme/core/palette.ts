import { PaletteOptions, TypeBackground } from '@mui/material';

export interface CustomPaletteOptions extends PaletteOptions {
	background: ExtendedTypeBackground;
}

interface ExtendedTypeBackground extends TypeBackground {
	bg1: string;
	bg2: string;
	bg3: string;
	bg4: string;
}

export const palette: CustomPaletteOptions = {
	mode: 'light',

	// COLORS
	primary: {
		light: '#4CAF50', // lighter green
		main: '#0E6E37', // main green
		dark: '#004D25', // darker green
		contrastText: '#FFF'
	},
	secondary: {
		light: '#8DFB8A', // lighter green
		main: '#5BD75A', // main green
		dark: '#2BAA2B', // darker green
		contrastText: '#FFF'
	},
	success: {
		light: '#58D68D', // lighter green
		main: '#27AE60', // main green
		dark: '#1E8449' // darker green
	},
	warning: {
		light: '#F9DBAF', // lighter yellow-orange
		main: '#F2994A', // main orange
		dark: '#b93815' // darker orange
	},
	error: {
		light: '#F86A60', // lighter red
		main: '#F04438', // main error red
		dark: '#C0392B' // darker error red
	},

	// TEXT COLORS
	text: {
		primary: '#090F1A', // dark text
		secondary: '#3F3F3F', // grey text
		disabled: '#A8A8A8' // disabled text
	},

	// BACKGROUND COLORS
	background: {
		default: '#FFFFFF',
		paper: '#F5F9F7',
		bg1: '#F2F4F7',
		bg2: '#FFFFFF',
		bg3: '#F5F9F7',
		bg4: '#F2F4F7'
	},

	// COMMON COLORS
	common: {
		white: '#FFFFFF',
		black: '#000000'
	},

	divider: '#E4E7EC',

	// GREY COLORS
	grey: {
		50: '#E4E7EC',
		100: '#C7CEE0',
		200: '#A9B4CC',
		300: '#8B9AB8',
		400: '#6E80A4',
		500: '#506690',
		600: '#3D4D75',
		700: '#2A365A',
		800: '#171F3F',
		900: '#040824'
	}
};
