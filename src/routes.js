const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const offeringPosts = require('./routes/offeringPosts');
const reports = require('./routes/reports');
const postulations = require('./routes/postulations');
const searchingPosts = require('./routes/searchingPosts');
const users = require('./routes/users');
const messages = require('./routes/messages');
const reviews = require('./routes/reviews');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/offeringPosts', offeringPosts.routes());
router.use('/reports', reports.routes());
router.use('/postulations', postulations.routes());
router.use('/searchingPosts', searchingPosts.routes());
router.use('/users', users.routes());
router.use('/messages', messages.routes());
router.use('/reviews', reviews.routes());

module.exports = router;
