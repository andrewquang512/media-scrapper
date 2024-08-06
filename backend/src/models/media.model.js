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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
    },
  },
  {
    tableName: 'media',
    timestamps: true,
  },
);

Media.bulkInsert = async (records) => {
  const media = await Media.bulkCreate(records);
  return media;
};

/**
 * @param {{video|image}} mediaType
 * @param {string} url
 * @param {number} page
 * @param {number} limit
 */
Media.findByMediaTypeAndUrl = async (url, mediaType, page = 1, limit = 10) => {
  const whereClause = {};

  if (mediaType === 'image' || mediaType === 'video') {
    whereClause.mediaType = mediaType;
  }
  if (url) {
    whereClause.url = url;
  }
  const offset = (page - 1) * limit;

  const result = await Media.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });
  return result;
};

module.exports = Media;
