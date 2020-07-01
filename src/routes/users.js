const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');

const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;
const { Op } = Sequelize;

const Fuse = require('fuse.js');

const fileStorage = require('../services/file-storage');
const sgMail = require('../config/emailApi');
const msg = require('../mailers/login-email-Api');


const https = require('https');


//AccesToken
// const options = {
//   host: 'www.linkedin.com',
//   path: '/oauth/v2/accessToken',
//   method: 'POST',
//   headers: {
//     'content-type': 'application/x-www-form-urlencoded',
//   },
//   form: {
//     grant_type: 'authorization_code&code=AQRT549WOqLJcRPqdrD7x_LI-XDnCwDw3_HkHSTgkSJjZweAhtBMS3R-mli4tUyPbCS5njf3HIbSeuyPIXIAD-pZ4lFAFKjyFIDJaMbmXQBnTSg6Oqbly6pmVaPBO_eGqvFpAD17GlW76Rgi10pUGrSRn0eZBXmhfFpyUknm7W-ywTyto9TsE59PM4KHLQ&redirect_uri=https://freelancercl.herokuapp.com&client_id=77c56cbij2arr0&client_secret=C7oQMzl70UMzRmPy',
//   },
// };

// const accessTokenRequest = https.request(options, function( res ) {
//   let data = '';
//   res.on('data', (chunk) => {
//     data += chunk;
//   });
//   res.on('end', () => {
//     const accessToken = JSON.parse(data);
//     console.log('ACCESS 2222');
//     console.log(JSON.stringify(accessToken, 0, 2));  });
// });
// accessTokenRequest.end();

// //Request
// const optionsRequest = {
//   host: 'api.linkedin.com',
//   connection: 'Keep-Alive',
//   method: 'GET',
//   headers: {
//     'content-type': 'application/json',
//      authorization: 'Bearer ACCESS_TOKEN',
//   },
//   form: {
//     grant_type: 'authorization_code&code=AQRT549WOqLJcRPqdrD7x_LI-XDnCwDw3_HkHSTgkSJjZweAhtBMS3R-mli4tUyPbCS5njf3HIbSeuyPIXIAD-pZ4lFAFKjyFIDJaMbmXQBnTSg6Oqbly6pmVaPBO_eGqvFpAD17GlW76Rgi10pUGrSRn0eZBXmhfFpyUknm7W-ywTyto9TsE59PM4KHLQ&redirect_uri=https://freelancercl.herokuapp.com&client_id=77c56cbij2arr0&client_secret=C7oQMzl70UMzRmPy',
//   },
// };

// const requestLinkedin = https.request(options, function( res ) {
//   let data = '';
//   res.on('data', (chunk) => {
//     data += chunk;
//   });
//   res.on('end', () => {
//     const linke = JSON.parse(data);
//     console.log('ACCESS 3333');
//     console.log(JSON.stringify(linke, 0, 2));  });
// });
// requestLinkedin.end();




const router = new KoaRouter();

let passwordError = '';

const index = require('../routes/index');

router.use('/', index.routes());

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}

async function computeFollowers(ctx) {
  const { user } = ctx.state;
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const followersList = await ctx.orm.follow.findAll({ where: { followedId: user.id } });
  const followedList = await ctx.orm.follow.findAll({ where: { followerId: user.id } });
  const followersCU = await ctx.orm.follow.findAll({ where: { followedId: currentUser.id } });
  const followedCU = await ctx.orm.follow.findAll({ where: { followerId: currentUser.id } });
  currentUser.cFollowers = followersCU.length;
  currentUser.cFollowed = followedCU.length;
  user.cFollowers = followersList.length;
  user.cFollowed = followedList.length;
  user.save({ fields: ['cFollowers', 'cFollowed'] });
  currentUser.save({ fields: ['cFollowers', 'cFollowed'] });
}

router.get('users.list', '/', async (ctx) => {
  const result = ctx.request.query;
  let term = result.search;
  const options = {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    useExtendedSearch: true,
    keys: [{ name: 'dataValues.email', weight: 2 }, { name: 'dataValues.name', weight: 1.5 }, { name: 'dataValues.occupation', weight: 0.3 }],
  };
  if (!term) {
    term = '';
  }
  const usersList = await ctx.orm.user.findAll({ order: [['rating', 'DESC']] });
  const fuse = new Fuse(usersList, options);
  let searchResult = fuse.search(`'${term}`);
  if (!term) {
    usersList.forEach((e) => {
      e.item = e.dataValues;
    });
    searchResult = usersList;
  }
  await ctx.render('users/index', {
    searchResult,
    newUserPath: ctx.router.url('users.new'),
    showUserPath: (user) => ctx.router.url('users.show', { id: user.item.id }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    passwordError,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  ctx.redirect(ctx.router.url('index.landing'));

  try {
    const password1 = ctx.request.body.password;
    const { password2 } = ctx.request.body;
    if (password1 !== password2) {
      passwordError = 'Las contraseñas ingresadas NO coindicen.';
      throw new Error(passwordError);
    }
    const {
      name, email, password, occupation,
    } = ctx.request.body;
    const cryptPassword = bcrypt.hashSync(password, PASSWORD_SALT);
    const emailRevisado = await ctx.orm.user.findOne({ where: { email } });
    if (emailRevisado == null) {
      await user.save({
        name, email, cryptPassword, occupation,
      });
      ctx.session.userId = user.id;
      ctx.redirect(ctx.router.url('index.landing'));
    } else {
      await ctx.render('users/new', {
        user,
        errors: { message: 'The email already exist.' },
        submitUserPath: ctx.router.url('users.create'),
      });
    }
  } catch (validationError) {

    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
      passwordError,
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
    backPath: ctx.router.url('users.show', { id: user.id }),
    passwordError,
  });
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      name, password, email, occupation,
    } = ctx.request.body;
    await user.update({
      name, password, email, occupation,
    });
    ctx.redirect(ctx.router.url('users.show'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
      backPath: ctx.router.url('users.show', { id: user.id }),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('index.landing'));
});

router.get('users.show', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  let followerPreviousId = -1;
  computeFollowers(ctx);
  if (currentUser) {
    followerPreviousId = currentUser.id;
  }
  const follow = await ctx.orm.follow.findOne({
    where: { followedId: user.id, followerId: followerPreviousId },
  });
  const offeringPostsList = await ctx.orm.offeringPost.findAll({
    where: { userId: { [Op.eq]: user.id } },
  });
  const searchingPostsList = await ctx.orm.searchingPost.findAll({
    where: { userId: { [Op.eq]: user.id } },
  });
  const linkedin = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77c56cbij2arr0&redirect_uri=https://freelancercl.herokuapp.com&scope=r_liteprofile';
  console.log('AQUIII');
  const code = ctx.query.code || false;
  await ctx.render('users/show', {
    user,
    follow,
    offeringPostsList,
    searchingPostsList,
    submitFilePath: ctx.router.url('users.uploadFile', { id: user.id }),
    editUserPath: ctx.router.url('users.edit', { id: user.id }),
    sendMessagePath: ctx.router.url('messages.new', { id: user.id }),
    followPath: ctx.router.url('users.follow', { id: user.id }),
    deleteUserPath: ctx.router.url('users.delete', { id: user.id }),
    showOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.show', { pid: offeringPost.id }),
    showSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.show', { id: searchingPost.id }),
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
    linkedin,
  });
});

router.post('users.uploadFile', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const { img, CV } = ctx.request.files;
  if (img.name) {
    user.imagePath = `https://freelancercl.sfo2.digitaloceanspaces.com/${img.name}`;
    await fileStorage.upload(img);
  }
  if (CV.name) {
    user.cvPath = `https://freelancercl.sfo2.digitaloceanspaces.com/${CV.name}`;
    await fileStorage.upload(CV);
  }
  await user.save();
  ctx.redirect(ctx.router.url('users.show', { id: user.id }));
});

router.post('users.follow', '/:id/follow', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const follow = await ctx.orm.follow.findOne({
    where: { followedId: user.id, followerId: currentUser.id },
  });
  if (follow) {
    await follow.destroy();
  } else {
    const newFollow = ctx.orm.follow.build({ followedId: user.id, followerId: currentUser.id });
    await newFollow.save();
  }
  ctx.redirect(ctx.router.url('users.show', { id: user.id }));
});

module.exports = router;