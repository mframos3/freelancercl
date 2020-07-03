const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.users.list', '/', async (ctx) => {
  const userList = await ctx.orm.user.findAll();
  ctx.body = ctx.jsonSerializer('user', {
    attributes: ['name', 'rating', 'occupation', 'cFollowers', 'cFollowed'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.user.list')}`,
    },
    dataLinks: {
      self: (dataset, user) => `${ctx.origin}/user/${user.id}`,
    },
  }).serialize(userList);
});

module.exports = router;
