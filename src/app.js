const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const koaFlashMessage = require('koa-flash-message').default;
const koaStatic = require('koa-static');
const render = require('koa-ejs');
const session = require('koa-session');
const override = require('koa-override-method');
const jsonApiSerializer = require('jsonapi-serializer');

// App constructor
const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const assets = require('./assets');
const mailer = require('./mailers');
const routes = require('./routes');
const orm = require('./models');

const developmentMode = app.env === 'development';

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  'saying he is logged in when it\'s really not',
];

// expose ORM through context's prototype
app.context.orm = orm;

app.context.jsonSerializer = function jsonSerializer(type, options) {
  return new jsonApiSerializer.Serializer(type, options);
};

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env;
  return next();
});

// log requests
app.use(koaLogger());

// webpack middleware for dev mode only
if (developmentMode) {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const koaWebpack = require('koa-webpack');
  koaWebpack()
    .then((middleware) => app.use(middleware))
    .catch(console.error); // eslint-disable-line no-console
}

app.use(koaStatic(path.join(__dirname, '..', 'build'), {}));

// expose a session hash to store information across requests from same client
app.use(session({
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
}, app));

// flash messages support
app.use(koaFlashMessage);

// parse request body
app.use(koaBody({
  multipart: true,
  keepExtensions: true,
}));

app.use((ctx, next) => {
  ctx.request.method = override.call(ctx, ctx.request.body.fields || ctx.request.body);
  return next();
});

// Configure EJS views
app.use(assets(developmentMode));
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'html.ejs',
  cache: !developmentMode,
});

mailer(app);

// Routing middleware
app.use(routes.routes());

io.on('connection', (socket) => {
  console.log('CONNETINO!');

  socket.on('join', ({ myId, userId }) => {
    console.log(`JOINETTI ${myId} : ${userId}`);
    console.log([myId, userId].sort((a, b) => a - b).join(':'));
    socket.join([myId, userId].sort((a, b) => a - b).join(':'));
  });

  socket.on('sendMessage', (message, callback) => {
    console.log(`MESAGETI ${message.sender}, ${message.receiver}: ${message.content}`);
    console.log([message.sender, message.receiver].sort((a, b) => a - b).join(':'));
    io.to([message.sender, message.receiver].sort((a, b) => a - b).join(':')).emit('message',
      { sender_id: message.sender, content: message.content, createdAt: message.createdAt });
    callback();
  });

  socket.on('leave', ({ myId, userId }) => {
    console.log(`LEAVES ${myId} : ${userId}`);
    socket.leave([myId, userId].sort((a, b) => a - b).join(':'));
  });


  socket.on('disconnect', () => {
    console.log('DISCONETTI!');
  });
});

module.exports = server;
