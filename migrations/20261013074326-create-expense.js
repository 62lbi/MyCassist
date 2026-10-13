'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense', {
      expenseID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      budgetID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'budget',
          key: 'budgetID'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      category: {
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

  async down(queryInterface) {
    await queryInterface.dropTable('expense');
  }
};