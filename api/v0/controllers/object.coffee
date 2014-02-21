ObjectController =
	options: {}
	routes:
		createObject:
			method: "POST"
			pieces: ["create"]
		getObject:
			method: "GET"
			pieces: ["*id"]
	actions:
		getObject: (req, res, params) ->
			Obj = mongoose.model "object"

			if params.id?
				Obj.getById params.id, (err, obj) ->
					if err
						console.log err
						res.statusCode = 500
						res.end()
					else if !obj.length
						res.statusCode = 404
						res.end()
					else
						res.end JSON.stringify obj[0]
			else
				res.statusCode = 404
				res.end()
		createObject: (req, res, params) ->
			data = ""

			req.on "data", (chunk) ->
				data += chunk

			req.on "end", (chunk) =>
				obj = JSON.parse data

				Obj = mongoose.model "object"

				Obj.createObject obj, (err, man) ->
					if(err)
						res.statusCode = 500
						res.end()
					else
						res.end JSON.stringify(obj)


	helpers: 
		helper : () ->
			console.log "I helped..."


module.exports = exports = ObjectController