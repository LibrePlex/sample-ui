/** @type {import('next').NextConfig} */

// const withPWA = require("next-pwa");
const p = require("path");

const withTM = require("next-transpile-modules")(["@libreplex/shared-ui"]);

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("_http_common");
    }

    config.plugins = config.plugins || [];
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        child_process: false
      },
      alias: {
        ...config.resolve.alias,
        /// this is needed to prevent gazillion copies of bn.js turning up
        /// via separate transitive dependencies!
        "bn.js": p.join(
          process.cwd(),
          "../node_modules/bn.js/lib/bn.js"
        ),
        "nacl-fast.js": p.join(
          process.cwd(),
          "../../node_modules/tweetnacl/nacl-fast.js"
        ),
      },
    };

    return config;
  },
}

module.exports = withTM(nextConfig)
