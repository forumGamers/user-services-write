module.exports = {
  apps: [
    {
      name: "user-service-write",
      script: "./build/bin/www.js",
      instances: 1,
      autoRestart: true,
    },
  ],
};
