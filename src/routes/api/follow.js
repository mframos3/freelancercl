const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function computeFollowers(ctx) {
  const user = await ctx.orm.user.findByPk(ctx.params.id);
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const followersList = await ctx.orm.follow.findAll({ where: { followedId: user.id } });
  const followedList = await ctx.orm.follow.findAll({ where: { followerId: user.id } });
  const followersCU = await ctx.orm.follow.findAll({ where: { followedId: currentUser.id } });
  const followedCU = await ctx.orm.follow.findAll({ where: { followerId: currentUser.id } });
  // console.log(typeof (followersList));
  // console.log(followedList.length);
  currentUser.cFollowers = followersCU.length;
  currentUser.cFollowed = followedCU.length;
  user.cFollowers = followersList.length;
  user.cFollowed = followedList.length;
  user.save({ fields: ['cFollowers', 'cFollowed'] });
  currentUser.save({ fields: ['cFollowers', 'cFollowed'] });
}

router.get('/:id', async (ctx) => {
  // console.log('probando');
  const user = await ctx.orm.user.findByPk(ctx.params.id);
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const follow = await ctx.orm.follow.findOne({
    where: { followedId: user.id, followerId: currentUser.id },
  });
  if (follow) {
    ctx.body = {
      status: 'success',
      data: [true, user, currentUser],
    };
  } else {
    ctx.body = {
      status: 'success',
      data: [false, user, currentUser],
    };
  }
});

router.get('users.follow', '/:id/follow', async (ctx) => {
  // console.log('entré');
  const user = await ctx.orm.user.findByPk(ctx.params.id);
  const currentUser = await (ctx.session.userId && ctx.orm.user.findByPk(ctx.session.userId));
  const follow = await ctx.orm.follow.findOne({
    where: { followedId: user.id, followerId: currentUser.id },
  });
  if (follow) {
    await follow.destroy();
    ctx.body = {
      status: 'success',
      data: [false, user, currentUser],
    };
  } else {
    const newFollow = ctx.orm.follow.build({ followedId: user.id, followerId: currentUser.id });
    await newFollow.save();
    ctx.body = {
      status: 'success',
      data: [true, user, currentUser],
    };
  }
  computeFollowers(ctx);
});

module.exports = router;
