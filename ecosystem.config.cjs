module.exports = {
	apps: [{
		name: "galitskiy",
		script: "./server/app.js",
		nodeArgs: "--env-file=.env --import jtsx-loader",
		watch: false,
		watch_delay: 1000,
    	ignore_watch : [".git", "node_modules", "public", "uploads"],
	}]
}

