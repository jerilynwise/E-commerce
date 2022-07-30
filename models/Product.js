// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

//define colums
Product.init(
  {
    //id column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    //define product name column
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //makes a price colums that ensure it is in decimal format
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal:true
      }
    },
    //stock column
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isNumeric: true
      }
    },
    //category id column that references the category model
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
