const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const reports = require('./routes/reports');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/reports', reports.routes());

module.exports = router;
