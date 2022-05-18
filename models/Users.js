module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Users', {
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      username:{
        type: DataTypes.STRING(255),
        allowNull: true,
        unique:true
      },
      name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique:true
      },
      role:{
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      designation:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      password:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      // confirm_password:{
      //   type: DataTypes.STRING(255),
      //   allowNull: true
      // },
      image:{
        type: DataTypes.STRING(255),
        allowNull:true
      },
      mobile:{
        type: DataTypes.STRING(255),
        allowNull:true
      },
      status:{
        type: DataTypes.ENUM('Yes','No','Blocked'),
        defaultValue: 'No',
        allowNull: false
      },
      createdBy: {
        type: DataTypes.STRING(255),
        allowNull:true
      },
      updatedBy:{
        type: DataTypes.STRING(255),
        allowNull:true
      } 
    },{
      tableName: 'users' // THIS LINE HERE
    });
  };
    