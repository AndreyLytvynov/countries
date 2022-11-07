import Notiflix from 'notiflix';

const BASE_URL = 'https://restcountries.com/v2';
const options = {};

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages,currencies,callingCodes,region`,
    options
  ).then(response => {
    if (!response.ok) {
      // listEl.innerHTML = '';
      throw new Error(
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
    }
    return response.json();
  });
}
