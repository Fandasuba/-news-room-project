const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const articles = require("../db/data/test-data/articles");
const jestSorted = require("jest-sorted");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

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
    // const input = articles;
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

  describe("get Articles with Comments", () => {
    test("200: getting all valid articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });
        });
    });
    test("200: returns all articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(Array.isArray(articles)).toBe(true);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
            expect(article).not.toHaveProperty("body");
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  test("404: testing that the already built 404 catch catches this endpoint if misstyped.", () => {
    return request(app).get("/api/articlez").expect(404);
  });
});

describe("Getting comments related to articles.", () => {
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
    //
    return request(app)
      .get("/api/articles/404/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
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
