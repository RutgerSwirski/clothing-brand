import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // we need to allow images from pexels.com for the lookbook images
  images: {
    domains: [
      "images.pexels.com",
      "images.unsplash.com",
      "cdn.shopify.com",
      "loremflickr.com",
      "picsum.photos",
    ],
  },
};

export default nextConfig;
