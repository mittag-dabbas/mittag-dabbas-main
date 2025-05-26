import { Components, CssVarsTheme, Theme } from '@mui/material';

export const components: Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme> = {
	MuiButton: {
		variants: [
			{
				props: {
					variant: 'outlined'
				},
				style: {
					borderWidth: 2,
					borderColor: '#0E6E37',
					':hover': {
						borderColor: '#004D25'
					}
				}
			}
		],
		defaultProps: {
			disableElevation: true
		},
		styleOverrides: {
			root: ({ theme }) => ({
				borderRadius: 8,
				fontSize: theme.typography.pxToRem(14)
			})
		}
	},
	MuiTextField: {
		defaultProps: {
			variant: 'outlined',
			fullWidth: true,
			size: 'small'
		},

		styleOverrides: {
			root: {
				'& fieldset': {
					borderRadius: 8
				},
				'& .MuiFormHelperText-root': {
					fontSize: '0.75rem',
					mb: 0
				}
			}
		}
	},
	MuiCheckbox: {
		defaultProps: {
			disableRipple: true
		},
		styleOverrides: {
			root: {
				borderRadius: 8,
				'&.Mui-checked': {
					color: '#0E6E37'
				}
			}
		}
	},
	MuiAlert: {
		defaultProps: {
			variant: 'standard'
		},
		styleOverrides: {
			root: {
				'MuiAlert-message': {}
			}
		}
	},
	MuiAccordion: {
		defaultProps: {
			elevation: 0,
			disableGutters: true
			// expanded: true
		},
		styleOverrides: {
			root: {
				'&.Mui-expanded': {
					margin: 0,
					border: 'none'
				},
				'&.Mui-collapsed': {
					border: 'none'
				},
				'&.MuiPaper-root': {
					border: 'none',
					boxShadow: 'none'
				},
				backgroundColor: 'transparent'
			}
		}
	},
	MuiTab: {
		defaultProps: {
			disableRipple: true
		},
		styleOverrides: {
			root: {
				borderRadius: 8
			}
		}
	},
	MuiTabs: {
		defaultProps: {
			variant: 'scrollable',
			scrollButtons: 'auto',
			draggable: true
		}
	},
	MuiCardContent: {
		styleOverrides: {
			root: {
				'&.MuiCardContent-root': {
					padding: 8,
					paddingTop: 0
				}
			}
		}
	},
	MuiToolbar: {
		styleOverrides: {
			root: {
				'&.MuiToolbar-root': {
					padding: 0
				}
			}
		}
	},
	// MuiContainer: {
	// 	styleOverrides: {
	// 		root: ({theme}) => ({
	// 			[theme.breakpoints.down('sm')]: {
	// 				paddingLeft: 0, // Padding for mobile screens
	// 			},
	// 		}),
	// 	},
	// },
	MuiSwitch: {
		styleOverrides: {
			root: ({ theme }) => ({
				padding: 8,
				'& .MuiSwitch-track': {
					borderRadius: 22 / 2,
					'&::before, &::after': {
						content: '""',
						position: 'absolute',
						top: '50%',
						transform: 'translateY(-50%)',
						width: 16,
						height: 16
					},
					'&::before': {
						backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
							theme.palette.getContrastText(theme.palette.primary.main)
						)}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
						left: 12
					},
					'&::after': {
						backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
							theme.palette.getContrastText(theme.palette.primary.main)
						)}" d="M19,13H5V11H19V13Z" /></svg>')`,
						right: 12
					}
				},
				'& .MuiSwitch-thumb': {
					boxShadow: 'none',
					width: 16,
					height: 16,
					margin: 2
				}
			})
		}
	},

	MuiPagination: {
		styleOverrides: {
			root: {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: 0
			}
		}
	},

	MuiPaginationItem: {
		styleOverrides: {
			root: ({ theme }) => ({
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: theme.shape.borderRadius,
				color: theme.palette.text.primary,
				fontWeight: 500,

				'.Mui-selected': {
					color: theme.palette.primary.main,
					backgroundColor: theme.palette.background.default,
					border: `1px solid ${theme.palette.primary.main}`
				},

				'&:hover': {
					backgroundColor: theme.palette.background.paper
				}
			})
		}
	}
};
