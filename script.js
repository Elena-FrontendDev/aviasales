//Получаем данные со стрницы
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');

//Данные для запроса API
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      API_KEY = '0404e801598ae131dc37024a3a474d82',
      calendar = 'http://min-prices.aviasales.ru/calendar_preload';

//Параметры для запроса
const options = {
    origin: 'SVX',
    destination: 'KGD',
    depart_date: '2020-05-25',
    one_way: true
}

let city = [];

//Получаем список всех городов
const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if(request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
};


// Функция для фильтра массива городов 
// и вывода списка в соответствии с вводом пользователя в поле input
const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
    
        const filterCity = city.filter((item) => {
            const inputRegExp = new RegExp(input.value, 'gi');
            return item.name.match(inputRegExp);
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
};


//Функция для записи выбранного пользователем города в поле ввода
const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
}


//Отправляем запрос к API для получения списка городов 
//и фильтруем список, оставляя города, имеющие название в поле name
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => item.name)
});


//Класс для получения ответа от API календаря цен по параметрам запроса 
class FlightPrice {
    constructor (calendarUrl, options) {
        this.url = calendarUrl;
        this.origin = options.origin;
        this.destination = options.destination;
        this.depart_date = options.depart_date;
        this.one_way = options.one_way;
    }

    getPrice() {
        return fetch(`${this.url}?origin=${this.origin}&destination=${this.destination}&depart_date=${this.depart_date}&one_way=${this.one_way}`
        )
          .then((res) => {
                if (res.ok) {
                return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
          })
    } 
}

const flightPrice = new FlightPrice(calendar, options);

//Обращаемся к методу класса для получения данных по запросу к API
flightPrice.getPrice()
    .then((res) => {
        console.log(res);
    })
    .catch((err)=> {
        console.log(`Ошибка: ${err}`);
    })


// Обработчик для поля ввода 'Откуда'
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});


// Обработчик для поля ввода 'Куда'
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});


// Обработчик для выбора города и записи его названия в поле ввода 'Откуда'
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});


// Обработчик для выбора города и записи его названия в поле ввода 'Куда'
dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});