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
      calendar = 'https://min-prices.aviasales.ru/calendar_preload';

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
            return  item.name.match(inputRegExp);  //не реализован полный функционал
        });

        filterCity.sort(function(a, b) {
            if (a.name < b.name) return -1;
            if (b.name < a.name) return 1; 
          return 0;
        });
        console.log(filterCity);
        

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
};


const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
    
};

//Отсортируем массив с билетами по цене от меньшего к большему
const renderCheapYear = (cheapTickets) => {
    cheapTickets.sort(function (a, b) {
        return a.value - b.value; 
    });
    console.log(cheapTickets);
};


const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    }) 
    
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};


//Отправляем запрос к API для получения списка городов 
//и фильтруем список, оставляя города, имеющие название в поле name
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => item.name)
});


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


formSearch.addEventListener('submit', () => {
    event.preventDefault();
    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = city.find((item) => inputCitiesTo.value === item.name);

    //Проверяем, что пользователь ввел валидные названия городов
    if (cityFrom && cityTo) {
        const formData = {
            from: cityFrom.code,
            to: cityTo.code,
            when: inputDateDepart.value,
        }
    
        const requestData = `?dapart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`
    
            getData(calendar + requestData, (response) => {
                renderCheap(response, formData.when);
            })
        
    } else {
        console.log('Извините, город не найден');
    }
    
});