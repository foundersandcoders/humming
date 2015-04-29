"use strict";

var test = require("tape");
var humming = require("..");
var hapi = require("hapi");
var createAdapter = require("russian-doll");

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

  var config = {
    index: "index",
    type: "members",
    host: "http://127.0.0.1",
    port: 9200
  };
  var db = createAdapter(config);

  test("humming should create create routes for each model", function (t) {

    //create
    server.inject({
      method: "POST",
      url: "/members",
      payload: {
        id: 1234,
        name: "wil",
        message: "yes"
      }
    }, function (res) {

      t.equals(res.statusCode, 200, "200 returned");

      // check db
      db.findOne({
        id: 1234
      }, function (e, r) {

        t.ok(r.found, "member created");
        t.end();
      });
    });
  });


  test("humming should create findOne routes for ecah model", function (t) {

    //findOne
    server.inject({
      method: "GET",
      url: "/members/1234"
    }, function (res) {

      t.equals(res.statusCode, 200, "200 returned");
      t.end();
    });
  });

  test("humming should create update routes for each model", function (t) {

    //update
    server.inject({
      method: "PUT",
      url: "/members/1234",
      payload: {
        name: "bes"
      }
    }, function (res) {

      t.equals(res.statusCode, 200, "200 returned");


      // check db
      db.findOne({
        id: 1234
      }, function (e, r) {

        t.ok(r.found, "member created");
        t.ok(r._source.name, "bes", "member update");
        t.end();
      });
    });
  });

  test("humming should create delete routes for each model", function (t) {


    //delete
    server.inject({
      method: "DELETE",
      url: "/members/1234"
    }, function (res) {

      t.equals(res.statusCode, 200, "200 returned");


      // check db
      db.findOne({
        id: 1234
      }, function (e, r) {


        t.notOk(r, "member deleted");
        t.ok(e, "error return");
        t.end();
      });
    });
  });
});
