#
# 	Start the Engines
#------------------------->

# Module dependencies.
global.configs = require "./configs.coffee"
global.http = require "http"
global.path = require "path"
global.url = require 'url'
global.fs = require 'fs'
coffee = require 'coffee-script'
global.querystring = require 'querystring'
io = require 'socket.io'

#Load our libraries
serveStatic = require "#{__dirname}/lib/staticFiles.coffee"
Game = require "#{__dirname}/lib/game.coffee"
Analytics = require "#{__dirname}/lib/analytics.coffee"
global.analytics = new Analytics configs.keen.projectId, configs.keen.writeKey

console.log "All Modules Loaded"
console.log "Building #{configs.name} Server in #{process.env.application_env} environment"

fs.readFile path.join(__dirname, "views", "index.html"), (err, layoutHTML) ->
	if err
		console.log "Error reading layout HTML"
		return false

	console.log "starting twnty4 with host #{configs.host} and port #{configs.port}"

	app = http.createServer (req, res) ->
		urlParts = url.parse req.url, yes
			
		#depends on Joe Wegner's node-session
		#req.$session = session.start res, req

		if urlParts.pathname.indexOf("/assets") is 0
			#Attempting to grab static assets.  Do that
			serveStatic req, res

		else if urlParts.pathname == "/favicon.ico"
			fs.readFile path.join(__dirname, "public", "favicon.ico"), (err, favicon) ->
				if err
					res.statusCode = 404
					res.end()

				else
					res.end favicon

		else
			#Default, serve layout
			res.end layoutHTML, 'utf8'

	app.listen configs.port, configs.host

	socket = io.listen app
	game = new Game socket

	console.log "App listening on #{configs.url}"



