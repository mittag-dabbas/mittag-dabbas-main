'use client';
import { Shadows, ThemeOptions, createTheme } from '@mui/material/styles';
import { palette } from './core/palette';
import { typography } from './core/typography';
import { components } from './core/components';

const defaultTheme = createTheme();
const defaultShadows: ThemeOptions['shadows'] = [...defaultTheme.shadows];

const theme = createTheme({
	palette: palette,
	typography: typography,
	components: components,
	shape: {
		borderRadius: 3
	},
	shadows: defaultShadows.map(() => 'none') as Shadows,
	unstable_sxConfig: {
		borderColor: {
			style(props) {
				return {
					borderColor: props.theme.palette.grey[50]
				};
			}
		}
	}
});

export default theme;
