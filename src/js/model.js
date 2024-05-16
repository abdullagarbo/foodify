import { API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './views/helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPagination = function (page = state.search.page) {
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  state.search.page = page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addRemoveBookmark = function (recipe) {
  // Add or remove recipe from bookmarks
  if (recipe.bookmarked) {
    state.bookmarks = state.bookmarks.filter(
      bookmark => bookmark.id !== recipe.id
    );

    // Mark recipe as NOT bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  } else {
    state.bookmarks.push(recipe);
    // Mark recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  }

  // update localStorage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
