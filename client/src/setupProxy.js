const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = app => {
    app.use(
        ["/api", "/auth/bungie"],
        createProxyMiddleware({
            target: "http://localhost:5000"
        })
    );
};