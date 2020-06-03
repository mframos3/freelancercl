const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findByPk(ctx.params.rid);
  return next();
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

// Función que calcula el rating del usuario
async function computeRating(ctx, idOfferingPost) {
  let countReview = 0;
  let sumValues = 0;
  let reviewsList = [];
  const motherPost = await ctx.orm.offeringPost.findOne({ where: { id: idOfferingPost } });
  const user = await ctx.orm.user.findOne({ where: { id: motherPost.userId } });
  const offeringPostsList = await ctx.orm.offeringPost.findAll({ where: { userId: user.id } });
  asyncForEach(offeringPostsList, async (post) => {
    reviewsList = await ctx.orm.review.findAll({ where: { id_post: post.id } });
    reviewsList.forEach((review) => {
      sumValues += review.rating;
      countReview += 1;
    });
  }).then(async () => {
    // console.log(`Suma de ratings: ${sumValues}`);
    // console.log(`Cantidad de reviws: ${countReview}`);
    const mean = sumValues / countReview;
    user.rating = mean.toFixed(1);
    await user.save({ fields: ['rating'] });
  });
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

router.post('reviews.create', '/:pid', async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  try {
    await review.save({ fields: ['id_post', 'id_worker', 'rating', 'comment'] });
    ctx.redirect(ctx.router.url('offeringPosts.show', { pid: ctx.state.offeringPost.id }));
    console.log('estoy entrando?');
    computeRating(ctx, review.id_post);
    // const motherPost = await ctx.orm.offeringPost.findOne({ where: { id: review.id_post } });
    // const { user } = await ctx.orm.user.findOne({ where: { id: motherPost.userId } });
    // computeRating(ctx, review.id_post);
    // const newRating = await computeRating(ctx, user);
    // console.log('rating es:');
    // console.log(newRating);
    // user.rating = newRating;
    // await user.save();
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      postId: ctx.params.pid,
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
      postId: ctx.state.offeringPost.id,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.update', { rid: review.id, pid: ctx.state.offeringPost.id }),
    });
  }
});

router.del('reviews.delete', '/:rid', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await review.destroy();
  ctx.redirect(ctx.router.url('offeringPosts.show', { pid: review.id_post }));
});
module.exports = router;
