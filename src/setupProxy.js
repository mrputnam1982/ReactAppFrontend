const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("Using proxy API:", process.env.PROXY_API);
  app.use(
    createProxyMiddleware("/api/", { target: process.env.PROXY_API || "http://localhost:8080" })
  );
};