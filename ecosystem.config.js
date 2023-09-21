module.exports = {
  apps: [
    {
      name: "user-service-write",
      script: "./build",
      instances: 1,
      autoRestart: true,
    },
  ],
};
