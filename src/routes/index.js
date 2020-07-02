const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const { Op } = Sequelize;

const router = new KoaRouter();


const axios = require('axios');
const querystring = require('querystring');


// const code = 'AQRT549WOqLJcRPqdrD7x_LI-XDnCwDw3_HkHSTgkSJjZweAhtBMS3R-mli4tUyPbCS5njf3HIbSeuyPIXIAD-pZ4lFAFKjyFIDJaMbmXQBnTSg6Oqbly6pmVaPBO_eGqvFpAD17GlW76Rgi10pUGrSRn0eZBXmhfFpyUknm7W-ywTyto9TsE59PM4KHLQ';
const client_id = '77c56cbij2arr0';
const client_secret = 'C7oQMzl70UMzRmPy';

async function linkedinApi(code) {
  axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'https://freelancercl.herokuapp.com',
    client_id: client_id,
    client_secret: client_secret,
  }))
    .then((res2) => {
      console.log('LINKEDIN RESPUESTA');
      console.log(res2);
      console.log('111111111');
      console.log(res2.data.access_token);
      console.log('22222222');
      console.log(JSON.stringify(res2.data.access_token, 0, 2));
      var accessToken = res2.data.access_token;
      return accessToken;
    }).then((accessToken) => {
      console.log("ESTOOO");
      console.log(accessToken);
    axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Host': 'api.linkedin.com',
        'Connection': 'Keep-Alive',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then((res2) => {
      console.log('LINKEDIN RESPUESTA FINAL');
      console.log(res2);
      return res2.data;
    }).catch((res) => {
      console.log('FFFFFF');
      console.log(res);
    });
});
}


router.get('index.landing', '/', async (ctx) => {
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const isUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  let offeringPostsList = [];
  let searchingPostsList = [];
  if (isUser) {
    offeringPostsList = await ctx.orm.offeringPost.findAll({
      where: { userId: { [Op.eq]: isUser.id } },
    });
    searchingPostsList = await ctx.orm.searchingPost.findAll({
      where: { userId: { [Op.eq]: isUser.id } },
    });
  }
  const bestUsers = await ctx.orm.user.findAll({ order: [['cFollowers', 'DESC']], limit: 3 });
  const auxBestOfferingPosts = await ctx.orm.offeringPost.findAll({ order: [['rating', 'DESC']], limit: 3 });
  const promisesBestOfferingPosts = auxBestOfferingPosts.map(async (element) => {
    const newElement = element;
    const aux1 = await newElement.getReviews();
    const aux2 = await newElement.getApplications();
    newElement.reviewsCount = aux1.length;
    newElement.applicationsCount = aux2.length;
    return newElement;
  });
  const bestOfferingPosts = await Promise.all(promisesBestOfferingPosts);
  let followingIds = '';
  if (currentUser) {
    const following = await ctx.orm.follow.findAll({
      where: {
        followerId: { [Op.eq]: currentUser.id },
      },
    });
    followingIds = following.map((x) => x.followedId);
  }
  const auxOfferingPostsFollowing = await ctx.orm.offeringPost.findAll({
    where: { userId: { [Op.in]: followingIds } },
    limit: 3,
  });
  const promisesOfferingPostsFollowing = auxOfferingPostsFollowing.map(async (element) => {
    const newElement = element;
    const aux1 = await newElement.getReviews();
    const aux2 = await newElement.getApplications();
    newElement.reviewsCount = aux1.length;
    newElement.applicationsCount = aux2.length;
    return newElement;
  });
  const offeringPostsFollowing = await Promise.all(promisesOfferingPostsFollowing);
  const searchingPostsFollowing = await ctx.orm.searchingPost.findAll({
    where: { userId: { [Op.in]: followingIds } },
    limit: 3,
  });
  const showOfferingPostPath = (offeringPost) => ctx.router.url('offeringPosts.show', { pid: offeringPost.id });
  const showSearchingPostPath = (searchingPost) => ctx.router.url('searchingPosts.show', { id: searchingPost.id });

  // Para popUp
  const user = ctx.orm.user.build();
  const searchingPost = ctx.orm.searchingPost.build(ctx.request.body);
  const offeringPost = ctx.orm.offeringPost.build(ctx.request.body);
  const passwordError = '';


  //LINKEDIN
  console.log('CODE:');
  console.log(ctx.query);
  console.log('CONTEXTO');
  console.log(ctx);
  const code = ctx.query.code;
  const linkedinData = await linkedinApi(code);
  currentUser.linkedinData = linkedinData;

  await ctx.render('index', {
    appVersion: pkg.version,
    offeringPostsList,
    searchingPostsList,
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    createSessionPath: ctx.router.url('session.create'),
    newRegisterPath: ctx.router.url('users.new'),
    notice: ctx.flashMessage.notice,
    submitUserPath: ctx.router.url('users.create'),
    // Para popUp
    user,
    searchingPost,
    offeringPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
    submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
    backPath: ctx.router.url('searchingPosts.list'),
    //
    passwordError,
    bestUsers,
    bestOfferingPosts,
    offeringPostsFollowing,
    searchingPostsFollowing,
    showOfferingPostPath,
    showSearchingPostPath,
  });
});

module.exports = router;
