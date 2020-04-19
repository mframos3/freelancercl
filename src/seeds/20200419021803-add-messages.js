module.exports = {
  up: (queryInterface) => {
    const messagesData = [
      {
        sender_id: 1,
        receiver_id: 2,
        content: 'Holaa!!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_id: 2,
        receiver_id: 1,
        content: 'Oli, khe tal?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_id: 1,
        receiver_id: 2,
        content: 'Bien bien y tu?!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('messages', messagesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('messages', null, {}),
};
