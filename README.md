# marble-run
hapi plugin to generate CRUD routes for all models in a folder

## use
```js

var hapi = require("hapi");
var server = hapi.createServer();

server.connections({ port: 8000 });

server.register({
    register: require("marble-run"),
    options: {
        modelsPath: "/models",
        adapter: require("russian-doll")
    }

}, function (e) {

   server.start();
});
```

## api

marble-run is registered using hapi's ```server.register();``` method.

You may pass a ```modelsPath``` option to point marble-run at where to find your models.

You _must_ pass an ```adapter``` option. The adapter must contain a function that takes a ```database``` and a ```collection``` parameter and returns an object with a ```.create```, ```.update```, ```.delete```, and ```.findOne``` method.

## license

MIT
