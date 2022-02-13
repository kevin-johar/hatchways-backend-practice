import fs from "fs";

export const fileToJSON = (path: string) => {
  let rawData = fs.readFileSync('data.json');
  return JSON.parse(rawData.toString());
};

export const JSONtoFile = (json, path: string) => {
  fs.writeFileSync(path, JSON.stringify(json));
};
