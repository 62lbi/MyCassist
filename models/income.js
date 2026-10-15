'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class income extends Model {
    static associate(models) {
      income.hasOne(models.budget, {
        foreignKey: 'incomeID',
        as: 'allocation', //for future me, this is something new that i learnt, allocation?
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, // added this new row for income.controller.js in 15/10/2026
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'income', //for future me, this is something new that i learnt.. we can refer the database to income than incomes (standard)
    tableName: 'income'
  });

  return income;
};