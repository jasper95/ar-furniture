/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable experimental features for WebXR support
  experimental: {
    esmExternals: "loose",
  },
  // Configure webpack to handle glTF/GLB files
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/images",
          outputPath: "static/images",
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
