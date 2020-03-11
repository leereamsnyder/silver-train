# Minimal case to reproduce an issue I'm seeing with newrelic 6.4.2 and koa-router

## What is this?

This is a minimal koa and koa-router server application.

Here's all of it:

```
var Koa = require("koa");
var Router = require("koa-router");

var app = new Koa();
var router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "Hi";
});

app.use(router.routes());

app.listen(5000, () => {
  console.log("listening at http://localhost:5000");
});
```

When I add newrelic@6.4.2 (`require('newrelic')` at the top of the file) and try to run this with node@12.16.1 (what you get as of today when you run `brew install node@12`), and then try to hit `http://localhost:5000`, I get a TypeError (removed user directories from the file paths):

```
TypeError: Cannot read property 'nameState' of null
    at Object.set (node_modules/@newrelic/koa/lib/instrumentation.js:94:12)
    at dispatch (node_modules/koa-router/lib/router.js:358:23)
    at wrapper (node_modules/newrelic/lib/shim/shim.js:931:24)
    at dispatch (node_modules/koa-compose/index.js:42:32)
    at node_modules/koa-compose/index.js:34:12
    at Application.handleRequest (node_modules/koa/lib/application.js:166:12)
    at Server.handleRequest (node_modules/koa/lib/application.js:148:19)
    at Server.emit (events.js:311:20)
    at Server.wrappedHandler (node_modules/newrelic/lib/instrumentation/core/http.js:51:35)
    at Server.wrapTransactionInvocation (node_modules/newrelic/lib/transaction/tracer/index.js:93:22)
```
