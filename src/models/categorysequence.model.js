// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
// const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const CategorySequence = sequelizeClient.define('category_sequences', {
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
  return CategorySequence;
};
