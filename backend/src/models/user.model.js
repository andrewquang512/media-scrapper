const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'user',
    timestamps: true,
  }
);


module.exports = User;
