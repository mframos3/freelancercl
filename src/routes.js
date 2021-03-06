const KoaRouter = require('koa-router');

const index = require('./routes/index');
const offeringPosts = require('./routes/offeringPosts');
const reports = require('./routes/reports');
const searchingPosts = require('./routes/searchingPosts');
const users = require('./routes/users');
const messages = require('./routes/messages');
const session = require('./routes/session');
const chatApi = require('./routes/api/chat');
const followApi = require('./routes/api/follow');

const restApi = require('./routes/restapi');


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

router.use('/api', restApi.routes());
router.use('/', index.routes());
router.use('/offeringPosts', offeringPosts.routes());
router.use('/reports', reports.routes());
router.use('/searchingPosts', searchingPosts.routes());
router.use('/users', users.routes());
router.use('/messages', messages.routes());
router.use('/session', session.routes());
router.use('/chat', chatApi.routes());
router.use('/follow', followApi.routes());

module.exports = router;
