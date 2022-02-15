const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  //console.log("Using proxy API:", process.env.PROXY_API);
  app.use(
    '/api/',
    createProxyMiddleware({ target: process.env.PROXY_API,
        changeOrigin: true,
    })

  );
  app.use(
    "/auth/register/",
    createProxyMiddleware({ target: process.env.PROXY_LOGIN,
        changeOrigin: true,
    })
  );
  app.use(
    "/auth/login/",
    createProxyMiddleware({ target: process.env.PROXY_LOGIN,
        changeOrigin: true,
    })
  );
};