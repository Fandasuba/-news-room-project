const db = require("../../db/connection");

exports.getTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.getArticlesById = (article_id) => {
  // console.log("getArticlesModel");
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    })
    .catch((err) => {
      if (err.status === 404) {
        return Promise.reject(err);
      }
      // console.error(err);
      return Promise.reject({ status: 500, msg: "Internal Server Error" });
    });
};

exports.getAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes,
      COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      //   console.error(err);
      throw { status: 500, msg: "Internal Server Error" };
    });
};

exports.getCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id 
        FROM comments 
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then(({ rows }) => rows);
};
