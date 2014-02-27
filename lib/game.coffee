class Game
	constructor: (@socket = false) ->
		@possiblePairs = require "./pairGenerator.coffee"
		@clients = {}
		@newGame(false)
		console.log "Numbers are:", @numbers
		@bindSocket() if @socket

	bindSocket: () ->
		@socket.on "connection", (client) =>
			@addClient client


	addClient: (client) ->
		client.on "solve", (data) =>
			@solve client, data


		client.on "disconnect", () =>
			if @clients[client.id]
				analytics.track "disconnect",
					user_id: client.id
					duration: Date.now() - @clients[client.id].start_time
					start_time: @clients[client.id].start_time
					score: @clients[client.id].score
					user_count: Object.keys(@clients).length

				delete @clients[client.id]
				@sendUserUpdates()


		client.on "register", (data) =>
			@register client, data

	register: (client, data) ->
		if !@clients[client.id]? && data.username?
				@clients[client.id] =
					username: data.username
					score: 0
					start_time: Date.now()

				analytics.track "register", 
					username: data.username
					id: client.id
					user_count: Object.keys(@clients).length

			client.emit "numbers", 
				numbers: @numbers

			@sendUserUpdates()

		client.on "getNumbers", () =>
			client.emit "numbers", 
				numbers: @numbers

	solve: (client, data) ->
		if data.numbers? && data.operations? && data.operations.sort? && data.numbers.sort?
			if !@doNumbersMatch data.numbers
				client.emit "cheater", 
					messages: ["YOU ARE AN IDIOT", "HAHAHAHAHAHA"]
					analytics.track "cheat",
						user_id: client.id
						type: "incorrect numbers"
			else if !@doNumbersAddUp data.numbers, data.operations
				client.emit "cheater",
					messages: ["YOU SUCK AT MATH", "GTFO", "NO ONE WANTS YOU HERE"]
					analytics.track "cheat",
						user_id: client.id
						type: "incorrect operations"
			else
				analytics.track "win",
					numbers: data.numbers,
					operations: data.operations,
					gameDuration: Date.now() - @gameStart
					gameStart: @gameStart
					user_id: client.id
					user_score: @clients[client.id].score
					user_count: Object.keys(@clients).length

				@newGame(false)
				client.broadcast.emit "lose", 
					numbers: @numbers
				client.emit "win",
					numbers: @numbers

				@clients[client.id].score++
				@sendUserUpdates()

	newGame: (send = true) ->
		@numbers = @getNewNumbers()
		@gameStart = Date.now()


		if typeof(@timeout) != "undefined"
			clearTimeout @timeout

		@timeout = setTimeout () =>
			analytics.track "timeout",
				numbers: @numbers
				user_count: Object.keys(@clients).length

			@newGame()
		, 120000

		if send
			@socket.sockets.emit "numbers",
				numbers: @numbers
				message: "Too slow!"

	sendUserUpdates: (client) ->
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