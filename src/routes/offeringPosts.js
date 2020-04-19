const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadOfferingPost(ctx, next) {
  ctx.state.offeringPost = await ctx.orm.offeringPost.findByPk(ctx.params.id);
  return next();
}
router.get('offeringPosts.list', '/', async (ctx) => {
  const offeringPostsList = await ctx.orm.offeringPost.findAll();
  await ctx.render('offeringPosts/index', {
    offeringPostsList,
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    editOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.edit', { id: offeringPost.id }),
    deleteOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.delete', { id: offeringPost.id }),
  });
});


router.get('offeringPosts.new', '/new', async (ctx) => {
  const offeringPost = ctx.orm.offeringPost.build();
  await ctx.render('offeringPosts/new', {
    offeringPost,
    submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
  });
});

router.post('offeringPosts.create', '/', async (ctx) => {
  const offeringPost = ctx.orm.offeringPost.build(ctx.request.body);
  try {
    await offeringPost.save({ fields: ['name', 'img', 'category', 'description', 'userId', 'endsAt'] });
    ctx.redirect(ctx.router.url('offeringPosts.list'));
  } catch (validationError) {
    await ctx.render('offeringPosts/new', {
      offeringPost,
      errors: validationError.errors,
      submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
    });
  }
});

router.get('offeringPosts.edit', '/:id/edit', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  await ctx.render('offeringPosts/edit', {
    offeringPost,
    submitOfferingPostPath: ctx.router.url('offeringPosts.update', { id: offeringPost.id }),
  });
});

router.patch('offeringPosts.update', '/:id', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  try {
    const {
      name, img, category, description, userId, endsAt,
    } = ctx.request.body;
    await offeringPost.update({
      name, img, category, description, userId, endsAt,
    });
    ctx.redirect(ctx.router.url('offeringPosts.list'));
  } catch (validationError) {
    await ctx.render('offeringPosts/edit', {
      offeringPost,
      errors: validationError.errors,
      submitOfferingPostPath: ctx.router.url('offeringPosts.update', { id: offeringPost.id }),
    });
  }
});

router.del('offeringPosts.delete', '/:id', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  await offeringPost.destroy();
  ctx.redirect(ctx.router.url('offeringPosts.list'));
});

module.exports = router;
