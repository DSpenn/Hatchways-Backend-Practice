const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
  res.send(
    'Use the API endpoint at <a href="https://localhost:3001/api">localhost:3001/api</a>'
  );
});
app.listen(3001, () => console.log('Express Server on port 3001!'));

var parsedRecipes = [];

async function dbRead() {
  try {
    data = fs.readFileSync('./db/recipes.json');
    parsedRecipes = JSON.parse(data);
  } catch {
    console.log(e);
  }
  return parsedRecipes
}

async function dbWrite(parsedRecipes) {
  try {
    fs.writeFile(
      './db/recipes.json',
      JSON.stringify(parsedRecipes, null, 4),
      (writeErr) =>
      writeErr ?
      console.error(writeErr) :
      console.info('Successfully updated!')
    );
  } catch {
    console.log(e);
  }
}

app.get('/recipes', (req, res) => {
  dbRead();
  const recipeNames = parsedRecipes.recipes.map((recipe) => recipe.name);
  //console.log('recipeNames', recipeNames);
  return res.json(recipeNames);
});

//http://localhost:3001/recipes/details/scrambledEggs
app.get('/recipes/details/:recipeName', (req, res) => {
  const requestedRecipe = req.params.recipeName.toLowerCase();

  if (requestedRecipe) {
    dbRead();

    for (let i = 0; i < parsedRecipes.recipes.length; i++) {
      if (requestedRecipe === parsedRecipes.recipes[i].name.toLowerCase()) {
        parsedRecipes.recipes[i].numSteps = parsedRecipes.recipes[i].instructions.length;
        return res.json(parsedRecipes.recipes[i]);
      }
    }
  }
  return res.json('No recipe found');
});


app.post('/recipes', (req, res) => {
  console.info(`${req.method} request received to add a recipe`);
  const {
    name,
    ingredients,
    instructions
  } = req.body;

  var found = false;
  if (name, ingredients, instructions) {
    const newRecipe = {
      name,
      ingredients,
      instructions
    };
    dbRead();

    let requestedRecipe = name.toLowerCase();
    if (requestedRecipe) {
      for (let i = 0; i < parsedRecipes.recipes.length; i++) {
        if (requestedRecipe === parsedRecipes.recipes[i].name.toLowerCase()) {
          found = true;
          let response = {
            status: 'error',
            body: 'Recipe already exists',
          };
          console.log(response);
          res.json(response);
        }
      }
    }
    if (!found) {
      parsedRecipes.recipes.push(newRecipe);

      dbWrite(parsedRecipes);

      let response = {
        status: 'success',
        body: newRecipe,
      };

      console.log(response);
      res.json(response);
    }

  }
});

app.put('/recipes', (req, res) => {
  console.info(`${req.method} request received`);
  const {
    name,
    ingredients,
    instructions
  } = req.body;

  var found = false;

  if (name, ingredients, instructions) {
    const newRecipe = {
      name,
      ingredients,
      instructions
    };

    dbRead();

    let requestedRecipe = name.toLowerCase();
    if (requestedRecipe) {
      for (let i = 0; i < parsedRecipes.recipes.length; i++) {
        if (requestedRecipe === parsedRecipes.recipes[i].name.toLowerCase()) {
          found = true;
          parsedRecipes.recipes.splice(i);
          parsedRecipes.recipes.push(newRecipe);

          dbWrite(parsedRecipes);

          let response = {
            status: 'success',
            body: newRecipe,
          };

          console.log(response);
          res.json(response);
        }
      }
    }
    if (!found) {
      let response = {
        status: 'error',
        body: 'Recipe does not exist"',
      };

      console.log(response);
      res.json(response);
    }
  } else {
    res.json('Error in posting');
  }
});
