module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserProject', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      project_id:{
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      user_id:{
        type: DataTypes.INTEGER(11),
        allowNull: true
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
      tableName: 'user_project' // THIS LINE HERE
    });
  };
    