const KoaRouter = require('koa-router');

const sendLoginAlertEmail = require('../mailers/login-alert');

const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

const router = new KoaRouter();

router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    await sendLoginAlertEmail(ctx, { user });
    ctx.session.userId = bcrypt.hashSync(toString(user.id), PASSWORD_SALT);
    return ctx.redirect(ctx.router.url('messages.list'));
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
