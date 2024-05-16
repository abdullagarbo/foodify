import View from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHanlerRenderBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(el) {
    const id = window.location.hash.slice(1);

    return `
        <li class="preview">
            <a 
                class="preview__link ${
                  el.id === id ? 'preview__link--active' : ''
                }"
                href="#${el.id}"
            >
                <figure class="preview__fig">
                    <img src="${el.image}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">
                        ${el.title}
                    </h4>
                    <p class="preview__publisher">${el.publisher}</p>
                </div>
            </a>
        </li>
    `;
  }
}

export default new BookmarksView();
