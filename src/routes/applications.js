const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadApplication(ctx, next) {
  ctx.state.application = await ctx.orm.application.findByPk(ctx.params.aid);
  return next();
}

router.get('applications.new', '/new', async (ctx) => {
  const application = ctx.orm.application.build();
  const postId = ctx.state.offeringPost.id;
  await ctx.render('applications/new', {
    application,
    postId,
    currentUser: await ctx.state.currentUser,
    submitApplicationPath: ctx.router.url('applications.create', { pid: postId }),
  });
});

router.post('applications.create', '/:pid', async (ctx) => {
  const application = ctx.orm.application.build(ctx.request.body);
  try {
    await application.save({ fields: ['userId', 'offeringPostId', 'content'] });
    ctx.redirect(ctx.router.url('offeringPosts.show', { pid: ctx.state.offeringPost.id }));
  } catch (validationError) {
    await ctx.render('applications/new', {
      application,
      postId: ctx.params.pid,
      errors: validationError.errors,
      submitApplicationPath: ctx.router.url('applications.create', { pid: ctx.state.offeringPost.id }),
    });
  }
});

router.get('applications.edit', '/:aid/edit', loadApplication, async (ctx) => {
  const { application } = ctx.state;
  const postId = ctx.state.offeringPost.id;
  await ctx.render('applications/edit', {
    application,
    postId,
    submitApplicationPath: ctx.router.url('applications.update', { aid: application.id, pid: postId }),
  });
});

router.patch('applications.update', '/:aid', loadApplication, async (ctx) => {
  const { application } = ctx.state;
  try {
    const {
      userId, offeringPostId, content,
    } = ctx.request.body;
    await application.update({
      userId, offeringPostId, content,
    });
    ctx.redirect(ctx.router.url('offeringPosts.show', { pid: ctx.state.offeringPost.id }));
  } catch (validationError) {
    await ctx.render('applications/edit', {
      application,
      postId: ctx.state.offeringPost.id,
      errors: validationError.errors,
      submitApplicationPath: ctx.router.url('applications.update', { aid: application.id, pid: ctx.state.offeringPost.id }),
    });
  }
});

router.del('applications.delete', '/:aid', loadApplication, async (ctx) => {
  const { application } = ctx.state;
  await application.destroy();
  ctx.redirect(ctx.router.url('offeringPosts.show', { pid: application.offeringPostId }));
});
module.exports = router;
