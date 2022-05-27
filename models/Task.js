module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Task', {
      task_id: {
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
      module_name:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      task:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      start_time:{
        type: DataTypes.TIME,
        allowNull: true
      },
      end_time:{
        type: DataTypes.TIME,
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
      tableName: 'task' // THIS LINE HERE
    });
  };
    