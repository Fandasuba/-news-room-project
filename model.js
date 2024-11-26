const db = require("./db/connection");
exports.getTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.getArticles = (article_id) => {
  console.log(article_id, "MODEL 1");
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows } = results) => {
      // console.log(rows, "INSIDE MODEL");
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 - Error not found" });
      }
      return rows[0];
    });
};
