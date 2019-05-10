// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const scriptSequences = sequelizeClient.define('script_sequences', {
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

  console.log(scriptSequences);

  // eslint-disable-next-line no-unused-vars
  scriptSequences.associate = function (models) {
    scriptSequences.belongsTo(models['sequences'], {
    });
    scriptSequences.belongsTo(models['scripts'], {
    });
  };

  return scriptSequences;
};
