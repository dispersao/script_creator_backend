// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const PartCharacter = require('./partcharacter.model');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Part = sequelizeClient.define('parts', {
    content: DataTypes.TEXT,
    type: DataTypes.STRING,
    extra: DataTypes.STRING,
    index: DataTypes.INTEGER,
  },{
    timestamps: false
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  Part.associate = function (models) {
    Part.belongsToMany(models['characters'], {
      foreignKey: 'partId',
      through: PartCharacter(app)
    });
  };

  return Part;
};
