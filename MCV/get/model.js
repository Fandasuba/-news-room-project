const db = require("../../db/connection");

exports.getTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.getArticlesById = (article_id) => {
  // console.log("getArticlesModel");
  return db
    .query(
      `SELECT CAST(COUNT(comments.article_id) AS INTEGER)AS comment_count, articles.* FROM articles 
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE comments.article_id = $1
GROUP BY articles.article_id;`,
      [article_id]
    )
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

exports.getAllArticles = async (sort_By, order, topic) => {
  const validTopics = await findTopics();

  async function findTopics() {
    const result = await db.query(`SELECT * FROM topics;`);
    return result.rows.map((row) => row.slug);
  }

  const validCategories = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (sort_By === undefined || sort_By === null) {
    sort_By = "created_at";
  }

  if (order === undefined || order === null) {
    order = "desc";
  }

  if (!validCategories.includes(sort_By)) {
    throw {
      status: 400,
      msg: `Invalid sorting category. Please sort by one of the following: ${validCategories.join(
        ", "
      )}.`,
    };
  }

  if (!validOrder.includes(order)) {
    throw {
      status: 400,
      msg: "Invalid order, please choose from: asc or desc.",
    };
  }
  if (topic && !validTopics.includes(topic)) {
    throw {
      status: 404,
      msg: `Topic '${topic}' not found.`,
    };
  }

  let queryStr = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, 
    articles.created_at, articles.article_img_url, articles.votes,
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  const queryParams = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryStr += ` 
    GROUP BY articles.article_id
    ORDER BY ${sort_By} ${order};
  `;

  try {
    const result = await db.query(queryStr, queryParams);
    return result.rows;
  } catch (err) {
    throw { status: 500, msg: "Internal Server Error" };
  }
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
    .then(({ rows }) => {
      // console.log(rows);
      return rows;
    });
};

exports.getUsers = () => {
  // console.log(" IN GET USERS");
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
