const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;
const { Op } = Sequelize;

const Fuse = require('fuse.js');

const fileStorage = require('../services/file-storage');
const sgMail = require('../config/emailApi');
const msg = require('../mailers/login-email-Api');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}

router.get('users.list', '/', async (ctx) => {
  const result = ctx.request.query;
  let term = result.search;
  const options = {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    // includeMatches: false,
    // findAllMatches: true,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    useExtendedSearch: true,
    keys: [{ name: 'dataValues.email', weight: 2 }, { name: 'dataValues.name', weight: 1.5 }, { name: 'dataValues.occupation', weight: 0.3 }],
  };
  if (!term) {
    term = '';
  }
  const usersList = await ctx.orm.user.findAll();
  const fuse = new Fuse(usersList, options);
  let searchResult = fuse.search("'" + term);
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
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    const {
      name, email, password, occupation,
    } = ctx.request.body;
    const cryptPassword = bcrypt.hashSync(password, PASSWORD_SALT);
    const emailRevisado = await ctx.orm.user.findOne({ where: { email } });
    if (emailRevisado == null) {
      await user.save({
        name, email, cryptPassword, occupation,
      });
      msg.to = email;
      sgMail.send(msg).then(() => {}, (error) => {
        if (error.response) {
          console.error(error.response.body);
        }
      });
      (async () => {
        try {
          await sgMail.send(msg);
        } catch (error) {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      })();
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
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
    backPath: ctx.router.url('users.show', { id: user.id }),
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
    ctx.redirect(ctx.router.url('users.list'));
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
  ctx.redirect(ctx.router.url('users.list'));
});

router.get('users.show', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const follow = await ctx.orm.follow.findOne({
    where: { followedId: user.id, followerId: currentUser.id },
  });
  const offeringPostsList = await ctx.orm.offeringPost.findAll({
    where: { userId: { [Op.eq]: user.id } },
  });
  const searchingPostsList = await ctx.orm.searchingPost.findAll({
    where: { userId: { [Op.eq]: user.id } },
  });
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
    backPath: ctx.router.url('users.list'),
    showOfferingPostPath: (offeringPost) => ctx.router.url('offeringPosts.show', { pid: offeringPost.id }),
    showSearchingPostPath: (searchingPost) => ctx.router.url('searchingPosts.show', { id: searchingPost.id }),
    newSearchingPostPath: ctx.router.url('searchingPosts.new'),
    newOfferingPostPath: ctx.router.url('offeringPosts.new'),
  });
});

// router.post('users.unfollow', '/:id', loadUser, async (ctx) => {
//   const { user } = ctx.state;
//   // const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
//   // // const follow = ctx.orm.follow.build({ followedId: user.id, followerId: currentUser.id });
//   // const follow = await ctx.orm.follow.findOne({
//   //   where: { followedId: user.id, followerId: currentUser.id },
//   // });
//   // await follow.delete();
//   const a = await ctx.orm.follow.findAll();
//   console.log(a);
//   console.log('hola');
//   ctx.redirect(ctx.router.url('users.show', { id: user.id }));
// });

router.post('users.follow', '/:id', loadUser, async (ctx) => {
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
  const a = await ctx.orm.follow.findAll();
  console.log(a);
  ctx.redirect(ctx.router.url('users.show', { id: user.id }));
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

module.exports = router;
