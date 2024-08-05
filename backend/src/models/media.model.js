const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed

// Define the Media model
const Media = sequelize.define(
  'Media',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'media',
    timestamps: true,
  },
);

module.exports = Media;
