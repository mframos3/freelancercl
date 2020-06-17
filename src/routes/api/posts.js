const KoaRouter = require('koa-router');

const router = new KoaRouter();


router.get('/offeringPosts', async (ctx) => {
  const postList = await ctx.orm.offeringPost.findAll();
  ctx.body = {
    status: 'success',
    data: postList,
  };
});

router.get('/searchingPosts', async (ctx) => {
  const postList = await ctx.orm.searchingPost.findAll();
  ctx.body = {
    status: 'success',
    data: postList,
  };
});

module.exports = router;
