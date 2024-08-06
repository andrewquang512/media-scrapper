const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 8);
        }
      },
    },
  },
);

User.isEmailTaken = async function (email) {
  const user = await this.findOne({ where: { email } });
  return !!user;
};

User.findById = async function (id) {
  const user = await this.findOne({ where: { id } });
  return user;
};

User.isPasswordMatch = async function (password, encryptedPassword) {
  return bcrypt.compare(password, encryptedPassword);
};

module.exports = User;
