'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('income', {
      incomeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      month: { //changed from string to ENUM & not allowed to be null
        type: Sequelize.ENUM('January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ), allowNull: false
      },
      year: { //added not allowed null manually
        type: Sequelize.INTEGER,
        allowNull: false
      },
      budget: { //added not allowed null manually
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('income', { //added a custom constraint for month and year, so the grey key image on the database is totally normal.
      fields: ['month', 'year'],
      type: 'unique',
      name: 'unique_income_month_year'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('income');
  }
};