import express from "express";
import bodyParser from 'body-parser';
import { FileData, Recipe } from "./types"
import { fileToJSON, JSONtoFile } from './utilities';

let path = "data.json";
const app = express();

// Needed for parsing JSON data in POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    path = "src/__tests__/resources/test-data.json";
  }
  next();
});

app.get("/recipes", (req, res, next) => {
  let data: FileData =  fileToJSON("data.json");
  let recipeNames: string[] = data.recipes.map((recipe) => recipe.name);

  res.status(200).send({
    recipeNames
  });
});

app.get("/recipes/details/:recipe", (req, res, next) => {
  let data: FileData = fileToJSON("data.json");
  let recipe: Recipe = data.recipes.find((recipe) => recipe.name == req.params.recipe);

  let finalData = !!recipe ? {
    details: {
      ingredients: recipe?.ingredients,
      numSteps: recipe?.instructions?.length
    }
  }: {};

  res.send(finalData)
});

app.post("/recipes", (req, res, next) => {
  const rawData: FileData = fileToJSON("data.json");
  const newRecipe: Recipe = req.body;

  if(rawData.recipes.findIndex((recipe) =>
    recipe.name === newRecipe.name) === -1) {
    rawData.recipes.push(req.body);
    JSONtoFile(rawData, "data.json");
    res.status(201);
    console.log("Working");
  } else {
    res.status(400).send({
      error: "Recipe already exists"
    });
  }
});

app.put("/recipes", (req, res, next) => {
  const rawData: FileData = fileToJSON("data.json");
  const updatedRecipe: Recipe = req.body;

  const toUpdate = rawData.recipes.findIndex((recipe) => recipe.name === updatedRecipe.name);
  if(toUpdate === -1) {
    res.status(404).send({
      error: "Recipe does not exist"
    });
  }
  rawData.recipes[toUpdate] = updatedRecipe;
  JSONtoFile(rawData, "data.json");

  res.status(204);
});

export default app;
