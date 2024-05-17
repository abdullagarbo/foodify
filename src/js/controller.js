import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipe';
import searchView from './views/search';
import resultsView from './views/results';
import paginationView from './views/pagination';
import bookmarksView from './views/bookmarks';
import addRecipeView from './views/addrecipe';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // get recipe id from hash...
    const id = window.location.hash.slice(1);

    if (!id) return;

    // render spinner while fetching the recipe
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.render(model.getSearchResultsPagination());

    // update bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // fetch the recipe
    await model.loadRecipe(id);

    // Render the recipe view
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlServings = function (newServing) {
  // update the recipe servings in the state
  model.updateServings(newServing);

  // update the recipe view
  recipeView.render(model.state.recipe);
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResult(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPagination());

    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPagination(goToPage));
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // Add or remove recipe from bookmarks
  model.addRemoveBookmark(model.state.recipe);

  // update the recipe view
  recipeView.render(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const controlBookmarks = function () {
  // List bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHanlerRenderBookmarks(controlBookmarks);
  recipeView.addHanlerRenderRecipe(controlRecipes);
  recipeView.addHanlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  searchView.addHanlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
};

init();
