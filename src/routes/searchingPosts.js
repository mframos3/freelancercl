const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadSearchingPost(ctx, next) {
  ctx.state.searchingPost = await ctx.orm.searchingPost.findByPk(ctx.params.id);
  return next();
}
router.get('searchingPosts.list', '/', async (ctx) => {
  const searchingPostsList = await ctx.orm.searchingPost.findAll();
  await ctx.render('searchingPosts/index', {
    searchingPostsList,
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    editSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.edit', { id: searchingPost.id }),
    deleteSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.delete', { id: searchingPost.id }),
  });
});

router.get('searchingPosts.new', '/new', async (ctx) => {
  const searchingPost = ctx.orm.searchingPost.build();
  await ctx.render('searchingPosts/new', {
    searchingPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
  });
});

router.post('searchingPosts.create', '/', async (ctx) => {
  const searchingPost = ctx.orm.searchingPost.build(ctx.request.body);
  try {
    await searchingPost.save({ fields: ['name', 'img', 'category', 'description', 'userId'] });
    ctx.redirect(ctx.router.url('searchingPosts.list'));
  } catch (validationError) {
    await ctx.render('searchingPosts/new', {
      searchingPost,
      errors: validationError.errors,
      submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
    });
  }
});

router.get('searchingPosts.edit', '/:id/edit', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  await ctx.render('searchingPosts/edit', {
    searchingPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.update', { id: searchingPost.id }),
  });
});

router.patch('searchingPosts.update', '/:id', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  try {
    const { name, img, category, description, userId } = ctx.request.body;
    await searchingPost.update({ name, img, category, description, userId });
    ctx.redirect(ctx.router.url('searchingPosts.list'));
  } catch (validationError) {
    await ctx.render('searchingPosts/edit', {
      searchingPost,
      errors: validationError.errors,
      submitSearchingPostPath: ctx.router.url('searchingPosts.update', { id: searchingPost.id }),
    });
  }
});

router.del('searchingPosts.delete', '/:id', loadSearchingPost, async (ctx) => {
  const { searchingPost } = ctx.state;
  await searchingPost.destroy();
  ctx.redirect(ctx.router.url('searchingPosts.list'));
});

module.exports = router;