const KoaRouter = require('koa-router');

const router = new KoaRouter();
const reviews = require('./reviews');

async function loadOfferingPost(ctx, next) {
  ctx.state.offeringPost = await ctx.orm.offeringPost.findByPk(ctx.params.pid);
  return next();
}
router.get('offeringPosts.list', '/', async (ctx) => {
  const offeringPostsList = await ctx.orm.offeringPost.findAll();
  await ctx.render('offeringPosts/index', {
    offeringPostsList,
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    editOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.edit', { pid: offeringPost.id }),
    showOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.show', { pid: offeringPost.id }),
    deleteOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.delete', { pid: offeringPost.id }),
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

router.get('offeringPosts.edit', '/:pid/edit', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  await ctx.render('offeringPosts/edit', {
    offeringPost,
    submitOfferingPostPath: ctx.router.url('offeringPosts.update', { pid: offeringPost.id }),
  });
});

router.patch('offeringPosts.update', '/:pid', loadOfferingPost, async (ctx) => {
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
      submitOfferingPostPath: ctx.router.url('offeringPosts.update', { pid: offeringPost.id }),
    });
  }
});

router.del('offeringPosts.delete', '/:pid', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  await offeringPost.destroy();
  ctx.redirect(ctx.router.url('offeringPosts.list'));
});

router.get('offeringPosts.show', '/:pid/', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  const reviewsList = await offeringPost.getReviews();
  await ctx.render('offeringPosts/show', {
    offeringPost,
    reviewsList,
    newReviewPath: ctx.router.url('reviews.new', { pid: offeringPost.id }),
    editReviewPath: (review) => ctx.router.url('reviews.edit', { rid: review.id, pid: offeringPost.id }),
    deleteReviewPath: (review) => ctx.router.url('reviews.delete', { rid: review.id }),
  });
});

router.use('/:pid/reviews', reviews.routes(), reviews.allowedMethods());

module.exports = router;
