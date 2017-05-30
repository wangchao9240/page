let Category = require('../models/category.js');
let Movie = require('../models/movie.js');

// category admin
exports.categoryAdmin = (req, res) => {
  res.render('categoryAdmin', {
    title: 'website 后台分类录入页',
    category: {}
  });
};

// category save
exports.save = (req, res) => {
  let _category = req.body.category;
  let id = _category.id;
  if (id) {
    Category.findOneAndUpdate({_id: id}, {name: _category.name}, (err) => {
      if (err) console.log(err);
      res.redirect('/');
    });
  } else {
    let category = new Category(_category);
    category.save((err, category) => {
      if (err) console.log(err);
      res.redirect('/admin/categorylist');
    });
  }
};

// category list
exports.list = (req, res) => {
  Category.fetch((err, categories) => {
    if (err) console.log(err);
    res.render('categoryList', {
      title: 'website 分类列表页',
      categories: categories
    });
  });
};

// category update
exports.update = (req, res) => {
  let id = req.params.id
  Category.findById(id, (err, category) => {
    res.render('categoryAdmin', {
      title: 'website 后台分类更新页',
      category: category
    });
  });
};

// category delete
exports.delete = async (req, res) => {
  let id = req.query.id;
  try {
    let cateRes = await Category.findOne({_id: id});
    let movieIdArr = [];
    if (cateRes.movies && cateRes.movies.length !== 0) {
      cateRes.movies.forEach((movieId) => {
        movieIdArr.push(movieId);
      });
      await Movie.updateMany({_id: {$in: movieIdArr}}, {$pull: {category: id}});
    }
    await Category.remove({_id: id});
    res.send({success: 1});
  } catch (err) {
    console.log(err);
  }
};