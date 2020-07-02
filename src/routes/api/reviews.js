const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.reviews.list', '/', async (ctx) => {
  const reviewList = await ctx.orm.review.findAll();
  ctx.body = ctx.jsonSerializer('review', {
    attributes: ['id_post', 'id_worker', 'rating', 'comment'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.reviews.list')}`,
    },
    dataLinks: {
      self: (dataset, review) => `${ctx.origin}/reviews/${review.id}`,
    },
  }).serialize(reviewList);
});

module.exports = router;
