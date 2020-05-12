const KoaRouter = require('koa-router');

const router = new KoaRouter();

const Sequelize = require('sequelize');

const { Op } = Sequelize;

router.get('searchResults.search', '/', async (ctx) => {
  const result = ctx.request.query;
  const term = result.search;
  const check = result.togBtn;
  if (check) {
    const offeringPostsList = await ctx.orm.offeringPost.findAll({ where: { category: { [Op.like]: `%${term}%` } } });
    await ctx.render('offeringPosts/index', {
      offeringPostsList,
      newOfferingPostPath: ctx.router.url('offeringPosts.new'),
      editOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.edit', { id: offeringPost.id }),
      deleteOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.delete', { id: offeringPost.id }),
    });
  } else {
    const searchingPostsList = await ctx.orm.searchingPost.findAll({ where: { category: { [Op.like]: `%${term}%` } } });
    await ctx.render('searchingPosts/index', {
      searchingPostsList,
      newSearchingPostPath: ctx.router.url('searchingPosts.new'),
      editSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.edit', { id: searchingPost.id }),
      deleteSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.delete', { id: searchingPost.id }),
    });
  }
});
module.exports = router;
