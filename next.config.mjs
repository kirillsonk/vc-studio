const standalone = process.env.NEXT_STANDALONE === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: standalone ? "standalone" : "export",
  pageExtensions: standalone ? ["node.ts", "tsx", "ts"] : ["tsx", "ts"],
  trailingSlash: true,
  ...(standalone ? {
    async redirects() {
      return [{
        source: "/:path*",
        has: [{ type: "host", value: "www.sborkadigital.ru" }],
        destination: "https://sborkadigital.ru/:path*",
        permanent: true,
      }];
    },
  } : {}),
};

export default nextConfig;
