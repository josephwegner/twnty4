objectSchema = mongoose.Schema
	created: {type: Number, default: Date.now}


objectSchema.static "getById", (id, cb) ->
	this.find { '_id': id }, (err, doc) ->
		if err
			console.log "Error getting man by id"
			cb?(err)
			return true
		else
			cb?(null, doc)
			return false

	return true

objectSchema.static 'create', (obj, cb) ->
	newObject = new Men obj

	newObject.save cb

Obj = mongoose.model 'object', objectSchema

module.exports = exports = Obj
