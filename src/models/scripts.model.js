// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;


module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Script = sequelizeClient.define('scripts', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  Script.associate = function (models) {
    Script.hasMany(models['script_sequences'], {
      as: 'script_sequences'
    });
    Script.belongsTo(models['users'], {
      as: 'author'
    });
    Script.belongsTo(models['users'], {
      as: 'last_editor'
    });
  };

  return Script;
};
