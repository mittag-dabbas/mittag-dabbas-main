import { Container, Grid, Stack, Avatar, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import theme from '@/theme';
import Heading from './heading';
import Link from 'next/link';
import { object } from 'zod';
import { HOME } from '@/lib/constants';

type Props = {
	caption?: string;
	captionAlign?: 'left' | 'center' | 'right';
	title: string;
	reverse: boolean;
	featureImage: string | StaticImageData;
	featureImageWidth?: number;
	featureImageHeight?: number;
	featureDescription: ContentItemProps[];
	buttonText?: string;
	navigateUrl?: string;
	warningText?: string;
	anchorId?: string;
};

const FeatureCard = (props: Props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Container
			sx={{ py: 10 }}
			id={props.anchorId}
		>
			<Grid
				container
				// spacing={4}
				gap={2}
				alignItems='center'
				justifyContent='center'
				direction={props.reverse ? 'row-reverse' : 'row'}
			>
				{/* Left: Image */}
				<Grid
					item
					xs={12}
					md={5}
					sx={{
						display: 'flex',
						justifyContent: isMobile ? 'center' : props.reverse ? 'flex-end' : 'flex-start'
					}}
				>
					<Image
						src={props.featureImage}
						alt='image'
						width={isMobile ? 380 : 450}
						height={isMobile ? 320 : 420}
						style={{ borderRadius: '8px', objectFit: 'cover' }}
					/>
				</Grid>

				{/* Right: Content with Icon Placeholders */}
				<Grid
					item
					xs={12}
					md={6}
				>
					<Heading
						title={props.title}
						caption={props.caption}
						captionAlign={props.captionAlign}
						titleInCaps={false}
					/>

					{/* Content with Icon Placeholders */}
					<Stack
						spacing={2}
						sx={{ mt: 2 }}
						// alignItems={'flex-start'}
					>
						<>
							{props.featureDescription.map((item, index) => (
								<ContentItem
									key={index}
									content={item.content}
									icon={item.icon}
								/>
							))}
						</>
					</Stack>
					{/* button */}
					<Box
						sx={{
							mt: props.warningText ? 2 : 4
						}}
					>
						{props.warningText && (
							<Typography
								variant='body1'
								align='justify'
								sx={{ color: theme.palette.error.main }}
							>
								{props.warningText}
							</Typography>
						)}
						{props.buttonText && (
							<Link
								href={props.navigateUrl ? props.navigateUrl : HOME}
								// style={{ textDecoration: 'none', }}
							>
								<Button variant='contained'>{props.buttonText}</Button>
							</Link>
						)}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

type ContentItemProps = {
	content: string | JSX.Element;
	icon?: string;
};

const ContentItem = ({ content, icon }: ContentItemProps) => {
	return (
		<Stack
			direction='row'
			spacing={2}
			alignItems='center'
		>
			{icon && (
				// <Avatar sx={{ width: 40, height: 40 }}>
				<Image
					src={icon}
					alt='icon'
					width={40}
					height={40}
					style={{ objectFit: 'contain' }}
				/>
				// </Avatar>
			)}
			<Typography
				variant='body1'
				align='justify'
			>
				{content}
			</Typography>
		</Stack>
	);
};

export default FeatureCard;
