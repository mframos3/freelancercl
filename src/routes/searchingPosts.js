const KoaRouter = require('koa-router');

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const router = new KoaRouter();


async function loadSearchingPost(ctx, next) {
  ctx.state.searchingPost = await ctx.orm.searchingPost.findByPk(ctx.params.id);
  return next();
}
router.get('searchingPosts.list', '/', async (ctx) => {
  const result = ctx.request.query;
  const [term, type] = [result.search, result.type];
  let searchingPostsList = await ctx.orm.searchingPost.findAll();
  if (type === 'name') {
    searchingPostsList = await ctx.orm.searchingPost.findAll({ where: { name: { [Op.like]: `%${term}%` } } });
  } else if (type === 'category') {
    searchingPostsList = await ctx.orm.searchingPost.findAll({ where: { category: { [Op.like]: `%${term}%` } } });
  }

  await ctx.render('searchingPosts/index', {
    searchingPostsList,
    userProfilePath: (userId) => ctx.router.url('users.show', { id: userId }),
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    editSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.edit', { id: searchingPost.id }),
    showSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.show', { id: searchingPost.id }),
    deleteSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.delete', { id: searchingPost.id }),
  });
});

router.get('searchingPosts.new', '/new', async (ctx) => {
  const searchingPost = ctx.orm.searchingPost.build();
  await ctx.render('searchingPosts/new', {
    searchingPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
    backPath: ctx.router.url('searchingPosts.list'),
  });
});

router.post('searchingPosts.create', '/', async (ctx) => {
  const searchingPost = ctx.orm.searchingPost.build(ctx.request.body);
  try {
    await searchingPost.save({ fields: ['name', 'category', 'description', 'userId'] });
    ctx.redirect(ctx.router.url('searchingPosts.list'));
  } catch (validationError) {
    await ctx.render('searchingPosts/new', {
      searchingPost,
      errors: validationError.errors,
      submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
      backPath: ctx.router.url('searchingPosts.list'),
    });
  }
});

router.get('searchingPosts.edit', '/:id/edit', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  await ctx.render('searchingPosts/edit', {
    searchingPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.update', { id: searchingPost.id }),
    backPath: ctx.router.url('searchingPosts.show', { id: searchingPost.id }),
  });
});

router.patch('searchingPosts.update', '/:id', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  try {
    const {
      name, category, description, userId,
    } = ctx.request.body;
    await searchingPost.update({
      name, category, description, userId,
    });
    ctx.redirect(ctx.router.url('searchingPosts.list'));
  } catch (validationError) {
    await ctx.render('searchingPosts/edit', {
      searchingPost,
      errors: validationError.errors,
      submitSearchingPostPath: ctx.router.url('searchingPosts.update', { id: searchingPost.id }),
      backPath: ctx.router.url('searchingPosts.show', { id: searchingPost.id }),
    });
  }
});

router.del('searchingPosts.delete', '/:id', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  await searchingPost.destroy();
  ctx.redirect(ctx.router.url('searchingPosts.list'));
});

router.get('searchingPosts.show', '/:id/', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  searchingPost.username = (await ctx.orm.user.findByPk(searchingPost.userId)).name;
  await ctx.render('searchingPosts/show', {
    searchingPost,
    userProfilePath: (userId) => ctx.router.url('users.show', { id: userId }),
    editSearchingPostPath: ctx.router.url('searchingPosts.edit', { id: searchingPost.id }),
    deleteSearchingPostPath: ctx.router.url('searchingPosts.delete', { id: searchingPost.id }),
    backPath: ctx.router.url('searchingPosts.list'),
  });
});

module.exports = router;
