// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const ScriptSequence = require('./scriptsequence.model');


module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Script = sequelizeClient.define('scripts', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author:{
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
  };

  return Script;
};
