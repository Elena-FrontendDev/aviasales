const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = formSearch.querySelector('.input__cities-from');
const dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from');
const inputCitiesTo = formSearch.querySelector('.input__cities-to');
const dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');
const inputDateDepart = formSearch.querySelector('.input__date-depart');

const city = ['Москва', 'Санкт-Петербург', 'Волгоград', 'Минск', 'Караганда', 'Калининград', 'Керчь'];


// Функция для фильтра массива городов 
// и вывода списка в соответствии с вводом пользователя в поле input

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
    
        const filterCity = city.filter((item) => {
            const inputRegExp = new RegExp(input.value, 'gi');
            return item.match(inputRegExp);
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        });
    }
};

// Обработчик для поля ввода 'Откуда'

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});


// Обработчик для выбора города и записи его названия в поле ввода 'Откуда'

dropdownCitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = target.textContent;
        dropdownCitiesFrom.textContent = '';
    }
});


// Обработчик для поля ввода 'Куда'
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});


// Обработчик для выбора города и записи его названия в поле ввода 'Куда'

dropdownCitiesTo.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesTo.value = target.textContent;
        dropdownCitiesTo.textContent = '';
    }
});