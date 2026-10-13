'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budget', {
      budgetID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      incomeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'income',
          key: 'incomeID'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      entertainment: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      foodNeeds: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      miscellaneous: {
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
    await queryInterface.dropTable('budget');
  }
};