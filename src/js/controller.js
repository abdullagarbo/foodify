import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipe';
import searchView from './views/search';
import resultsView from './views/results';
import paginationView from './views/pagination';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // get recipe id from hash...
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResult(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPagination(3));

    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const init = function () {
  recipeView.addHanlerRender(controlRecipes);
  searchView.addHanlerSearch(controlSearchResults);
};

init();
