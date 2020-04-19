const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next) {
  ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
  return next();
}

router.get('messages.list', '/', async (ctx) => {
  const messagesList = await ctx.orm.message.findAll();
  await ctx.render('messages/index', {
    messagesList,
    newMessagePath: ctx.router.url('messages.new'),
    editMessagePath: (message) => ctx.router.url('messages.edit', { id: message.id }),
    deleteMessagePath: (message) => ctx.router.url('messages.delete', { id: message.id }),
  });
});

router.get('messages.new', '/new', async (ctx) => {
  const message = ctx.orm.message.build();
  await ctx.render('messages/new', {
    message,
    submitMessagePath: ctx.router.url('messages.create'),
  });
});

router.post('messages.create', '/', async (ctx) => {
  const message = ctx.orm.message.build(ctx.request.body);
  try {
    await message.save({ fields: ['sender_id', 'receiver_id', 'content'] });
    ctx.redirect(ctx.router.url('messages.list'));
  } catch (validationError) {
    await ctx.render('messages/new', {
      message,
      errors: validationError.errors,
      submitMessagePath: ctx.router.url('messages.create'),
    });
  }
});

router.get('messages.edit', '/:id/edit', loadMessage, async (ctx) => {
  const { message } = ctx.state;
  await ctx.render('messages/edit', {
    message,
    submitMessagePath: ctx.router.url('messages.update', { id: message.id }),
  });
});

router.patch('messages.update', '/:id', loadMessage, async (ctx) => {
  const { message } = ctx.state;
  try {
    const { senderId, receiverId, content } = ctx.request.body;
    await message.update({ senderId, receiverId, content });
    ctx.redirect(ctx.router.url('messages.list'));
  } catch (validationError) {
    await ctx.render('messages/edit', {
      message,
      errors: validationError.errors,
      submitMessagePath: ctx.router.url('messages.update', { id: message.id }),
    });
  }
});

router.del('messages.delete', '/:id', loadMessage, async (ctx) => {
  const { message } = ctx.state;
  await message.destroy();
  ctx.redirect(ctx.router.url('messages.list'));
});

module.exports = router;
