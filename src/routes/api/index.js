const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const authApi = require('./auth');
const chatApi = require('./chat');
const followApi = require('./follow');
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

router.use('/chat', chatApi.routes());
router.use('/follow', followApi.routes());
router.use('/posts', postsApi.routes());
router.use('/users', usersApi.routes());
router.user('/reviews', reviewsApi.routes());
module.exports = router;
