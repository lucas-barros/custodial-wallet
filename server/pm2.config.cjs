module.exports = {
  apps: [
    {
      script: "./index.js",
      instances: "1",
      exec_mode: "cluster_mode",
    },
  ],
};
