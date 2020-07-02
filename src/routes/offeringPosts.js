const KoaRouter = require('koa-router');
const reviews = require('./reviews');
const applications = require('./applications');
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

async function loadOfferingPost(ctx, next) {
  ctx.state.offeringPost = await ctx.orm.offeringPost.findByPk(ctx.params.pid);
  return next();
}

async function computeRating(ctx) {
  let sumValues = 0;
  const { offeringPost } = ctx.state;
  const reviewsList = await ctx.orm.review.findAll({ where: { id_post: offeringPost.id } });
  console.log(reviewsList.length);
  if (reviewsList.length === 0) {
    // console.log('entre!');
    offeringPost.rating = 0;
    offeringPost.save({ fields: ['rating'] });
  } else {
    reviewsList.forEach((review) => {
      sumValues += review.rating;
    });
    const countReview = reviewsList.length;
    const mean = sumValues / countReview;
    offeringPost.rating = mean.toFixed(1);
    offeringPost.save({ fields: ['rating'] });
  }
}

router.get('offeringPosts.list', '/', async (ctx) => {
  await ctx.render('offeringPosts/index');
});

router.get('/list', async (ctx) => {
  const postList = await ctx.orm.offeringPost.findAll();
  ctx.body = {
    status: 'success',
    data: postList,
  };
});


router.get('offeringPosts.new', '/new', async (ctx) => {
  const offeringPost = ctx.orm.offeringPost.build();
  await ctx.render('offeringPosts/new', {
    offeringPost,
    submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
    backPath: ctx.router.url('offeringPosts.list'),
  });
});

router.post('offeringPosts.create', '/', async (ctx) => {
  const offeringPost = ctx.orm.offeringPost.build(ctx.request.body);
  offeringPost.img = 'https://freelancercl.sfo2.digitaloceanspaces.com/default-post.jpg';
  try {
    await offeringPost.save({ fields: ['name', 'category', 'description', 'price', 'userId', 'endsAt', 'img'] });
    ctx.redirect(ctx.router.url('offeringPosts.list'));
  } catch (validationError) {
    await ctx.render('offeringPosts/new', {
      offeringPost,
      errors: validationError.errors,
      submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
      backPath: ctx.router.url('offeringPosts.list'),
    });
  }
});

router.get('offeringPosts.edit', '/:pid/edit', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  await ctx.render('offeringPosts/edit', {
    offeringPost,
    submitOfferingPostPath: ctx.router.url('offeringPosts.update', { pid: offeringPost.id }),
    backPath: ctx.router.url('offeringPosts.show', { pid: offeringPost.id }),
  });
});

router.patch('offeringPosts.update', '/:pid', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  try {
    const {
      name, category, description, price, userId, endsAt,
    } = ctx.request.body;
    await offeringPost.update({
      name, category, description, price, userId, endsAt,
    });
    ctx.redirect(ctx.router.url('offeringPosts.list'));
  } catch (validationError) {
    await ctx.render('offeringPosts/edit', {
      offeringPost,
      errors: validationError.errors,
      submitOfferingPostPath: ctx.router.url('offeringPosts.update', { pid: offeringPost.id }),
      backPath: ctx.router.url('offeringPosts.show', { pid: offeringPost.id }),
    });
  }
});

router.del('offeringPosts.delete', '/:pid', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  await offeringPost.destroy();
  ctx.redirect(ctx.router.url('offeringPosts.list'));
});

router.get('offeringPosts.show', '/:pid', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  computeRating(ctx);
  offeringPost.username = (await ctx.orm.user.findByPk(offeringPost.userId)).name;
  const auxReviews = await offeringPost.getReviews();
  const promisesReviews = auxReviews.map(async (element) => {
    const newElement = element;
    const aux = await ctx.orm.user.findByPk(newElement.id_worker);
    newElement.username = aux.name;
    newElement.image = aux.imagePath;
    return newElement;
  });
  const reviewsList = await Promise.all(promisesReviews);
  const auxApplications = await offeringPost.getApplications();
  const promisesApplications = auxApplications.map(async (element) => {
    const newElement = element;
    const aux = await ctx.orm.user.findByPk(newElement.userId);
    newElement.username = aux.name;
    newElement.image = aux.imagePath;
    return newElement;
  });
  const applicationsList = await Promise.all(promisesApplications);
  await ctx.render('offeringPosts/show', {
    offeringPost,
    reviewsList,
    applicationsList,
    currentUser: await ctx.state.currentUser,
    userProfilePath: (userId) => ctx.router.url('users.show', { id: userId }),
    newReviewPath: ctx.router.url('reviews.new', { pid: offeringPost.id }),
    editReviewPath: (review) => ctx.router.url('reviews.edit', { rid: review.id, pid: offeringPost.id }),
    deleteReviewPath: (review) => ctx.router.url('reviews.delete', { rid: review.id, pid: offeringPost.id }),
    newApplicationPath: ctx.router.url('applications.new', { pid: offeringPost.id }),
    editApplicationPath: (application) => ctx.router.url('applications.edit', { aid: application.id, pid: offeringPost.id }),
    deleteApplicationPath: (application) => ctx.router.url('applications.delete', { aid: application.id, pid: offeringPost.id }),
    editOfferingPostPath: ctx.router.url('offeringPosts.edit', { pid: offeringPost.id }),
    deleteOfferingPostPath: ctx.router.url('offeringPosts.delete', { pid: offeringPost.id }),
    submitFilePath: ctx.router.url('offeringPosts.uploadFile', { pid: offeringPost.id }),
    reportPostPath: ctx.router.url('reports.new', { pid: offeringPost.id }),
    backPath: ctx.router.url('offeringPosts.list'),
  });
});

router.post('offeringPosts.uploadFile', '/:pid', loadOfferingPost, async (ctx) => {
  const { offeringPost } = ctx.state;
  const { img } = ctx.request.files;
  offeringPost.img = `https://freelancercl.sfo2.digitaloceanspaces.com/${img.name}`;
  await fileStorage.upload(img);
  await offeringPost.save();
  ctx.redirect(ctx.router.url('offeringPosts.show', { pid: offeringPost.id }));
});

router.use('/:pid/reviews', loadOfferingPost, reviews.routes());
router.use('/:pid/applications', loadOfferingPost, applications.routes());
module.exports = router;
