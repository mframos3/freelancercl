const KoaRouter = require('koa-router');

const router = new KoaRouter();


router.get('api.offeringPosts.list', '/offeringPosts', async (ctx) => {
  const postList = await ctx.orm.offeringPost.findAll();
  ctx.body = ctx.jsonSerializer('post', {
    attributes: ['name', 'img', 'description', 'rating', 'category'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.offeringPosts.list')}`,
    },
    dataLinks: {
      self: (dataset, post) => `${ctx.origin}/offeringPosts/${post.id}`,
    },
  }).serialize(postList);
});

router.get('/searchingPosts', async (ctx) => {
  const postList = await ctx.orm.searchingPost.findAll();
  ctx.body = ctx.jsonSerializer('post', {
    attributes: ['name', 'img', 'description', 'rating', 'category'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.offeringPosts.list')}`,
    },
    dataLinks: {
      self: (dataset, post) => `${ctx.origin}/offeringPosts/${post.id}`,
    },
  }).serialize(postList);
});

module.exports = router;
