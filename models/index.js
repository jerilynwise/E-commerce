// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKeyConstraint: true,
  onDelete: 'SET NULL'
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  foreignKeyConstraint: true,
  onDelete: 'SET NULL',
  onUpdate: 'SET NULL'
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  foreignKeyConstraint: true,
  onDelete: 'SET NULL',
  onUpdate: 'SET NULL'
});


// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  foreignKeyConstraint: true,
  onDelete: 'SET NULL',
  onUpdate: 'SET NULL'
});



module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
