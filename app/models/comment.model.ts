import { DataTypes, Sequelize } from 'sequelize';
//const CommentModel = (sequelize: Sequelize, DataTypes: typeof import('sequelize/types/lib/data-types')) => {

const CommentModel = (sequelize: Sequelize ) => {
  const Comment = sequelize.define('comment', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER, // Use FLOAT for stars if you want decimal values
      allowNull: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Comment;
};

export default CommentModel;
