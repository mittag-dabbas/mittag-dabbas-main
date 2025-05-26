'use client';

import Footer from '@/components/core/footer/footer';
import Navbar from '@/components/core/header/navbar';
import { Box } from '@mui/material';
import FloatingChatBot from '@/components/chat-bot';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<Box sx={{ marginTop: '64px' }}>{children}</Box>
			{/* <FloatingChatBot /> */}
			<Footer />
		</>
	);
}
