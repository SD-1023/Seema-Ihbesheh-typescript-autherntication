import { DataTypes, Sequelize } from 'sequelize';


        const UserModel = (sequelize: Sequelize) => {
          const User = sequelize.define('user', {
            email: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            password: {
              type: DataTypes.TEXT,
              allowNull: false,
            },
          });
        
          return User;
        };
        
        export default UserModel;
        