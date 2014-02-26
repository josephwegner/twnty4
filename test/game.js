//Necessary Libs
require("coffee-script/register")

//Mocha Setup
var assert = require('assert');
var sinon = require("sinon");

//What we're testing
var Game = require("../lib/game.coffee");

describe("Game", function() {
	var game;

	beforeEach(function() {
		game = new Game();
	});

	describe("initialization", function() {
		it("should set some initial numbers", function() {
			assert.equal(game.numbers.length, 4);
		});
	});

	describe("adding clients", function() {
		var client = {
			on: sinon.spy(),
			emit: sinon.spy(),
			id: 1234
		};

		beforeEach(function() {
			client.on.reset();
			client.emit.reset();
		})

		it("should bind to all kinds of events", function() {
			game.addClient(client);

			assert(client.on.calledThrice, "not enough events bound");
			assert(client.on.firstCall.calledWith("solve"), "solve event not bound");
			assert(client.on.secondCall.calledWith("disconnect"), "disconnect event not bound");
			assert(client.on.thirdCall.calledWith("register"), "register event not bound");
		});

		it("should add clients to the client list", function() {
			sinon.stub(game, "sendUserUpdates");

			game.register(client, {
				username: "testuser"
			});

			assert.equal(Object.keys(game.clients).length, 1);
			assert.equal(game.clients[client.id].username, "testuser");
			assert.equal(game.clients[client.id].score, 0);


			assert(client.emit.calledOnce);
			assert(client.emit.calledWith("numbers", {
				numbers: game.numbers
			}));

			assert(game.sendUserUpdates.calledOnce);

			assert(client.on.calledOnce);
			assert(client.on.calledWith("getNumbers"));

			game.sendUserUpdates.restore();
		})
	});

	describe("management", function() {
		it("should start new games", function() {
			var previousNumbers = game.numbers.slice();
			game.newGame(false);
			assert.notEqual(game.numbers.join(), previousNumbers.join());
		});

		it("should return the correct numbers", function() {
			assert.equal(game.numbers, game.getCurrentNumbers());
			game.newGame(false);
			assert.equal(game.numbers, game.getCurrentNumbers());
		});

		it("should get new numbers every time", function() {
			var initialNumbers = game.numbers;
			assert.notEqual(initialNumbers.join(), game.getNewNumbers().join());
			initialNumbers = game.getNewNumbers();
			assert.notEqual(initialNumbers.join(), game.getNewNumbers().join());
		});
	});

	describe("communication", function() {
		var client = {
			on: sinon.spy(),
			emit: sinon.spy(),
			id: 1234
		};

		beforeEach(function() {
			client.on.reset();
			client.emit.reset();
		})

		it("should only send clean user info", function() {
			
			//Stub out sendUserUpdates, because we can't send to the whole socket in mocha
			sinon.stub(game, "sendUserUpdates");

			game.register(client, {
				username: "testuser"
			});

			//Unstub so we can test
			game.sendUserUpdates.restore();
			client.emit.reset();

			game.sendUserUpdates(client);

			assert(client.emit.calledOnce);
			assert(client.emit.calledWith("users", {
				users: [
					{
						username: "testuser",
						score: 0
					}
				]
			}));

		});
	});

	describe("solving", function() {
		var client = {
			on: sinon.spy(),
			emit: sinon.spy(),
			broadcast: {
				emit: sinon.spy()
			},
			id: 1234
		};

		beforeEach(function() {
			client.on.reset();
			client.emit.reset();
		})

		it("should block cheaters", function() {
			//First test the check that the numbers match
			game.numbers = [1, 1, 1, 1];
			game.solve(client, {
				numbers: [6, 6, 6, 6],
				operations: ["add", "add", "add"]
			});

			game.newGame(false)
			assert(client.emit.calledOnce);
			assert(client.emit.calledWith("cheater"));
			client.emit.reset();

			//We know that no set of numbers will equal 24 just by adding, so those operations should fail
			game.solve(client, {
				numbers: game.numbers,
				operations: ["add", "add", "add"]
			})

			assert(client.emit.calledOnce);
			assert(client.emit.calledWith("cheater"));
		});

		it("should calculate the numbers against 24", function() {
			assert(!game.doNumbersAddUp(
				[8, 5, 1, 6],
				["subtract", "add", "add"]
			));

			assert(game.doNumbersAddUp(
				[8, 5, 1, 6],
				["subtract", "add", "multiply"]
			));
		});

		it("should test matching", function() {
			game.numbers = [8, 5, 1, 6];
			assert(!game.doNumbersMatch([1, 2, 4, 5]));
			assert(game.doNumbersMatch([8, 5, 1, 6]));
			assert(game.doNumbersMatch([6, 8, 1, 5]));
		});

		it("should solve", function() {
			sinon.stub(game, "sendUserUpdates")

			game.register(client, {
				username: "testuser"
			});

			client.emit.reset();
			game.sendUserUpdates.reset();

			game.numbers = [6, 8, 1, 5];
			game.solve(client, {
				numbers: [8, 5, 1, 6],
				operations: ["subtract", "add", "multiply"]
			});

			assert(client.broadcast.emit.calledOnce);
			assert(client.broadcast.emit.calledWith("lose"));

			assert(client.emit.calledOnce);
			assert(client.emit.calledWith("win"));

			assert.equal(game.clients[client.id].score, 1);
		});
	})
});