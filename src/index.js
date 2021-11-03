import './sass/main.scss';
import API from './js/fetchCountries';

import countryList from '../templates/countriesList.hbs';
import countryCard from '../templates/country.hbs';

import '@pnotify/core/dist/BrightTheme.css';
const { error } = require('@pnotify/core');
var debounce = require('lodash.debounce');

import getRefs from './js/refs';
const refs = getRefs();
refs.inputSearch.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  e.preventDefault();
  const searchQuery = e.target.value;
  if (searchQuery === '') {
		return;
	}
  hideCountryList();

  API.fetchCountries(searchQuery)
    .then(onSearchQuery)
    .catch(error => console.log(error))
}

function onSearchQuery(searchList) {
  if (searchList.length > 10) {
    error({
        text: "Найдено слишком много совпадений. Пожалуйста, введите более конкретный запрос!",
        delay: 250,
    });
  } else if (searchList.status === 404) {
    error({
      text: "Страна не найдена. Пожалуйста, введите более конкретный запрос!",
      delay: 250,
    });
  } else if (searchList.length === 1) {
    renderCountryList(searchList, countryCard);
  } else if (searchList.length <= 10) {
    renderCountryList(searchList, countryList);
  }
}
  
function renderCountryList(countries, name) {
  const markup = countries.map(country => name(country)).join(' ');
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}

function hideCountryList() {
  refs.cardContainer.innerHTML = '';
}