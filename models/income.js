'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class income extends Model {
    static associate(models) {
      income.hasOne(models.budget, {
        foreignKey: 'incomeID',
        as: 'allocation',
        onDelete: 'CASCADE'
      });
    }
  }

  income.init({
    incomeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    month: {
      type: DataTypes.ENUM(
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ),
      allowNull: false,
      unique: true
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'income',
    tableName: 'income'
  });

  return income;
};