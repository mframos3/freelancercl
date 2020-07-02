const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const { Op } = Sequelize;

const router = new KoaRouter();

const axios = require('axios');
const querystring = require('querystring');
const { Validator } = require('sequelize');


const clientId = '77c56cbij2arr0';
const clientSecret = 'C7oQMzl70UMzRmPy';

async function linkedinApi(code, currentUser) {
  axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'https://freelancercl.herokuapp.com',
    client_id: clientId,
    client_secret: clientSecret,
  }))
    .then((res2) => {
      const accessToken = res2.data.access_token;
      return accessToken;
    }).then((accessToken) => {
      axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          'Host': 'api.linkedin.com',
          'Connection': 'Keep-Alive',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((res2) => {
          console.log("DATA FINAL");
          // currentUser.linkedinLastName = res2.data.localizedLastName;
          currentUser.linkedinFirstName = res2.data.localizedFirstName;
          currentUser.save({ fields: ['linkedinFirstName'] });
        }).catch((res) => {
          console.log('FFFFFF');
          console.log(res);
          return res;
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
  // const user = ctx.orm.user.build();
  // const searchingPost = ctx.orm.searchingPost.build(ctx.request.body);
  // const offeringPost = ctx.orm.offeringPost.build(ctx.request.body);
  // const passwordError = '';

  console.log('ENTRAMO O NO LA WEA');

  //LINKEDIN
  const code = ctx.query.code;
  // if (currentUser) {
  //   currentUser.linkedinData = linkedinData1;
  // }
  if (code) {
    // console.log(linkedinFirstName);
    await linkedinApi(code, currentUser);
    console.log('PASAMO O NO LA WEA');
    console.log(currentUser.linkedinFirstName);
    console.log('CUUUURRENT2');
    await currentUser.save({ fields: ['linkedinFirstName'] });
    console.log(currentUser.linkedinFirstName);
  }
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
    // user,
    // searchingPost,
    // offeringPost,
    submitSearchingPostPath: ctx.router.url('searchingPosts.create'),
    submitOfferingPostPath: ctx.router.url('offeringPosts.create'),
    backPath: ctx.router.url('searchingPosts.list'),
    //
    // passwordError,
    bestUsers,
    bestOfferingPosts,
    offeringPostsFollowing,
    searchingPostsFollowing,
    showOfferingPostPath,
    showSearchingPostPath,
  });
});

module.exports = router;
