class Game
	constructor: (@socket) ->
		@clients = []
		@numbers = @getNewNumbers()
		console.log "Numbers are:", @numbers
		@bindSocket()

	bindSocket: () ->
		@socket.on "connection", (client) =>
			@addClient client
			client.emit "numbers", 
				numbers: @numbers


	addClient: (client) ->
		@clients.push client

		client.on "solve", (data) =>
			if data.numbers? && data.numbers.sort?()
				if @doNumbersMatch data.numbers
					console.log "Numbers match!"
					@numbers = @getNewNumbers()
					client.broadcast.emit "lose", 
						numbers: @numbers
					client.emit "win",
						numbers: @numbers

		client.on "getNumbers", () =>
			client.emit "numbers"
				numbers: @numbers

	getNewNumbers: () ->
		numbers = "123456789".split ""
		selected = []

		count = 0
		while count < 4
			selected.push parseInt (numbers.splice Math.floor((Math.random() * (9 - count))), 1)[0]
			count++

		selected

	getCurrentNumbers: () ->
		@numbers

	doNumbersMatch: (test) ->
		console.log test, @numbers
		for num in test
			console.log "failed on ", num if @numbers.indexOf(num) == -1 && num != false
			return false if @numbers.indexOf(num) == -1 && num != false

		true

module.exports = Game