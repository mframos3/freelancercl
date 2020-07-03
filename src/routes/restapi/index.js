const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const authApi = require('./auth');
const postsApi = require('./posts');
const usersApi = require('./users');
const reviewsApi = require('./reviews');

const router = new KoaRouter();

router.use('/auth', authApi.routes());

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.state.authData.userId);
  }
  return next();
});

router.use('/posts', postsApi.routes());
router.use('/users', usersApi.routes());
router.use('/reviews', reviewsApi.routes());
module.exports = router;
