"use strict";

var test = require("tape");
var hapi = require("hapi");
var createAdapter = require("russian-doll");

test("If no index should return an error", function (t){

	var server = new hapi.Server();
	server.connection({ port: 6666});

	server.register({
		register: require(".."),
		options: {
			modelsPath: "../test/models",
			adapter: createAdapter,
			adapterOpts: {
				host: "http://127.0.0.1",
				port: 9200
			}
		}
	}, function (err) {

		t.equals(err, "adapterOpts.index required", "error message returned");
		t.end();
	});
});

test("If no host should return an error", function (t){

	var server = new hapi.Server();
	server.connection({ port: 5555});

	server.register({
		register: require(".."),
		options: {
			adapter: createAdapter,
			adapterOpts: {
				index: "index",
				port: 9200
			}
		}
	}, function (err) {

		t.equals(err, "adapterOpts.host and .port are required", "error message returned");
		t.end();
	});
});

test("If no wrong directory should return an error", function (t){

	var server = new hapi.Server();
	server.connection({ port: 5555});

	server.register({
		register: require(".."),
		options: {
			modelsPath: "../test/fohnokjdsahf",
			adapter: createAdapter,
			adapterOpts: {
				index: "index",
				host: "http://127.0.0.1",
				port: 9200
			}
		}
	}, function (err) {

		t.equals(err, "directory not found", "error message returned");
		t.end();
	});
});

test("If no wrong directory should return an error", function (t){

	var server = new hapi.Server();
	server.connection({ port: 4444});

	server.register({
		register: require(".."),
		options: {
			adapter: createAdapter,
			adapterOpts: {
				index: "index",
				host: "http://127.0.0.1",
				port: 9200
			}
		}
	}, function (err) {

		t.equals(err, "directory not found");
		t.end();
	});
});