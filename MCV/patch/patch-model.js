const db = require("../../db/connection");

exports.patchArticleByID = (article_Id, inc_votes) => {
  // console.log("model");
  console.log(article_Id);
  console.log(inc_votes);
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_Id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return result.rows[0];
    });
};
