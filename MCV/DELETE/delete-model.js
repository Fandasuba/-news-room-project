const db = require("../../db/connection");

exports.deleteCommentsById = (comment_Id) => {
  // console.log(comment_Id, "CHECKING ID");
  if (!comment_Id) {
    return Promise.reject({ status: 400, msg: "Enter a valid comment ID" });
  }

  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_Id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Comment ID not found" });
      }
    });
};
