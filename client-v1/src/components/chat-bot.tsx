import { Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

type Props = {};

const FloatingChatBot = (props: Props) => {
	const muiTheme = useTheme();
	const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
	const [isOpen, setIsOpen] = useState(false);

	const theme = {
		background: muiTheme.palette.background.paper,
		fontFamily: muiTheme.typography.fontFamily,
		headerBgColor: muiTheme.palette.primary.main,
		headerFontColor: muiTheme.palette.common.white,
		headerFontSize: '15px',
		botBubbleColor: muiTheme.palette.primary.light,
		botFontColor: muiTheme.palette.common.white,
		userBubbleColor: muiTheme.palette.background.default,
		userFontColor: muiTheme.palette.text.primary
	};

	const steps = [
		{
			id: '1',
			component: (
				<div>
					<p>You can reach out to us directly on WhatsApp!</p>
					<Button
						variant='contained'
						color='primary'
						onClick={() =>
							window.open('https://wa.me/+4917632473037?text=Hi,%20I%20have%20a%20question...', '_blank')
						}
						startIcon={
							<Image
								src='/assets/icons/whatsapp.svg'
								alt='whatsapp'
								width={20}
								height={20}
							/>
						}
					>
						Chat on WhatsApp
					</Button>
				</div>
			),
			end: true
		}
	];

	return (
		<div
			style={{
				position: 'fixed',
				bottom: isMobile ? '10px' : '20px',
				right: isMobile ? '10px' : '20px',
				zIndex: 1000,
				width: isOpen ? (isMobile ? '70%' : 'auto') : 'auto'
			}}
		>
			<Box
				sx={{
					position: 'relative',
					width: isOpen ? (isMobile ? '100%' : 'auto') : 'auto',
					height: isOpen ? (isMobile ? '50vh' : 'auto') : 'auto',
					boxShadow: isMobile ? 'none' : '0px 4px 6px rgba(0,0,0,0.2)',
					borderRadius: isMobile ? 0 : muiTheme.shape.borderRadius,
					overflow: 'hidden',
					backgroundColor: muiTheme.palette.background.paper
				}}
			>
				<ThemeProvider theme={theme}>
					<Box>
						{isOpen ? (
							<>
								{/* Close Button */}
								<IconButton
									onClick={() => setIsOpen(false)}
									sx={{
										position: 'absolute',
										top: '10px',
										right: '10px',
										zIndex: 2000,
										color: muiTheme.palette.grey[600]
									}}
								>
									<Image
										src='/assets/icons/close-white.svg'
										alt='chat icon'
										width={isMobile ? 15 : 22}
										height={isMobile ? 15 : 22}
									/>
								</IconButton>

								{/* ChatBot Component */}
								<ChatBot
									steps={steps}
									headerTitle='Chat Support'
									floating={false}
									opened={true}
								/>
							</>
						) : (
							/* Open Button */
							<Button
								variant='contained'
								color='primary'
								onClick={() => setIsOpen(true)}
								sx={{
									borderRadius: '100%',
									width: '60px',
									height: '60px',
									minWidth: 'unset',
									position: 'fixed',
									bottom: '10px',
									right: '10px',
									zIndex: 1000
								}}
							>
								<ChatBubbleIcon />
							</Button>
						)}
					</Box>
				</ThemeProvider>
			</Box>
		</div>
	);
};

export default FloatingChatBot;
30;
