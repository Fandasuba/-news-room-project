const { patchArticleByID } = require("../patch/patch-model");

exports.patchArticles = (req, res, next) => {
  //   console.log("controller");
  const { article_id } = req.params;
  // console.log(req.params);
  console.log(article_id);
  const { inc_votes } = req.body;
  //console.log(req.body);
  console.log(inc_votes);
  patchArticleByID(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => next(err));
};
