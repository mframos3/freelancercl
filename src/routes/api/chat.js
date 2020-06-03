const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();

router.get('chat.chats', '/chats', async (ctx) => {
  const auxChatUsers = await ctx.orm.message.findAll({
    where: {
      [Op.or]: [
        { sender_id: ctx.session.userId },
        { receiver_id: ctx.session.userId },
      ],
    },
  });
  const promisesChatUsers = auxChatUsers.map(async (element) => {
    const newElement = element;
    if (element.sender_id === ctx.session.userId) {
      const user = await ctx.orm.user.findByPk(newElement.receiver_id);
      newElement.username = user.name;
      newElement.userImg = user.imagePath;
      newElement.userId = user.id;
    } else {
      const user = await ctx.orm.user.findByPk(newElement.sender_id);
      newElement.username = user.name;
      newElement.userImg = user.imagePath;
      newElement.userId = user.id;
    }
    return newElement;
  });
  const chatUsers = await Promise.all(promisesChatUsers);
  const auxData = {};
  chatUsers.forEach((element) => {
    if (!auxData[element.userId]) {
      auxData[element.userId] = {
        userid: element.userId,
        username: element.username,
        img: element.userImg,
      };
    }
  });
  const users = [];
  Object.keys(auxData).forEach((key) => {
    users.push(auxData[key]);
  });
  ctx.body = {
    status: 'success',
    data: { myuserid: ctx.session.userId, users },
  };
});

router.get('chat.history', '/history/:id', async (ctx) => {
  const auxActiveChatList = await ctx.orm.message.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { sender_id: ctx.params.id },
            { receiver_id: ctx.session.userId },
          ],
        },

        {
          [Op.and]: [
            { sender_id: ctx.session.userId },
            { receiver_id: ctx.params.id },
          ],
        },
      ],

    },
  });
  const promisesActiveChatList = auxActiveChatList.map(async (element) => {
    const newElement = element;
    if (element.sender_id === ctx.session.userId) {
      const user = await ctx.orm.user.findByPk(newElement.receiver_id);
      newElement.username = user.name;
      newElement.userImg = user.imagePath;
      newElement.userId = user.id;
    } else {
      const user = await ctx.orm.user.findByPk(newElement.sender_id);
      newElement.username = user.name;
      newElement.userImg = user.imagePath;
      newElement.userId = user.id;
    }
    return newElement;
  });
  const activeChatList = await Promise.all(promisesActiveChatList);
  if (activeChatList.length > 0) {
    const auxData = {};
    activeChatList.forEach((element) => {
      if (auxData[element.userId]) {
        auxData[element.userId].history.push({
          content: element.content,
          createdAt: element.createdAt,
          sender_id: element.sender_id,
        });
      } else {
        auxData[element.userId] = {
          userid: element.userId,
          myuserid: ctx.session.userId,
          username: element.username,
          img: element.userImg,
          history: [],
        };
        auxData[element.userId].history.push({
          content: element.content,
          createdAt: element.createdAt,
          sender_id: element.sender_id,
        });
      }
    });
    const data = [];
    Object.keys(auxData).forEach((key) => {
      data.push(auxData[key]);
    });
    data.forEach((element) => {
      element.history.sort((a, b) => b.createdAt - a.createdAt);
    });
    ctx.body = {
      status: 'success',
      data: data[0].history,
    };
  } else {
    ctx.body = {
      status: 'success',
      data: [],
    };
  }
});

router.post('chat.save', '/save', async (ctx) => {
  const req = ctx.request.body.data;
  const message = ctx.orm.message.build(
    {
      sender_id: req.sender,
      receiver_id: req.receiver,
      content: req.content,
    },
  );
  try {
    await message.save({ fields: ['sender_id', 'receiver_id', 'content'] });
    ctx.body = {
      status: 'success',
    };
  } catch (validationError) {
    ctx.body = {
      status: 'error',
    };
  }
});

router.get('chat.userdirectory', '/directory', async (ctx) => {
  const aux = await ctx.orm.user.findAll();
  const usersList = aux.map((element) => ({
    userid: element.id,
    username: element.name,
    img: element.imagePath,
  }));
  ctx.body = {
    status: 'sucess',
    data: usersList,
  };
});

module.exports = router;
