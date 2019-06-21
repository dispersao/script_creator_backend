// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Type = require('./type.model');
const Location = require('./location.model');
const Part = require('./part.model');


module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Sequence = sequelizeClient.define('sequences', {
    isPlaying:  { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hasPlayed:  { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sceneNumber:  { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.INTEGER, defaultValue: 0 }
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
  Sequence.associate = function (models) {

    Sequence.belongsTo(Location(app), {
      // foreignKey: 'locationId',
      // as: 'location'
    });

    Sequence.belongsTo(Type(app), {
      // foreignKey: 'typeId',
      // as: 'type'
    });

    Sequence.hasMany(Part(app), {
    });
    models['parts'].associate(models);
  };



  return Sequence;
};
