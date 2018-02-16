'use strict';
module.exports = function(sequelize, DataTypes) {
  var Goals = sequelize.define('Goals', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isDone: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      tableName: 'goals',
      freezeTableName: true,
      associate: function(models) {
        Goals.belongsTo(models.User, {
          foreignKey: {allowNull: false}
        })
      },
      /* MODEL METHODS */
      /**
       * find thread.id by thread.slug
       * @param {string} slug thread.slug
       * @returns thread.id
       */
      findIdBySlug(slug) {
        return Goals
          .findOne({ where: { slug } })
          .then(thread => thread && thread.get('id'))
      }
    }
  });
  return Goals;
};