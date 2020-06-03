const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('messages.list', '/', async (ctx) => {
  await ctx.render('messages/index', {

    backPath: ctx.router.url('index.landing'),

  });
});

module.exports = router;
