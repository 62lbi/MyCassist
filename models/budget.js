'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class budget extends Model {
    static associate(models) {
      budget.belongsTo(models.income, {
        foreignKey: 'incomeID'
      });
    }
  }

  budget.init({
    budgetID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
    modelName: 'budget',
    tableName: 'budget'
  });

  return budget;
};