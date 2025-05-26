import Navbar from '@/components/core/header/navbar';
import { Box } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<Box sx={{ marginTop: '64px' }}>{children}</Box>
		</>
	);
}
