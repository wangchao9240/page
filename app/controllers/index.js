let Category = require('../models/category.js');
let Movie = require('../models/movie.js');

// index page
exports.index = (req, res) => {
  Category
    .find({})
    .populate({
      path: 'movies',
      options: { limit: 6 }
    })
    .exec((err, categories) => {
      if (err) console.log(err);
      res.render('index', {
        title: 'website 首页',
        categories: categories
      });
    });
};

// search
exports.search = async (req, res) => {
  const showNum = 2;
  let categoryId = req.query.cate;
  let pageNum = req.query.p || 1;
  let idx = (pageNum - 1) * showNum;

  if (categoryId) {
    try {
      let categoryRes = await Category
        .findOne({_id: categoryId})
        .populate({
          path: 'movies'
        });
      let movies = categoryRes.movies || [];
      let results  = movies.slice(idx, idx + showNum);
      let totalPage = Math.ceil(movies.length / showNum);
      res.render('results', {
        title: 'website 结果列表页',
        movies: results,
        currentPage: pageNum,
        query: `cate=${categoryId}`,
        keyword: categoryRes.name,
        totalPage: totalPage
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    let q = req.query.q;
    let movieRes = await Movie.find({title: new RegExp(q, 'i')});
    let results = movieRes.slice(idx, idx +  showNum);

    res.render('results', {
      title: 'website 结果列表页',
      keyword: q,
      currentPage: pageNum,
      query: `q=${q}`,
      movies: results,
      totalPage: Math.ceil(movieRes.length / showNum)
    });
  }
};