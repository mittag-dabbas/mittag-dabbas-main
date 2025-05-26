'use client';

import { useAppSelector } from '@/store/store';
import { useEffect } from 'react';

export default function BrevoIntegration() {
	const user = useAppSelector(state => state.auth.user);

	useEffect(() => {
		if (!user || !user.email) {
			console.warn('Brevo: User data is missing or incomplete.');
			return; // Exit if user is not available
		}

		// Load Brevo Conversations script dynamically
		const script = document.createElement('script');
		script.async = true;
		script.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
		document.head.appendChild(script);

		// Initialize Brevo Conversations
		(window as any).BrevoConversationsID = '67a345c2265feaa5230bfe2e';
		(window as any).BrevoConversations =
			(window as any).BrevoConversations ||
			function () {
				((window as any).BrevoConversations.q = (window as any).BrevoConversations.q || []).push(arguments);
			};

		script.onload = () => {
			if (user.displayName) {
				const [firstName, ...lastNameParts] = user.displayName.split(' ');
				const lastName = lastNameParts.join(' ') || 'Unknown';

				console.log('Brevo: Sending user data', { firstName, lastName, email: user.email });

				(window as any).BrevoConversations('identify', {
					firstName: firstName,
					lastName: lastName,
					email: user.email,
					avatar: user.photoURL || '',
					customFields: {
						provider: user.providerData?.[0]?.providerId || 'unknown',
						uid: user.uid,
						isVerified: user.emailVerified ? 'Yes' : 'No',
						lastLogin: new Date(parseInt(user.lastLoginAt)).toLocaleString()
					}
				});
			} else {
				console.warn('Brevo: No displayName found, cannot send user identity.');
			}
		};

		return () => {
			document.head.removeChild(script);
		};
	}, [user]);

	return null;
}
