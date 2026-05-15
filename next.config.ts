import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // Old Wix/Shopify-style URLs → new site equivalents
      { source: "/all-products", destination: "/shop", permanent: true },
      { source: "/featured-products", destination: "/shop", permanent: true },
      { source: "/compare", destination: "/shop", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/#contact", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/collections/all", destination: "/shop", permanent: true },
      { source: "/collections/:slug", destination: "/shop", permanent: true },
      // Old product URL patterns
      { source: "/product-page/:slug", destination: "/shop", permanent: true },
      { source: "/products/:slug", destination: "/shop", permanent: true },
      { source: "/store/:slug*", destination: "/shop", permanent: true },
      // Old blog
      { source: "/blog-post/:slug*", destination: "/blog", permanent: true },
      { source: "/news/:slug*", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
