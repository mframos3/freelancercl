const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const Sequelize = require('sequelize');
const { Op } = Sequelize;

const router = new KoaRouter();

router.get('index.landing', '/', async (ctx) => {
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const isUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  let offeringPostsList = [];
  let searchingPostsList = [];
  if (isUser) {
    offeringPostsList = await ctx.orm.offeringPost.findAll({ where: { userId: { [Op.eq]: isUser.id } } });
    searchingPostsList = await ctx.orm.searchingPost.findAll({ where: { userId: { [Op.eq]: isUser.id } } });
  }
  const bestUsers = await ctx.orm.user.findAll({ where: { rating: { [Op.gte]: 4 } }, order: [['rating', 'DESC']] });
  const bestOfferingPosts = await ctx.orm.offeringPost.findAll({ where: { rating: { [Op.gte]: 4 } }, order: [['rating', 'DESC']] });
  const following = await ctx.orm.follow.findAll({
    where: { followerId: { [Op.eq]: currentUser.id } } });
  const followingIds = following.map(function(x) {
       return x.followedId;
    });
  console.log(followingIds);
  const offeringPostsFollowing = await ctx.orm.offeringPost.findAll({ where: { userId: { [Op.in]: followingIds } } });
  const searchingPostsFollowing = await ctx.orm.searchingPost.findAll({ where: { userId: { [Op.in]: followingIds } } });
  const showOfferingPostPath = (offeringPost) => ctx.router.url('offeringPosts.show', { pid: offeringPost.id });
  const showSearchingPostPath = (searchingPost) => ctx.router.url('searchingPosts.show', { id: searchingPost.id });

  //Para popUp
  const user = ctx.orm.user.build();
  const searchingPost = ctx.orm.searchingPost.build(ctx.request.body);
  const offeringPost = ctx.orm.offeringPost.build(ctx.request.body);
  const passwordError = '';
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
    //
    passwordError,
    bestOfferingPosts,
    offeringPostsFollowing,
    searchingPostsFollowing,
    showOfferingPostPath,
    showSearchingPostPath,
  });
});

module.exports = router;
