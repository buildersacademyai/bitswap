const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        nodeCrypto: require.resolve('crypto-browserify'), // Add nodeCrypto explicitly
      };
    }
    return config;
  },
};

module.exports = nextConfig;
