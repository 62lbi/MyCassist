'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense', { //changed from expenses to expense manually
      expenseID: { //added this manually
        type: Sequelize.INTEGER, 
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budgetID: { //added this manually too
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'budget', //tells the system that we're trying to use budget model
          key: 'budgetID' //and in that budget model, use budgetID PK as a FK here.
        },
        onUpdate: 'CASCADE', //this means if an budget record id is updated, its associated expense is updated too.
        onDelete: 'CASCADE'//this means if an budget record id is deleted, its associated expense is deleted too.
      },
      category: { //changed this from string to ENUM manually
        type: Sequelize.ENUM('entertainment', 'foodNeeds', 'miscellaneous'),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('expense');
  }
};