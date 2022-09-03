import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
  searchForm: document.querySelector('#search-box'),
};

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchName = refs.searchForm.value.trim();
  if (searchName === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchName)
    .then(countries => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        refs.countryList.innerHTML = createCountryList(countries);
        refs.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        refs.countryInfo.innerHTML = createCountryInfo(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      return error;
    });
}

function createCountryInfo(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
    <img src="${flags.svg}" alt="flag" width="40px">
    <h1 class="country-name">${name.official}</h1>
    <p class="country-text"><b>Capital:</b> ${capital}</p>
    <p class="country-text"><b>Population:</b> ${population}</p>
    <p class="country-text"><b>Languages:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  return markup;
}

function createCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
     <li>
    <img src="${flags.svg}" alt="flag" width="30px">
    <h2 class="country-name">${name.official}</h2>
    </li>
 `;
    })
    .join('');
  return markup;
}
