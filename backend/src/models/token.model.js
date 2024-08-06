const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { tokenTypes } = require('../config/tokens');

const Token = sequelize.define(
  'token',
  {
    token: {
      index: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      enum: [tokenTypes.REFRESH],
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'token',
    timestamps: true,
  },
);

module.exports = Token;
