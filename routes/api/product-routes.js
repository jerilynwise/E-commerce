const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products includes category and tag info
router.get('/', (req, res) => {
  Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    include: [{ model: Category}, {model: Tag}]
  })
  .then(dbData => res.json(dbData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// get one product includes assocated category and tag info
router.get('/:id', (req, res) => {
  const result = [];
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
  })
  .then(product => {
    if (!product) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    if(product.category_id === null){
      return product
    }else if(product.category_id !== null){
      result.push(product.dataValues)
      return Category.findOne({ where: { id: product.category_id } });
    }
  })
  .then (data =>{
    result.push(data.dataValues)
    if (!data) {
      res.status(404).json({ message: 'No data found with this id' });
      return;
    }
    return ProductTag.findAll({ where: { product_id: req.params.id }});
  })
  .then (productTags =>{
     if (!productTags) {
      res.status(404).json({ message: 'No productTags found with this id' });
      return;
    }
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    return Tag.findAll({where: { id: productTagIds }})
  })
  .then((results) => {
    const productTags = results.map((tag)=> tag.dataValues);
    result.push(productTags)
    res.json(result)})
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

  // delete one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbData => {
    if (!dbData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.json({ message: 'Product delete it' });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
