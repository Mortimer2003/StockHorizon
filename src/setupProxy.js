const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
	app.use(createProxyMiddleware('/api',
		{
			// target: "http://localhost:8092/",
			// target: "https://contri.build/",
			target: "https://buidlers.community/",
			changeOrigin: true,
			pathRewrite: {
				"^/api": "/api"
			},
		}))
	app.use(createProxyMiddleware('/dudu',
		{
			// target: "http://localhost:3060/",
			target: "https://dudu.contri.build/",
			changeOrigin: true,
			pathRewrite: {
				"^/dudu": "/dudu"
			},
		}))
	app.use(createProxyMiddleware('/tokenURI',
		{
			// target: "http://localhost:3060/",
			target: "https://dudulab.io/",
			changeOrigin: true,
			pathRewrite: {
				"^/tokenURI": "/tokenURI"
			},
		}))
}
