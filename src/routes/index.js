const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const Sequelize = require('sequelize');
const { Op } = Sequelize;

const router = new KoaRouter();

router.get('index.landing', '/', async (ctx) => {
  const isUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  let offeringPostsList = [];
  let searchingPostsList = [];
  if (isUser) {
    offeringPostsList = await ctx.orm.offeringPost.findAll({ where: { userId: { [Op.eq]: isUser.id } } });
    searchingPostsList = await ctx.orm.searchingPost.findAll({ where: { userId: { [Op.eq]: isUser.id } } });
  }
  const bestUsers = await ctx.orm.user.findAll({ where: { rating: { [Op.gte]: 4 } }, order: [['rating', 'DESC']] });
  //Para popUp
  const user = ctx.orm.user.build();
  const searchingPost = ctx.orm.searchingPost.build(ctx.request.body);
  const offeringPost = ctx.orm.offeringPost.build(ctx.request.body);
  await ctx.render('index', {
    appVersion: pkg.version,
    offeringPostsList,
    searchingPostsList,
    bestUsers,
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    createSessionPath: ctx.router.url('session.create'),
    newRegisterPath: ctx.router.url('users.new'),
    notice: ctx.flashMessage.notice,
    submitUserPath: ctx.router.url('users.create'),
    //Para popUp
    user,
    searchingPost,
    offeringPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
    submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
    backPath: ctx.router.url('searchingPosts.list'),
  });
});

module.exports = router;
