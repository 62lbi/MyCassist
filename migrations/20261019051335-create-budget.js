'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budget', {
      budgetID: { //added budgetID manually
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      incomeID: { //added the attributes + foreign key (references:)
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'income', //this means from the income model
          key: 'incomeID' // and from that income model its from the incomeID PK, since this is an external model using an other PK, its FK
        },
        onUpdate: 'CASCADE', //this means if an income record id is updated, its associated budget is updated too.
        onDelete: 'CASCADE' //this means if an income record id is deleted, its associated budget is deleted too.
      },
      entertainment: { //added allownull manually
        type: Sequelize.INTEGER,
        allowNull: false
      },
      foodNeeds: { //added allownull manually
        type: Sequelize.INTEGER,
        allowNull: false
      },
      miscellaneous: { //added allownull manually
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
    await queryInterface.dropTable('budget');
  }
};