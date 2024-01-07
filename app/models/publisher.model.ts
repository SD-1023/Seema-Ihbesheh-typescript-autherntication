import { DataTypes, Sequelize } from 'sequelize';

const PublisherModel = (sequelize: Sequelize) => {
  const Publisher = sequelize.define('publisher', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Publisher;
};

export default PublisherModel;
