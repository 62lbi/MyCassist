'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class budget extends Model {
    static associate(models) {
      //One budget belongs to one income record
      budget.belongsTo(models.income, { //added this manually, one to one relation
        foreignKey: 'incomeID',
        as: 'income'
      });
      //One budget can have many expenses
      budget.hasMany(models.expense, { //added this manually, one to many relation
        foreignKey: 'budgetID',
        as: 'expenses', // why is it expenses and not expense?
        onDelete: 'CASCADE'
      });
    }
  }
  budget.init({
    budgetID: { //added budgetID manually
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    incomeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    entertainment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    foodNeeds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    miscellaneous: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'budget', //hello future me if ur seeing this, as we know that sequelize automatically pluralize a models table's name, we can set it manually or make it behave to not pluralize it by this line underneath it, its something new i learnt.
    tableName: 'budget'
  });
  return budget;
};