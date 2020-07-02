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
    userProfilePath: (userId) => ctx.router.url('users.show', { id: userId }),
    postPath: (reportedPost) => ctx.router.url('offeringPosts.show', { id: reportedPost }),
    showReportPath: (report) => ctx.router.url('reports.show', { id: report.id }),
  });
});

router.get('reports.new', '/new/:pid', async (ctx) => {
  const report = ctx.orm.report.build();
  const postId = ctx.params.pid;
  const postUserId = (await ctx.orm.offeringPost.findByPk(postId)).userId;
  await ctx.render('reports/new', {
    report,
    postId,
    postUserId,
    submitReportPath: ctx.router.url('reports.create', { pid: ctx.params.pid }),
  });
});

router.post('reports.create', '/:pid', async (ctx) => {
  const report = ctx.orm.report.build(ctx.request.body);
  const postId = ctx.params.pid;
  const postUserId = (await ctx.orm.offeringPost.findByPk(postId)).userId;
  try {
    await report.save({ fields: ['title', 'content', 'reportingUserId', 'reportedUserId', 'reportedPost'] });
    ctx.redirect(ctx.router.url('offeringPosts.list'));
  } catch (validationError) {
    await ctx.render('reports/new', {
      report,
      postId,
      postUserId,
      errors: validationError.errors,
      submitReportPath: ctx.router.url('reports.create', { pid: ctx.params.pid }),
    });
  }
});

router.get('reports.edit', '/:id/edit', loadReport, async (ctx) => {
  const { report } = ctx.state;
  const postId = report.reportedPost;
  const postUserId = (await ctx.orm.offeringPost.findByPk(postId)).userId;
  await ctx.render('reports/edit', {
    report,
    postId,
    postUserId,
    submitReportPath: ctx.router.url('reports.update', { id: report.id }),
  });
});

router.patch('reports.update', '/:id', loadReport, async (ctx) => {
  const { report } = ctx.state;
  const postId = report.reportedPost;
  const postUserId = (await ctx.orm.offeringPost.findByPk(postId)).userId;
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
      postId,
      postUserId,
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

router.get('reports.show', '/:id/', loadReport, async (ctx) => {
  const { report } = ctx.state;
  report.reportingUserName = (await ctx.orm.user.findByPk(report.reportingUserId)).name;
  report.reportedUserName = (await ctx.orm.user.findByPk(report.reportedUserId)).name;
  report.reportedPostName = (await ctx.orm.offeringPost.findByPk(report.reportedPost)).name;
  await ctx.render('reports/show', {
    report,
    userProfilePath: (userId) => ctx.router.url('users.show', { id: userId }),
    postPath: (reportedPost) => ctx.router.url('offeringPosts.show', { pid: reportedPost }),
    editReportPath: ctx.router.url('reports.edit', { id: report.id }),
    deleteReportPath: ctx.router.url('reports.delete', { id: report.id }),
  });
});

module.exports = router;
