// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const Character = require('./character.model');
// const Sequence = require('./sequence.model');
const CategoryCharacter = require('./categorycharacter.model');
// const CategorySequencePosition = require('./categorysequenceposition.model');



module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Categories = sequelizeClient.define('categories', {
    text: {
      type: DataTypes.STRING
    },
    type: {
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
  Categories.associate = function (models) {
    Categories.belongsToMany(Character(app), {
      foreignKey: 'categoryId',
      through: CategoryCharacter(app)
    });

    // Categories.belongsToMany(Sequence(app), {
    //   foreignKey: 'categoryId',
    //   through: CategorySequencePosition(app)
    // });
  };

  return Categories;
};
