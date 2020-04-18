const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const offeringPosts = require('./routes/offeringPosts');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/offeringPosts', offeringPosts.routes());

module.exports = router;
