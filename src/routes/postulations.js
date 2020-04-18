const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPostulation(ctx, next) {
  ctx.state.postulation = await ctx.orm.postulation.findByPk(ctx.params.id);
  return next();
}

router.get('postulations.list', '/', async (ctx) => {
  const postulationsList = await ctx.orm.postulation.findAll();
  await ctx.render('postulations/index', {
    postulationsList,
    newPostulationPath: ctx.router.url('postulations.new'),
    editPostulationPath: (postulation) => ctx.router.url('postulations.edit', { id: postulation.id }),
    deletePostulationPath: (postulation) => ctx.router.url('postulations.delete', { id: postulation.id }),
  });
});

router.get('postulations.new', '/new', async (ctx) => {
  const postulation = ctx.orm.postulation.build();
  await ctx.render('postulations/new', {
    postulation,
    submitPostulationPath: ctx.router.url('postulations.create'),
  });
});

router.post('postulations.create', '/', async (ctx) => {
  const postulation = ctx.orm.postulation.build(ctx.request.body);
  try {
    await postulation.save({ fields: ['userId', 'offeringPost', 'content'] });
    ctx.redirect(ctx.router.url('postulations.list'));
  } catch (validationError) {
    await ctx.render('postulations/new', {
      postulation,
      errors: validationError.errors,
      submitPostulationPath: ctx.router.url('postulations.create'),
    });
  }
});

router.get('postulations.edit', '/:id/edit', loadPostulation, async (ctx) => {
  const { postulation } = ctx.state;
  await ctx.render('postulations/edit', {
    postulation,
    submitPostulationPath: ctx.router.url('postulations.update', { id: postulation.id }),
  });
});

router.patch('postulations.update', '/:id', loadPostulation, async (ctx) => {
  const { postulation } = ctx.state;
  try {
    const {
      userId, offeringPost, content,
    } = ctx.request.body;
    await postulation.update({
      userId, offeringPost, content,
    });
    ctx.redirect(ctx.router.url('postulations.list'));
  } catch (validationError) {
    await ctx.render('postulations/edit', {
      postulation,
      errors: validationError.errors,
      submitPostulationPath: ctx.router.url('postulations.update', { id: postulation.id }),
    });
  }
});

router.del('postulations.delete', '/:id', loadPostulation, async (ctx) => {
  const { postulation } = ctx.state;
  await postulation.destroy();
  ctx.redirect(ctx.router.url('postulations.list'));
});
module.exports = router;
