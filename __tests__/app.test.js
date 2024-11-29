const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const articles = require("../db/data/test-data/articles");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET: /api/topics", () => {
  test("200: Responds with all topics.", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
      {
        description: "Hey good looking, what you got cooking?",
        slug: "cooking",
      },
    ];
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(input.length).toBe(3);
        input.forEach((topic) => {
          // console.log(topic);
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });

  test("404: Responds with an error if the api link is invalid.", () => {
    return request(app).get("/api/topicz").expect(404);
  });
});

describe("/api/articles/ID", () => {
  test("test a 200 for a valid id", () => {
    return request(app).get("/api/articles/5").expect(200);
  });
  test("testing the right object keys return relating to the valid id", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "BODY");
        const { article } = body;
        // console.log(article, "ARTICLE TEST");
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("testing for a 404 for invalid id params.", () => {
    return request(app)
      .get("/api/articles/404")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Article not found",
        });
      });
  });
});

describe("get Articles with Comments - Updated for testing for sorting functionality in task 11 and 12.", () => {
  test("200: Should return articles sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("votes", { descending: false });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("200: Should return articles sorted by title in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("400: Should return an error for invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column&order=asc")
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe(
          "Invalid sorting category. Please sort by one of the following: author, title, article_id, topic, created_at, votes, comment_count."
        );
      });
  });

  test("400: Should return an error for invalid order", () => {
    request(app)
      .get("/api/articles?sort_by=created_at&order=invalid_order")
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe(
          "Invalid order, please choose from: asc or desc."
        );
      });
  });
});

// task 12 modifiers
describe("Adding in topic functionality to articles.", () => {
  test("200: Should return articles filtered by mitch topic only", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Testing for sort by and order, alongside a topic", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc&topic=mitch")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Testing that all articles are returned if there's no topic set", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("404: Should return an empty array for a topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=nonexistent_topic")
      .expect(404);
  });

  test("200: Returns an empty array if the topic is valid but there's no arrays", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
});

describe("Getting comments related to articles. Also included functionality for task 13.", () => {
  test("200: Checks that the article id goes to a live article.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments).toHaveLength(11);
        expect(body.comments[0]).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });

  test("200: Checks that article will correctly show the comments it is joined to.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.every((comment) => comment.article_id === 1)).toBe(
          true
        );
      });
  });

  test("200: Checks that the article id with no comments returns an empty array.", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  test("404: Rejects an article with an invalid article id.", () => {
    return request(app)
      .get("/api/articles/404/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  // task 13 test added here
  test("200: Responds with an article object including comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });
});

describe("Adding functionality for posting comments to articles.", () => {
  test("201: Successfully creating new comments.", () => {
    newComment = {
      body: "learn to code, journalist.",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "learn to code, journalist.",
          author: "butter_bridge",
        });
      });
  });
  test("400: Successfully rejects content with bad post object.", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request: Missing username and/or body");
      });
  });
  test("400: Successfully implement errors to prevent posting to bad article ids", () => {
    return request(app)
      .post("/api/articles/hi/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid ID, please use a number ID rather than a string."
        );
      });
  });
});
describe("PATCH articles to update votes", () => {
  test("200: Successfully patch an article via votes", () => {
    return request(app)
      .patch("/api/articles/1") // votes are currently present on the first test article.
      .send({ inc_votes: 10 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(110);
      });
  });
  test("200:Testing whether articles with no votes get votes.", () => {
    return request(app)
      .patch("/api/articles/2") // 2 currently does not have a votes block on it.
      .send({ inc_votes: 10 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(10);
      });
  });
  test("200: Should lower the votes of an article", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: -5 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(95);
      });
  });

  test("400: For invalid inc_votes value", () => {
    return request(app)
      .patch(`/api/articles/404`)
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid data type in endpoint");
      });
  });

  test("400: Should return 400 if votes are not provided", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input for POST/PATCH.");
      });
  });
});

describe("DELETE: deleting comments by ID", () => {
  test("204: Successfully deleting a comment that exists.", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 1`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  test("400: Cannot delete a comment that doesn't exist.", () => {
    return request(app)
      .delete("/api/comments/500")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Comment ID not found");
      });
  });
});

describe("GET: all users.", () => {
  test("200: Actually gets everything from the users table.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: test that error catches invalid user request endpoint", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - invalid url endpoint.");
      });
  });
});
