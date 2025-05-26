import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import path from 'path';

// Register the custom font
registerFont(path.resolve('./public/fonts/Arial.ttf'), { family: 'Arial' });

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	// Extract query parameters and clean the address
	const name = searchParams.get('name') || 'Unknown Name';
	const itemName = searchParams.get('itemName') || 'Unknown Item';
	const address = (searchParams.get('address') || 'Unknown Address').replace(/['"]/g, '');

	try {
		// Create a canvas with doubled dimensions
		const width = 2000; // doubled from 1200
		const height = 1000; // doubled from 630
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);

		const qrCodeBuffer = await QRCode.toBuffer(process.env.NEXT_PUBLIC_APP_URL as string);
		const qrImage = await loadImage(qrCodeBuffer);
		ctx.drawImage(qrImage, width - 800, height / 2 - 400, 700, 700);
		ctx.fillStyle = '#000';
		ctx.font = '900 73px Arial';
		ctx.textAlign = 'left';

		const letterSpacing = 4;

		// Enhanced helper function to create bolder text effect
		const drawTextWithSpacing = (text: string, x: number, y: number) => {
			let currentX = x;
			for (const char of text) {
				// Draw the character multiple times with tiny offsets to create bolder effect
				ctx.fillText(char, currentX, y);
				ctx.fillText(char, currentX + 0.5, y);
				ctx.fillText(char, currentX, y + 0.5);
				ctx.fillText(char, currentX + 0.5, y + 0.5);

				const metrics = ctx.measureText(char);
				currentX += metrics.width + letterSpacing;
			}
		};

		// Draw name
		drawTextWithSpacing(name, 100, 200);

		// Handle item name wrapping similar to address
		const itemMaxWidth = width - 900;
		const itemWords = itemName.split(' ');
		let itemLine = '';
		let itemY = 400;
		const itemLineHeight = 120;

		for (let i = 0; i < itemWords.length; i++) {
			const testLine = itemLine + itemWords[i] + ' ';
			const metrics = ctx.measureText(testLine);

			if (metrics.width > itemMaxWidth && i > 0) {
				drawTextWithSpacing(itemLine.trim(), 100, itemY);
				itemLine = itemWords[i] + ' ';
				itemY += itemLineHeight;
			} else {
				itemLine = testLine;
			}
		}
		drawTextWithSpacing(itemLine.trim(), 100, itemY);

		// Handle address wrapping without quotation marks
		const maxWidth = width - 900;
		const words = address.split(' ');
		let line = '';
		let y = itemY + 180; // Changed from 120 to 180 to increase spacing between item and address
		const lineHeight = 120;

		for (let i = 0; i < words.length; i++) {
			const testLine = line + words[i] + ' ';
			const metrics = ctx.measureText(testLine);

			if (metrics.width > maxWidth && i > 0) {
				drawTextWithSpacing(line.trim(), 100, y);
				line = words[i] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		drawTextWithSpacing(line.trim(), 100, y);

		// Output as PNG
		const buffer = canvas.toBuffer('image/png');
		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	} catch (error) {
		console.error('Error generating image:', error);
		return new Response('Error generating image', { status: 500 });
	}
}
