const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const offeringPosts = require('./routes/offeringPosts');
const reports = require('./routes/reports');
const searchingPosts = require('./routes/searchingPosts');
const users = require('./routes/users');
const messages = require('./routes/messages');
const searchResults = require('./routes/searchResults');
const session = require('./routes/session');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId)),
    newSessionPath: ctx.router.url('session.new'),
    newRegisterPath: ctx.router.url('users.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    messagesPath: ctx.router.url('messages.list'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/offeringPosts', offeringPosts.routes());
router.use('/reports', reports.routes());
router.use('/searchingPosts', searchingPosts.routes());
router.use('/users', users.routes());
router.use('/messages', messages.routes());
router.use('/searchResults', searchResults.routes());
router.use('/session', session.routes());

module.exports = router;
