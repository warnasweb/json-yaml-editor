import path from "node:path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactCompiler: true,
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["inline-style-prefixer/static"] = path.resolve(
      process.cwd(),
      "src/lib/prefixAll.ts",
    );
    return config;
  },
};

export default nextConfig;
