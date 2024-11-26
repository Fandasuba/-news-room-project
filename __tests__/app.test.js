const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const articles = require("../db/data/test-data/articles");

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
    S;
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
      .get("/api/articles/404") // Assuming 404 is an ID that doesn't exist
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "404 - Error not found",
        });
      });
  });
});
