const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const Sequelize = require('sequelize');
const { Op } = Sequelize;

const router = new KoaRouter();

router.get('index.landing', '/', async (ctx) => {
  const user = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  let offeringPostsList = [];
  let searchingPostsList = [];
  if (user) {
    offeringPostsList = await ctx.orm.offeringPost.findAll({ where: { userId: { [Op.eq]: user.id } } });
    searchingPostsList = await ctx.orm.searchingPost.findAll({ where: { userId: { [Op.eq]: user.id } } });
  }
  const bestUsers = await ctx.orm.user.findAll({ where: { rating: { [Op.gte]: 4 } } });
  await ctx.render('index', {
    appVersion: pkg.version,
    offeringPostsList,
    searchingPostsList,
    bestUsers,
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
  });
});

module.exports = router;
