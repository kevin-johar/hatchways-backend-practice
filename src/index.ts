import express from "express";
import bodyParser from 'body-parser';
import { fileToJSON, JSONtoFile } from "./utilities";
const port = 3000;
const app = express();
import { FileData, Recipe } from "./types"

// Needed for parsing JSON data in POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get("/recipes", (req, res, next) => {
  let data: FileData =  fileToJSON("data.json");
  let recipeNames: string[] = data.recipes.map((recipe) => recipe.name);

  res.send({
    recipeNames
  }, 200);
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
    res.send(201);
    console.log("Working");
  } else {
    res.send({
      error: "Recipe already exists"
    }, 400);
  }
});

app.put("/recipes", (req, res, next) => {
  const rawData: FileData = fileToJSON("data.json");
  const updatedRecipe: Recipe = req.body;

  const toUpdate = rawData.recipes.findIndex((recipe) => recipe.name === updatedRecipe.name);
  if(toUpdate === -1) {
    res.send({
      error: "Recipe does not exist"
    }, 404);
  }
  rawData.recipes[toUpdate] = updatedRecipe;
  JSONtoFile(rawData, "data.json");

  res.send(204);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
