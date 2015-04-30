"use strict";

exports.register = humming;
exports.register.attributes = {
	pkg: require("../package.json")
};

var fs = require("fs");
var path = require("path");
var haybale = require("haybale");
var asbestos = require("asbestos");
var rhiz = require("rhiz");
var is = require("torf");
var clean = require("d-bap");

function humming (server, opts, next) {

	if (is.ok(opts.adapterOpts) && !is.ok(opts.adapterOpts.index)) {
		return next("adapterOpts.index required");
	}

	if (is.ok(opts.adapterOpts) && (!is.ok(opts.adapterOpts.host) || !is.ok(opts.adapterOpts.port))) {
		return next("adapterOpts.host and .port are required");
	}

	var modelsPath = path.join(__dirname, opts.modelsPath || "/models");

	fs.readdir(modelsPath, function (err, modelNames) {

		if (err) {
			return next("directory not found");
		}

		modelNames.forEach(function (name) {

			//import model
			var model = require(path.join(modelsPath, name));
			name = name.split(".")[0];

			//create adapter
			opts.adapterOpts.type = name;
			var adapter = opts.adapter(opts.adapterOpts);

			//decorate model with adapter methods
			haybale(model, adapter);

			//generate handlers from decorated model
			var handlers = asbestos(model);

			//create config
			var config = {};
			config.auth = model.auth;
			config.validate = model.validate;

			// remove null properties
			config = clean.object(config);

			// create routes
			var routes;
			if (is.ok(config)) {
				routes = rhiz(handlers, config, name);
			} else {
				routes = rhiz(handlers, name);
			}

			server.route(routes);
		});

		return next();
	});
}