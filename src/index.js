import './css/styles.css';
import { fetchCountries } from './news-service/countries';
import debounce from 'debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const descriptionEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
listEl.addEventListener('click', onCountryClick);

function onCountryClick(e) {
  if (!e.target.closest('li')) {
    return;
  }
  fetchCountries(e.target.dataset.name).then(arr => {
    markupCountriesTest(arr);
    removeEventListener('click', onCountryClick);
  });
  // console.log(e.target.tagName, e.target.dataset.name);
}

function onInputChange(e) {
  document.querySelector('.lds-ring').classList.remove('is-hiden');
  descriptionEl.innerHTML = '';
  listEl.innerHTML = '';
  if (!e.target.value.trim()) {
    document.querySelector('.lds-ring').classList.add('is-hiden');
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(arrCuntries => {
      if (arrCuntries.length > 10) {
        throw new Error(
          Notiflix.Notify.warning(
            `Too many matches found. Please enter a more specific name.`
          )
        );
      }
      const murk = markupCountries(arrCuntries);
      addMarkupOnPage(murk);
      document.querySelector('.lds-ring').classList.add('is-hiden');
      return arrCuntries;
    })
    .then(arrCuntries => {
      if (arrCuntries.length !== 1) {
        throw new Error(error);
      }
      addMarkupOnPage2(markupCountry(arrCuntries));
      document.querySelector('.img').classList.add('big-img');
    })
    .catch(err => {
      document.querySelector('.lds-ring').classList.add('is-hiden');
      console.log(err);
    });
}

function markupCountries(arrCuntries) {
  return arrCuntries
    .map(({ name, flags: { svg } }) => {
      return `
    <li class='country'>
      <img data-name="${name}" class="img" src="${svg}" 
      data-name="${name}"
      alt="" width="100">
      <p data-name="${name}" class="name-countries">${name}</p>
    </li>
    `;
    })
    .join('');
}

function markupCountry(arrCuntries) {
  return arrCuntries
    .map(({ capital, languages, population, currencies }) => {
      console.log(currencies);
      const leng = languages.map(el => {
        return el.name;
      });
      return `
<ul class="list-info">
  <li class="list"><span class="name">Capital</span> - ${capital}</li>
  <li class="list"><span class="name">Population</span> - ${population}</li>
  <li class="list"><span class="name">Languages</span> - ${leng.join(', ')}</li>
</ul>
  `;
    })
    .join('');
}

function addMarkupOnPage(markup) {
  listEl.innerHTML = markup;
}

function addMarkupOnPage2(markup) {
  descriptionEl.innerHTML = markup;
}

Notiflix.Notify.init({
  width: '380px',
  position: 'center-top',
  distance: '110px',
  timeout: 3000,
});

//////
function markupCountriesTest(arrCuntries) {
  const markup = arrCuntries

    .map(
      ({
        name,
        capital,
        languages,
        population,
        flags: { svg },
        currencies,
        callingCodes,
        region,
      }) => {
        const leng = languages.map(el => {
          return el.name;
        });
        return `
    <li class='country big-country'>
      <img data-name="${name}" class="img" src="${svg}" 
      data-name="${name}"
      alt="" width="1000">
      <p data-name="${name}" class="name-countries">${name}</p>
      <div> Capital - ${capital}</div>
      <div> languages - ${leng.join(', ')}</div>
      <div> Population - ${population}</div>
      <div> Currency - ${currencies[0].name}</div>
      <div> Callingcode - ${callingCodes}</div>
      <div> Region - ${region}</div>
    </li>
    `;
      }
    )
    .join('');
  listEl.innerHTML = markup;
  descriptionEl.innerHTML = '';
}
