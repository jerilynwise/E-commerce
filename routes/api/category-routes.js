const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

//get all categoires and products associated
router.get('/', (req, res) => {
  Category.findAll({
    include: [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }]
  })
  .then(dbData => res.json(dbData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//get one category and the products associated
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }]
  })
  .then(dbData => {
    if (!dbData) {
      res.status(404).json({ message: 'Try again, no category with this id found!' });
      return;
    }
    res.json(dbData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//post request to create a new category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name  
  })
  .then(dbData => 
    res.json(dbData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(dbData => {
    if (!dbData[0]) {
      res.status(404).json({ message: 'No Category found with this id' });
      return;
    }
    res.json(
      res.json({ message: 'Category updated'}))
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

 // delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbData => {
    console.log(dbData)
    if (!dbData) {
      res.status(404).json({ message: 'No Category found with this id' });
      return;
    }
    res.json(
      res.json({message: 'Category deleted'}))
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
