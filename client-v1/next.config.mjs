/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	logging: {
		fetches: {
			fullUrl: true
		}
	},
	images: {
		remotePatterns: [
			{
				hostname: 'localhost'
			},
			{
				hostname: '*'
			},
			{
				hostname: 'https://steadfast-song-1cea7ca6da.strapiapp.com/'
			},
			{
				hostname: 'https://steadfast-song-1cea7ca6da.media.strapiapp.com/'
			}
		]
	}
};
// ['localhost', 'big-feast-12ba2aedbd.media.strapiapp.com', 'big-feast-12ba2aedbd.strapiapp.com/', '*']

export default nextConfig;
