import { DataTypes, Sequelize } from 'sequelize';



const SessionModel = (sequelize: Sequelize) => {
  const Session = sequelize.define('session', {
    session: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Session;
};

export default SessionModel;
