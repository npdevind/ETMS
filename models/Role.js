module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Role', {
      role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      role_name:{
        type: DataTypes.STRING(255),
        allowNull: true,
        unique:true
      },
      status:{
        type: DataTypes.ENUM('Active','Inactive'),
        defaultValue: 'Active',
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
      tableName: 'role' // THIS LINE HERE
    });
  };
    