const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')
const mongoose = require('mongoose');
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
      references: {
          model: 'user',
          key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: DataTypes.DATE,
      required: true,
    },
  },
  {
    tableName: 'token',
    timestamps: true,
  }
);

module.exports = Token;
