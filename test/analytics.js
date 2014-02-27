//Necessary Libs
require("coffee-script/register")

//Mocha Setup
var assert = require('assert');
var sinon = require("sinon");

//What we're testing
var Analytics = require("../lib/analytics.coffee");

describe("Analytics", function() {
	describe("initialization", function() {
		it("should initialize with no API keys", function() {
			var analytics = new Analytics();

			assert(!analytics.doTrack);
			assert.equal(typeof(analytics.keen), "undefined");

			analytics.keen = {
				addEvent: sinon.spy()
			}

			analytics.track("test", {});

			assert(!analytics.keen.called);
		});

		it("should initialize with write keys", function() {
			var analytics = new Analytics("test_project_id", "test_write_key");

			assert(analytics.doTrack);
			assert(analytics.keen);
			assert.equal(typeof(analytics.keen.addEvent), "function");

			sinon.stub(analytics.keen, "addEvent");

			analytics.track("test", {});

			assert(analytics.keen.addEvent.calledOnce);
			assert(analytics.keen.addEvent.calledWith("test", {}));
		});
	});
});