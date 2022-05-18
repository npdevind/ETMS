module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Projects', {
      project_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      project_name:{
        type: DataTypes.STRING(255),
        allowNull: true,
        unique:true
      },
      project_des:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      status:{
        type: DataTypes.ENUM('Active','Inactive'),
        defaultValue: 'Inactive',
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
      tableName: 'projects' // THIS LINE HERE
    });
  };
    