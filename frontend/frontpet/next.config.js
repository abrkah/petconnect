/** @type {import('next').NextConfig} */
const remotePatterns = [
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (apiUrl) {
  try {
    const { hostname, protocol } = new URL(apiUrl);
    if (hostname && protocol.startsWith("http")) {
      remotePatterns.push({
        protocol: protocol.replace(":", ""),
        hostname,
        pathname: "/**",
      });
    }
  } catch {
    /* ignore invalid URL at build time */
  }
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
