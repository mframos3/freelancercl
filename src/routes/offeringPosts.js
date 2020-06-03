const KoaRouter = require('koa-router');

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const Fuse = require('fuse.js');


const router = new KoaRouter();
const reviews = require('./reviews');
const applications = require('./applications');
const fileStorage = require('../services/file-storage');

async function loadOfferingPost(ctx, next) {
  ctx.state.offeringPost = await ctx.orm.offeringPost.findByPk(ctx.params.pid);
  return next();
}

async function computeRating(ctx) {
  let sumValues = 0;
  const { offeringPost } = ctx.state;
  const reviewsList = await ctx.orm.review.findAll({ where: { id_post: offeringPost.id } });
  reviewsList.forEach((review) => {
    sumValues += review.rating;
  });
  const countReview = reviewsList.length;
  // console.log(`Cantidad de reviews: ${countReview}`);
  // console.log(`Suma de rating: ${sumValues}`);
  const mean = sumValues / countReview;
  // console.log(`Promedio: ${mean.toFixed(1)}`);
  offeringPost.rating = mean.toFixed(1);
}

router.get('offeringPosts.list', '/', async (ctx) => {
  const perPage = 9;
  let page = ctx.params.page || 1;
  const result = ctx.request.query;
  let [term, category] = [result.search, result.category];
  if (category === 'Todo') {
    category = '';
  }
  if (!category) {
    category = '';
  }
  if (!term) {
    term = '';
  }
  const options = {
    isCaseSensitive: false,
    // includeScore: false,
    shouldSort: true,
    // includeMatches: false,
    findAllMatches: true,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: true,
    keys: ['dataValues.name'],
  };
  const offeringPostsList = await ctx.orm.offeringPost.findAll({ where: { category: { [Op.like]: `%${category}%` } } });
  const fuse = new Fuse(offeringPostsList, options);
  let searchResult = fuse.search(term);
  if (!term) {
    offeringPostsList.forEach((e) => {
      e.item = e.dataValues;
    });
    searchResult = offeringPostsList;
  }
  for (let i = 0; i < offeringPostsList.length; i += 1) {
    offeringPostsList[i].endsAt = offeringPostsList[i].endsAt.toString().slice(0, 24);
    offeringPostsList[i].createdAt = offeringPostsList[i].createdAt.toString().slice(0, 24);
  }
  await ctx.render('offeringPosts/index', {
    searchResult,
    userProfilePath: (userId) => ctx.router.url('users.show', { id: userId }),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    showOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.show', { pid: offeringPost.id }),
  });
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
  try {
    await offeringPost.save({ fields: ['name', 'category', 'description', 'price', 'userId', 'endsAt'] });
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
    newElement.username = (await ctx.orm.user.findByPk(newElement.id_worker)).name;
    return newElement;
  });
  const reviewsList = await Promise.all(promisesReviews);
  const auxApplications = await offeringPost.getApplications();
  const promisesApplications = auxApplications.map(async (element) => {
    const newElement = element;
    newElement.username = (await ctx.orm.user.findByPk(newElement.userId)).name;
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
