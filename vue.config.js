const path = require('path');
function resolve (dir) {
	return path.join(__dirname, dir)
}
module.exports = {	
	devServer: {
		proxy: {
			'/': {
				target: 'http://erpcs.92nu.com',
				ws: true,
				changOlrigin: true
			}
		},
		host:"127.0.0.1",  
	},
	// assetsDir: "web",
	// publicPath:'../',
	chainWebpack: (config)=>{
		config.resolve.alias
		.set('vendor',resolve('./src/vendor'))
	},
	configureWebpack: {
		devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
	}
}