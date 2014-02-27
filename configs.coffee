# If no env, set to dev
if not process.env?.application_env
	process.env.application_env = "local"

configs = {
	name: "Twnty4"
}


switch process.env.application_env
	when "local"
		configs.host = "localhost"
		configs.port = "3333"
		configs.url = "http://localhost:3333"
		configs.cache = false
		configs.keen = 
			projectId: process.env.KEEN_PROJECT
			writeKey: process.env.KEEN_WRITE_KEY

	when "production"
		configs.cache = true
		configs.port = process.env.PORT or 3333
		configs.url = "http://twnty4.wegnerdesign.com"
		configs.host = null
		configs.keen = 
			projectId: process.env.KEEN_PROJECT
			writeKey: process.env.KEEN_WRITE_KEY

module.exports = exports = configs
