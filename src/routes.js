const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const reports = require('./routes/reports');
const users = require('./routes/users');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/reports', reports.routes());
router.use('/users', users.routes());

module.exports = router;
