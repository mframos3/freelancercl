const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

const index = require('../routes/index');


router.use('/', index.routes());

router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  newRegisterPath: ctx.router.url('users.new'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    ctx.session.userId = user.id;
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.session.token = token;
    ctx.redirect(ctx.router.url('index.landing'));
  }
  return ctx.render('session/new', {
    email,
    createSessionPath: ctx.router.url('session.create'),
    error: 'Incorrect email or password',
  });
});

router.del('session.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});

module.exports = router;
