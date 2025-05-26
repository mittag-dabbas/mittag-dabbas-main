declare module 'react-simple-chatbot' {
	import React from 'react';

	// Define the types for steps
	export interface Step {
		id: string;
		message?: string;
		trigger?: string | number;
		end?: boolean;
		options?: Array<{
			value: string | number;
			label: string;
			trigger: string | number;
		}>;
		component?: JSX.Element | React.FC<any>;
		asMessage?: boolean;
		delay?: number;
		metadata?: any;
	}

	// Define the ChatBot props
	export interface ChatBotProps {
		steps: Step[];
		floating?: boolean;
		opened?: boolean;
		handleEnd?: (data: any) => void;
		botAvatar?: string;
		userAvatar?: string;
		style?: React.CSSProperties;
		headerTitle?: string;
		hideHeader?: boolean;
		hideUserAvatar?: boolean;
		bubbleStyle?: React.CSSProperties;
		bubbleOptionStyle?: React.CSSProperties;
		contentStyle?: React.CSSProperties;
		footerStyle?: React.CSSProperties;
		floatingIcon?: JSX.Element;
		floatingIconStyle?: React.CSSProperties;
		floatingIconHeight?: number;
		floatingIconWidth?: number;
		floatingIconColor?: string;
		floatingIconBackground?: string;
		floatingIconChat?: JSX.Element;
	}

	// Define the ChatBot component
	export class ChatBot extends React.Component<ChatBotProps, any> {}

	export default ChatBot;
}
