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

app.get('/recipes', (req, res) => {
  fs.readFile('./db/recipes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedRecipes = JSON.parse(data);
      console.log('parsedRecipes', parsedRecipes);

      const recipeNames = parsedRecipes.recipes.map((recipe) => recipe.name);
      console.log('recipeNames', recipeNames);
      return res.json(recipeNames);
    }
  });
});

//http://localhost:3001/recipes/details/scrambledEggs
app.get('/recipes/details/:recipeName', (req, res) => {
  const requestedRecipe = req.params.recipeName.toLowerCase();

  if (requestedRecipe) {
    let rawdata = fs.readFileSync('./db/recipes.json');
    const recipes = JSON.parse(rawdata);

    for (let i = 0; i < recipes.recipes.length; i++) {
      if (requestedRecipe === recipes.recipes[i].name.toLowerCase()) {
        recipes.recipes[i].numSteps = recipes.recipes[i].instructions.length;
        return res.json(recipes.recipes[i]);
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
    fs.readFile('./db/recipes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedRecipes = JSON.parse(data);
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

          fs.writeFile(
            './db/recipes.json',
            JSON.stringify(parsedRecipes, null, 4),
            (writeErr) =>
            writeErr ?
            console.error(writeErr) :
            console.info('Successfully updated!')
          );
          let response = {
            status: 'success',
            body: newRecipe,
          };

          console.log(response);
          res.json(response);
        }

      }
    });
  } else {
    res.json('Error in posting');
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
    fs.readFile('./db/recipes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedRecipes = JSON.parse(data);
        let requestedRecipe = name.toLowerCase();
        if (requestedRecipe) {
          for (let i = 0; i < parsedRecipes.recipes.length; i++) {
            if (requestedRecipe === parsedRecipes.recipes[i].name.toLowerCase()) {
              found = true;
              parsedRecipes.recipes.splice(i);
              parsedRecipes.recipes.push(newRecipe);

              fs.writeFile(
                './db/recipes.json',
                JSON.stringify(parsedRecipes, null, 4),
                (writeErr) =>
                writeErr ?
                console.error(writeErr) :
                console.info('Successfully updated!')
              );
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
            body: 'Recipe not found',
          };

          console.log(response);
          res.json(response);
        }

      }
    });
  } else {
    res.json('Error in posting');
  }
});
