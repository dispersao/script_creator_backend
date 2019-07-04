// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const CategorySequencePosition = sequelizeClient.define('categories_sequences_positions', {
    index: {
      type: DataTypes.INTEGER
    }
  },{
    timestamps: false
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });
  CategorySequencePosition.associate = function (models) {
    CategorySequencePosition.belongsTo(models['sequences'], {
    });
    CategorySequencePosition.belongsTo(models['categories'], {
    });
  };


  // eslint-disable-next-line no-unused-vars
  return CategorySequencePosition;
};
