'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  income.init({
    incomeID: { //added incomeID manually, this doesnt exist before.
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    month: { //changed from string to ENUM
      type: DataTypes.ENUM('January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER, 
      allowNull: false //added not allowed null manually
    },
    budget: {
      type: DataTypes.INTEGER, 
      allowNull: false //addded not allowed null manually
    }
  }, {
    sequelize,
    modelName: 'income', //hello future me if ur seeing this, as we know that sequelize automatically pluralize a models table's name, we can set it manually or make it behave to not pluralize it by this line underneath it, its something new i learnt.
    tableName: 'income'
  });
  return income;
};