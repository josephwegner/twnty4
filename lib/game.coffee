class Game
	constructor: (@socket) ->
		@possiblePairs = require "./pairGenerator.coffee"
		@clients = {}
		@numbers = @getNewNumbers()
		console.log "Numbers are:", @numbers
		@bindSocket()

	bindSocket: () ->
		@socket.on "connection", (client) =>
			@addClient client


	addClient: (client) ->
		client.on "solve", (data) =>
			if data.numbers? && data.numbers.sort?
				if !@doNumbersMatch data.numbers
					client.emit "cheater", 
						messages: ["YOU ARE AN IDIOT", "HAHAHAHAHAHA"]
				else if !@doNumbersAddUp data.numbers, data.operations
					client.emit "cheater",
						messages: ["YOU SUCK AT MATH", "GTFO", "NO ONE WANTS YOU HERE"]
				else
					@numbers = @getNewNumbers()
					client.broadcast.emit "lose", 
						numbers: @numbers
					client.emit "win",
						numbers: @numbers

					@clients[client.id].score++
					@sendUserUpdates()

		client.on "disconnect", () =>
			delete @clients[client.id]
			@sendUserUpdates()


		client.on "register", (data) =>
			if !@clients[client.id]? && data.username?
				@clients[client.id] =
					username: data.username
					score: 0

			client.emit "numbers", 
				numbers: @numbers

			@sendUserUpdates()

		client.on "getNumbers", () =>
			client.emit "numbers" 
				numbers: @numbers

	sendUserUpdates: (client) ->
		console.log "sending clients", @clients
		cleanUserInfo = []
		for id, user of @clients
			cleanUserInfo.push 
				username:user.username
				score: user.score

		if client
			client.emit "users", 
				users: cleanUserInfo
		else
			@socket.sockets.emit "users",
				users: cleanUserInfo

	getNewNumbers: () ->
		@possiblePairs[Math.floor(Math.random() * @possiblePairs.length)]

	getCurrentNumbers: () ->
		@numbers

	doNumbersMatch: (test) ->
		scopedNumbers = @numbers.slice()
		scopedNumbers.sort()
		scopedTest = test.slice()
		scopedTest.sort()
		for num, index in scopedTest
			return false if scopedNumbers[index] != num

		true

	doNumbersAddUp: (numbers, operations) ->
		currentValue = numbers[0]

		for number, index in numbers[..-2]

			switch operations[index]
				when "add"
					currentValue += numbers[index + 1]

				when "subtract"
					currentValue -= numbers[index + 1]

				when "multiply"
					currentValue = currentValue * numbers[index + 1]

				when "divide"
					currentValue = currentValue / numbers[index + 1]

		return currentValue == 24;

module.exports = Game