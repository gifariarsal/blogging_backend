'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "userId" });
      this.belongsTo(models.blogCategory, { foreignKey: "categoryId" });
      this.belongsTo(models.blogCountry, { foreignKey: "countryId" });
    }
  }
  blog.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    imgBlog: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    keywords: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    countryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};