'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    static associate(models) {
      expense.belongsTo(models.budget, {
        foreignKey: 'budgetID'
      });
    }
  }

  expense.init({
    expenseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    budgetID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('entertainment', 'foodNeeds', 'miscellaneous'),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'expense', //for future me, this is something new that i learnt.. we can refer the database to expense than expenses (standard)
    tableName: 'expense'
  });

  return expense;
};