'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comments.init({
    commentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    nickname: DataTypes.STRING,
    comment: DataTypes.STRING,
    createdAt : DataTypes.DATE,
    updatedAt : DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};