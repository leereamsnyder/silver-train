# Minimal case to reproduce an issue I'm seeing with newrelic 6.4.2 and koa-router

## [UPDATE] what fixes this?

So with newrelic v4 and v5, you could run a server application with newrelic without a license key (for example, while developing). You'd see _an_ error from Newrelic on startup…

```
Error: Not starting without license key!
    at onNextTick (node_modules/newrelic/lib/agent.js:227:16)
    at processTicksAndRejections (internal/process/task_queues.js:79:11)
```

… but your app would otherwise work normally.

With newrelic v6, it appears that has changed: if you don't provide a license key, lots of things now don't work.

I fixed it for my application by requiring newrelic ONLY when you know you'll have the license key available (for example, `if (process.env.NODE_ENV === 'production') { require('newrelic') }`). YMMV.

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

## Environment

- node v12.16.1
- newrelic v6.4.2 (can reproduce with any ~6.0 version)
- koa 2.11.0 (have also seen the same error with v2.8.1)
- koa-router 8.0.8 (have also seen the same error with v7.4.0)
