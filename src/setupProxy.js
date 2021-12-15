const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/", { target: process.env.PROXY_API || "http://localhost:8080" })
  );
};