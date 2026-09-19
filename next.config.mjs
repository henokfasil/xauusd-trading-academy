/** @type {import('next').NextConfig} */
const isPages = process.env.PAGES === "true";
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(isPages
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
