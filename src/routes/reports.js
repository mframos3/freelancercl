const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReport(ctx, next) {
  ctx.state.report = await ctx.orm.report.findByPk(ctx.params.id);
  return next();
}

router.get('reports.list', '/', async (ctx) => {
  const reportsList = await ctx.orm.report.findAll();
  await ctx.render('reports/index', {
    reportsList,
    newReportPath: ctx.router.url('reports.new'),
    editReportPath: (report) => ctx.router.url('reports.edit', { id: report.id }),
    deleteReportPath: (report) => ctx.router.url('reports.delete', { id: report.id }),
  });
});

router.get('reports.new', '/new', async (ctx) => {
  const report = ctx.orm.report.build();
  await ctx.render('reports/new', {
    report,
    submitReportPath: ctx.router.url('reports.create'),
  });
});

router.post('reports.create', '/', async (ctx) => {
  const report = ctx.orm.report.build(ctx.request.body);
  try {
    await report.save({ fields: ['title', 'content', 'reportingUserId', 'reportedUserId', 'reportedPost'] });
    ctx.redirect(ctx.router.url('reports.list'));
  } catch (validationError) {
    await ctx.render('reports/new', {
      report,
      errors: validationError.errors,
      submitReportPath: ctx.router.url('reports.create'),
    });
  }
});

router.get('reports.edit', '/:id/edit', loadReport, async (ctx) => {
  const { report } = ctx.state;
  await ctx.render('reports/edit', {
    report,
    submitReportPath: ctx.router.url('reports.update', { id: report.id }),
  });
});

router.patch('reports.update', '/:id', loadReport, async (ctx) => {
  const { report } = ctx.state;
  try {
    const {
      title, content, reportingUserId, reportedUserId, reportedPost,
    } = ctx.request.body;
    await report.update({
      title, content, reportingUserId, reportedUserId, reportedPost,
    });
    ctx.redirect(ctx.router.url('reports.list'));
  } catch (validationError) {
    await ctx.render('reports/edit', {
      report,
      errors: validationError.errors,
      submitReportPath: ctx.router.url('reports.update', { id: report.id }),
    });
  }
});

router.del('reports.delete', '/:id', loadReport, async (ctx) => {
  const { report } = ctx.state;
  await report.destroy();
  ctx.redirect(ctx.router.url('reports.list'));
});
module.exports = router;
