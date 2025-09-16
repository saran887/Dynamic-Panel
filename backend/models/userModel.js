const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const user =sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    }
}, {
  tableName: 'users', 
  timestamps: false   
});
module.exports = user;