export interface FileData {
  recipes: Recipe[]
}

export interface Recipe {
  name: string,
  ingredients: string[],
  instructions: string[],
}
