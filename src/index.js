import './styles.css';
import '@pnotify/core/dist/BrightTheme.css';
import countriesList from "../templates/countries.hbs"
import countryCard  from "../templates/country.hbs"
import _ from 'lodash'
const { alert, notice, info, success, error } = require('@pnotify/core');

const countryContainer = document.getElementById('country')
const input = document.getElementById('input')
const countriesElemList = countryContainer.querySelectorAll('.countries')

const basicUrl = 'https://restcountries.eu/rest/v2';

input.addEventListener('input', _.debounce(function(e) {
    e.preventDefault()
    const inputCountry = input.value
    foundCountryRequest(inputCountry)
     if(input.value.length === 0){
         countryContainer.innerHTML = ''
    };
}, 700))
    

function foundCountryRequest(country) {
    const searchContries = fetch(`${basicUrl}/name/${country}`)

    searchContries
        .then(response => {
            console.log(response);
            if (!response.ok) {
            throw new Error('Error!')
            }
            return response.json()
        })
        .then(countries => {
            
            if (countries.length === 1) {
                console.log(countries);
                const countryEl = countryCard(...countries)
                countryContainer.innerHTML = countryEl
            }
            else if (countries.length > 1 && countries.length <= 10) {
                const countryElements = countriesList(countries)
                countryContainer.innerHTML = countryElements;
                
                countryContainer.addEventListener('click', function (e) {
                                 if (e.target.classList.contains("countries")) {
                                     input.value = e.target.innerText
                                    const inputCountry = input.value
                                    foundCountryRequest(inputCountry)
                                    }   
                                })
                
            }
            else if (countries.length > 10) {
                error({
                    text: "Too much matches. Enter a more specific query!",
                    delay: 1000
                })
            }
        })
        .catch(err => {
            countryContainer.innerHTML = ''
            if (input.value.length !== 0) {
                error({
                    text: "We can not find this country!",
                    delay: 1000
                })
            }    
        } )
}




