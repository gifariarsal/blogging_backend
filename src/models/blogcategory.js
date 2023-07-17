'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blogCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.blog, { foreignKey: "categoryId" });
    }
  }
  blogCategory.init({
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'blogCategory',
  });
  return blogCategory;
};