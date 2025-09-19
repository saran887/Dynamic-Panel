const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Logo = sequelize.define('Logo', {
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Logo;
