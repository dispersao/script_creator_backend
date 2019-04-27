// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const ScriptSequence = sequelizeClient.define('script_sequences', {
    index: {
      type: DataTypes.INTEGER,
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
  ScriptSequence.associate = function (models) {
    ScriptSequence.belongsTo(models['sequences'], {
    });
    ScriptSequence.belongsTo(models['scripts'], {
    });
  };

  return ScriptSequence;
};
