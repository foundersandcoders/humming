"use strict";

var test = require("tape");
var hapi = require("hapi");
var createAdapter = require("russian-doll");
var request = require("request");

var server = new hapi.Server();
server.connection({ port: 7777 });

server.register({
	register: require(".."),
	options: {
		modelsPath: "../test/models",
		adapter: createAdapter,
		adapterOpts: {
			index: "index",
			host: "http://127.0.0.1",
			port: 9200
		}
	}
}, function () {

	test("humming should create a create routes for members", function (t) {

		// create
		server.inject({
			method: "POST",
			url: "/members",
			payload: {
				id: 1234,
				name: "wil",
				message: "yes"
			}
		}, function (res) {

			res.payload = JSON.parse(res.payload);

			t.equals(res.statusCode, 200, "200 returned");
			t.equals(res.payload.id, "1234", "created object returned");
			t.end();
		});
	});

	test("humming should create a create routes for articles", function (t) {

		// create
		server.inject({
			method: "POST",
			url: "/articles",
			payload: {
				id: 1234,
				name: "wil",
				message: "yes"
			}
		}, function (res) {

			res.payload = JSON.parse(res.payload);

			t.equals(res.statusCode, 200, "200 returned");
			t.equals(res.payload.id, "1234", "created object returned");
			t.end();
		});
	});

	test("humming should create a find routes for each model", function (t) {

		setTimeout(function (){

			server.inject({
				method: "GET",
				url: "/members?name=wil"
			}, function (res) {

				res.payload = JSON.parse(res.payload);

				t.equals(res.statusCode, 200, "200 returned");
				t.equals(res.payload[0].id, "1234", "created object returned");
				t.end();
			});
		}, 1000);
	});

	test("humming should create findOne routes for ecah model", function (t) {

		// findOne
		server.inject({
			method: "GET",
			url: "/members/1234"
		}, function (res) {

			res.payload = JSON.parse(res.payload);

			t.equals(res.statusCode, 200, "200 returned");
			t.equals(res.payload.id, "1234", "created object returned");
			t.end();
		});
	});

	test("humming should create update routes for each model", function (t) {

		// update
		server.inject({
			method: "PUT",
			url: "/members/1234",
			payload: {
				name: "bes"
			}
		}, function (res) {

			res.payload = JSON.parse(res.payload);

			t.equals(res.statusCode, 200, "200 returned");
			t.equals(res.payload.name, "bes", "updated object returned");
			t.end();

		});
	});

	test("humming should create delete routes for each model", function (t) {

		// delete
		server.inject({
			method: "DELETE",
			url: "/members/1234"
		}, function (res) {

			res.payload = JSON.parse(res.payload);

			t.equals(res.statusCode, 200, "200 returned");
			t.equals(res.payload.id, "1234", "right item returned");
			t.end();
		});
	});

	test("NOT A TEST wipe db", function (t) {

		var opts = {
			method: "DELETE",
			uri: "http://127.0.0.1:9200/index/articles/"
		};
		request(opts, function () {

			t.end();
		});
	});
});