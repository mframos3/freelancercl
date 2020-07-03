const KoaRouter = require('koa-router');

const router = new KoaRouter();


router.get('api.offeringPosts.list', '/offeringPosts', async (ctx) => {
  const auxPostList = await ctx.orm.offeringPost.findAll();
  const promisesPostList = auxPostList.map(async (element) => {
    const newElement = element;
    const aux1 = await newElement.getReviews();
    const aux2 = await newElement.getApplications();
    newElement.reviewsCount = aux1.length;
    newElement.applicationsCount = aux2.length;
    return newElement;
  });
  const postList = await Promise.all(promisesPostList);
  ctx.body = ctx.jsonSerializer('offeringPost', {
    attributes: ['name', 'img', 'description', 'rating', 'category', 'price', 'reviewsCount', 'applicationsCount'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.offeringPosts.list')}`,
    },
    dataLinks: {
      self: (dataset, post) => `${ctx.origin}/offeringPosts/${post.id}`,
    },
  }).serialize(postList);
});

router.get('api.searchingPosts.list', '/searchingPosts', async (ctx) => {
  const postList = await ctx.orm.searchingPost.findAll();
  ctx.body = ctx.jsonSerializer('searchingPost', {
    attributes: ['name', 'img', 'description', 'category'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.searchingPosts.list')}`,
    },
    dataLinks: {
      self: (dataset, post) => `${ctx.origin}/searchingPosts/${post.id}`,
    },
  }).serialize(postList);
});

module.exports = router;
