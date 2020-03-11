// uncomment this line and everything is A-OK
// with it active in node 12.16.1, you get a TypeError: Cannot read property 'nameState' of null error
require("newrelic");

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
