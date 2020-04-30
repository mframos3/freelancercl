const KoaRouter = require('koa-router');
const sgMail = require('../config/emailApi');
const msg = require('../mailers/login-email-Api');

const router = new KoaRouter();


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
    msg.to = email;
    sgMail.send(msg).then(() => {}, (error) => {
      console.error(error);
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
