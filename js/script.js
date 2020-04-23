window.addEventListener('DOMContentLoaded', function () {

    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    //скрыть табы
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }

    });

    // Timer 

    let deadline = '2022-04-21';

    function getTimeRemaining(endtime) {
        //получаем разницу
        let t = Date.parse(endtime) - Date.parse(new Date()),
            //секунды, минуты, часы. округляем - Math.floor
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60)));

        //для дней
        //hours = Math.floor((t / 1000 / 60 / 60) % 24),
        //days = Math.floor((t / (1000 * 60 * 60 * 24)));

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            function addZero(num) {
                if (num <= 9) {
                    return '0' + num;
                } else return num;
            };

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }

    }

    setClock('timer', deadline);

    //Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function () {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function () {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });
    // form
    //объект в котором содержаться различные состояния запроса
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };
    //получаем переменнные для работы
    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');
    //прописываем запрос
    //запрос отправляется по клику на кнопку
    //В ЛЮБОЙ форме, для отправки данных необходимо чтобы было либо button либо inputTypeSubmint и при клике запрос отправляется на сервер

    //вешаем обработчик событий именно на форму,а не на кнопку
    //submit - подтверждение нашей формы
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        //чтобы оповестить пользователя о состоянии запроса создаём повую переменную
        form.appendChild(statusMessage);

        //запрос для отправки данных на сервер
        let request = new XMLHttpRequest();
        //настраиваем запрос
        request.open('POST', 'server.php');
        //настраиваем заголовки http
        //он говорит, что наш контент будет содержать данные которые получены из формы application / x - www - form - urlencoded
        //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        //Изменения для передачи в формате JSON
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        //чтобы получить все данные которые ввёл пользователь в инпуты в форме необходимо воспользоваться объектом formData
        //в него и поместиться вся инфа от пользователя
        let formData = new FormData(form);

        //если необходимо передавать информацию в формате JSON
        //переводим объект formData - в обычный читаемый объект
        let obj = {};
        formData.forEach(function (value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);
        //И внутрь new FormData() добавляем форму из которой мы хотим достать все данные которые ввёл пользователь
        //методом send() отправляем наш запрос на сервер. в него мы передаём formData - те данные которые ввёл пользователь
        request.send(jsonц);

        //наблюдение за состояниями нашего запроса readystatechenge
        // Получение содержимого элемента
        //var content = element.innerHTML;

        // Установка содержимого для элемента
        //element.innerHTML = content;
        //request.readyState === 4 && request.status == 200 - иначе если наш запрос полностью ушёл, то мы будем производить действия
        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        //автоматическое очищение input после отправки формы
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    });
});






// Message

//let age = document.getElementById('age');

//function showUser(surname, name) {
//    alert("Пользователь " + surname + " " + name + ", его возраст " + this.value);
//}

//showUser.apply(age, ["Горький", "Максим"]);