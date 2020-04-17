module.exports = {
  up: (queryInterface) => {
    const reportsData = [
      {
        title: 'TEST REPORT',
        content: 'USUARIO A NO RESPETA NORMAS',
        reportingUserId: 1,
        reportedUserId: 2,
        reportedPost: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'TEST REPORT B',
        content: 'USUARIO C NO RESPETA NORMAS',
        reportingUserId: 2,
        reportedUserId: 3,
        reportedPost: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('reports', reportsData);
  },
  down: (queryInterface) => queryInterface.bulkDelete('reports', null, {}),
};
