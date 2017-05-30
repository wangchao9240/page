let Movie = require('../models/movie.js');
let Comment = require('../models/comment.js');
let Category = require('../models/category.js');
let _ = require('lodash');
let fs = require('fs');
let path = require('path');

// detail page
exports.detail = async (req, res) => {
  let id = req.params.id;
  try {
    await Movie.update({_id: id}, {$inc: {pv: 1}});
    let movieRes = await Movie.findById(id);
    let commentRes = await Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name');
    console.log('comments-->', commentRes);
    res.render('detail', {
      title: `immoc ${movieRes.title}`,
      movie: movieRes,
      comments: commentRes
    });
  } catch(err) {
    console.log(err);
  }
};

// admin page
exports.admin = (req, res) => {
  Category.find({}, (err, categories) => {
    res.render('admin', {
      title: 'website 后台录入页',
      movie: {},
      categories: categories
    });
  });
};

// admin update
exports.update = (req, res) => {
  let id = req.params.id;
  if (id) {
    Category.find({}, (err, categories) => {
      Movie.findById(id, (err, movie) => {
        res.render('admin', {
          title: 'website 后台更新页',
          movie: movie,
          categories: categories
        });
      });
    });
  }
};

// admin poster
exports.savePoster = (req, res, next) => {
  let posterData = req.files.uploadPoster;
  let filePath = posterData.path;
  let originalFilename = posterData.originalFilename;
  if (originalFilename) {
    fs.readFile(filePath, (err, fileData) => {
      let timestamp = Date.now();
      let type = posterData.type.split('/')[1];
      let poster = `${timestamp}.${type}`;
      let newPath = path.join(__dirname , '../../', `/public/upload/${poster}`);
      fs.writeFile(newPath, fileData, (err) => {
        if (err) console.log(err);
      });
      req.poster = `/upload/${poster}`;
      next();
    });
  } else {
    next();
  }
};

// admin post movie
exports.new = async (req, res) => {
  let id = req.body.movie._id;
  let movieObj = req.body.movie;
  let haveNew = false;

  // 如果通过文件上传了海报
  if (req.poster) {
    movieObj.poster = req.poster;
  }

  if (movieObj.categoryName) {
    let cateRes = await Category.findOne({name: movieObj.categoryName});
    if (!cateRes) {
      let addCateObj = {
        name: movieObj.categoryName,
      };
      if (id) {
        addCateObj.movies = [id];
      }
      // 拿到新创建的
      let addCategory = new Category(addCateObj);
      await addCategory.save();

      // 向movieObj中的category添加数据
      if (!Array.isArray(movieObj.category)) {
        let addCateArr = [addCategory._id.toString()];
        if (movieObj.category) {
          addCateArr.push(movieObj.category);
        }
        movieObj.category = addCateArr;
      } else {
        movieObj.category.push(addCategory._id);
      };
      haveNew = true;
    } else {
      // 如果填写的是本来就有的
      if (!Array.isArray(movieObj.category)) {
        let addCateArr = [cateRes._id.toString()];
        if (movieObj.category) {
          addCateArr.push(movieObj.category);
        }
        movieObj.category = addCateArr;
      } else {
        movieObj.category.push(addCategory._id);
      };
    }
    delete movieObj.categoryName;
  }
  if (id) {
    try {
      let movieFindRes = await Movie.findById(id);
      let originalCateId = movieFindRes.category;
      let _movie = _.assign(movieFindRes, movieObj);
      let changedCateId = _movie.category;
      let changeLen = changedCateId.length;
      let cateIdArr = [];
      let movieRes = await _movie.save();
      if (movieRes.category && movieRes.category.length !== 0) {
        // 遍历当前电影的分类数据，将当前电影的所属分类加到数组中
        movieRes.category.forEach(async (categoryId) => {
          cateIdArr.push(categoryId);
        });
        if (haveNew) {
          changeLen = changedCateId.length - 1;
        }
        // 通过cateId先后的长度，判断是增加分类还是减少分类
        if (originalCateId.length > changeLen) {
          // 将id转化为字符串，否则无法比较
          let originStrArr = [];
          let changeStrArr = [];
          originalCateId.forEach((item) => {
            originStrArr.push(item.toString());
          });
          changedCateId.forEach((item) => {
            changeStrArr.push(item.toString());
          });
          _.pullAll(originStrArr, changeStrArr);
          // 拿到要删除的movieId的分类Id
          await Category.updateMany({_id: {$in: originStrArr}}, {$pull: {movies: id}});
        } else {
          // 通过数组中的分类id，添加或删除对应分类下的电影id
          await Category.updateMany({_id: {$in: cateIdArr}}, {$addToSet: {movies: id}});
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    delete movieObj._id;
    let categoryId = movieObj.category;
    let _movie = new Movie(movieObj);
    let cateIdArr = [];
    try {
      let movieRes = await _movie.save();
      if (movieRes.category && movieRes.category.length !== 0) {
        movieRes.category.forEach(async (categoryId) => {
          cateIdArr.push(categoryId);
        });
        await Category.updateMany({_id: {$in: cateIdArr}}, {$addToSet: {movies: movieRes._id}});
      }
    } catch (err) {
      console.log(err);
    }
  }
  res.redirect('/admin/movie/list');
};

// list page
exports.list = (req, res) => {
  Movie.fetch((err, movies) => {
    res.render('list', {
      title: 'website 列表页',
      movies: movies
    });
  });
};

// list delete movie
exports.delete = async (req, res) => {
  let id = req.query.id;
  if (id) {
    try {
      let cateIdArr = [];
      let movieObj = await Movie.findOne({_id: id});
      if (movieObj.category && movieObj.category.length !== 0) {
        movieObj.category.forEach((categoryId) => {
          cateIdArr.push(categoryId);
        });
        await Category.updateMany({_id: {$in: cateIdArr}}, {$pull: {movies: id}});
      }
      await Movie.remove({_id: id});
      res.send({success: 1});
    } catch (err) {
      console.log(err);
    }
  }
};