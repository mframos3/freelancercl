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

const api = require('./routes/api');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId)),
    newSessionPath: ctx.router.url('session.new'),
    newRegisterPath: ctx.router.url('users.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    landingPath: ctx.router.url('index.landing'),
    messagesPath: ctx.router.url('messages.list'),
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    showUserPath: (user) => ctx.router.url('users.show', { id: user.id }),
  });
  return next();
});

router.use('/api', api.routes());
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
