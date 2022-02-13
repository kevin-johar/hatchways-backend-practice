import request from "supertest";
import app from "../index";
import fs from 'fs';

describe("Get Recipes", () => {
  it('Return all recipes', (done) => {
    request(app)
      .get('/recipes')
      .expect(200)
      .expect((res) => {
        const testData = fs.readFileSync("src/__tests__/resources/get-recipes-data.json");
        res.body = testData;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
