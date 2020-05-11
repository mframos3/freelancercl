const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findByPk(ctx.params.rid);
  return next();
}

router.get('reviews.new', '/new', async (ctx) => {
  const review = ctx.orm.review.build();
  const postId = ctx.state.offeringPost.id;
  await ctx.render('reviews/new', {
    review,
    postId,
    currentUser: await ctx.state.currentUser,
    submitReviewPath: ctx.router.url('reviews.create', { pid: postId }),
  });
});

router.post('reviews.create', '/', async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  try {
    await review.save({ fields: ['id_post', 'id_worker', 'rating', 'comment'] });
    ctx.redirect(ctx.router.url('offeringPosts.show', { pid: ctx.state.offeringPost.id }));
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.create', { pid: ctx.state.offeringPost.id }),
    });
  }
});

router.get('reviews.edit', '/:rid/edit', loadReview, async (ctx) => {
  const { review } = ctx.state;
  const postId = ctx.params.pid;
  await ctx.render('reviews/edit', {
    review,
    postId,
    submitReviewPath: ctx.router.url('reviews.update', { rid: review.id, pid: postId }),
  });
});

router.patch('reviews.update', '/:rid', loadReview, async (ctx) => {
  const { review } = ctx.state;
  try {
    const {
      idPost, idWorker, rating, comment,
    } = ctx.request.body;
    await review.update({
      idPost, idWorker, rating, comment,
    });
    ctx.redirect(ctx.router.url('offeringPosts.show', { pid: ctx.state.offeringPost.id }));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.update', { rid: review.id }),
    });
  }
});

router.del('reviews.delete', '/:rid', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await review.destroy();
  ctx.redirect(ctx.router.url('offeringPosts.show', { pid: review.id_post }));
});
module.exports = router;
