class Game
	constructor: (@socket) ->
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


		client.on "register", (data) =>
			if !@clients[client.id]? && data.username?
				@clients[client.id] =
					username: data.username
					score: 0

			client.emit "numbers", 
				numbers: @numbers

			@sendUserUpdates(client)

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

	doNumbersAddUp: (numbers, operations) ->
		console.log numbers, operations
		currentValue = false;

		for number, index in numbers[..-2]
			if numbers[index + 1] != false
				if currentValue == false
					currentValue = number

				switch operations[index]
					when "add"
						currentValue += numbers[index + 1]

					when "subtract"
						currentValue -= numbers[index + 1]

					when "multiply"
						currentValue = currentValue * numbers[index + 1]

					when "divide"
						currentValue = currentValue / numbers[index + 1]
				
			else if number != false && currentValue == false
				currentValue = number

		return currentValue == 24;

module.exports = Game