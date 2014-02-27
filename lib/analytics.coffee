keen = require "keen.io"

class Analytics
	constructor: (project_id, write_key) ->
		@doTrack = false

		if project_id && write_key
			@keen = keen.configure
				projectId: project_id
				writeKey: write_key

			@doTrack = true

	track: (event, values, cb) ->

		if @doTrack
			@keen.addEvent event, values, cb
		else
			cb?("Analytics not set to track")


module.exports = Analytics;