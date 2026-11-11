
'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class saving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // One saving record belongs to one budget.
      saving.belongsTo(models.budget, {
        foreignKey: 'budgetID',
        as: 'budget'
      });
    }
  }

  saving.init({
    savingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    budgetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    savingMoney: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'saving',
    tableName: 'saving'
  });

  return saving;
};
