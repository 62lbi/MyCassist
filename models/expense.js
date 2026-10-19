'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    static associate(models) {
      //many expenses belongs to one budget
      expense.belongsTo(models.budget, { //added this relation manually- many to one
        foreignKey: 'budgetID',
        as: 'budget'
      });
    }
  }
  expense.init({
    expenseID: { //added expenseID manually
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    budgetID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: { //changed from string to ENUM
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
    modelName: 'expense',
    tableName: 'expense' //hello future me if ur seeing this, as we know that sequelize automatically pluralize a models table's name, we can set it manually or make it behave to not pluralize it by this line underneath it, its something new i learnt.
  });
  return expense;
};