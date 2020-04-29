window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    let tab = document.querySelectorAll(".info-header-tab"),
        info = document.querySelector(".info-header"),
        tabContent = document.querySelectorAll(".info-tabcontent");

    //скрыть табы
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove("show");
            tabContent[i].classList.add("hide");
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains("hide")) {
            tabContent[b].classList.remove("hide");
            tabContent[b].classList.add("show");
        }
    }

    info.addEventListener("click", function (event) {
        let target = event.target;
        if (target && target.classList.contains("info-header-tab")) {
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

    let deadline = "2022-04-21";

    function getTimeRemaining(endtime) {
        //получаем разницу
        let t = Date.parse(endtime) - Date.parse(new Date()),
            //секунды, минуты, часы. округляем - Math.floor
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor(t / (1000 * 60 * 60));

        //для дней
        //hours = Math.floor((t / 1000 / 60 / 60) % 24),
        //days = Math.floor((t / (1000 * 60 * 60 * 24)));

        return {
            total: t,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector(".hours"),
            minutes = timer.querySelector(".minutes"),
            seconds = timer.querySelector(".seconds"),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            function addZero(num) {
                if (num <= 9) {
                    return "0" + num;
                } else return num;
            }

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = "00";
                minutes.textContent = "00";
                seconds.textContent = "00";
            }
        }
    }

    setClock("timer", deadline);

    //Modal

    let more = document.querySelector(".more"),
        overlay = document.querySelector(".overlay"),
        close = document.querySelector(".popup-close");

    more.addEventListener("click", function () {
        overlay.style.display = "block";
        this.classList.add("more-splash");
        document.body.style.overflow = "hidden";
    });

    close.addEventListener("click", function () {
        overlay.style.display = "none";
        more.classList.remove("more-splash");
        document.body.style.overflow = "";
    });

    // form

    //объект в котором содержаться различные состояния запроса
    let message = {
        loading: "Загрузка...",
        success: "Спасибо! Скоро мы с вами свяжемся!",
        failure: "Что-то пошло не так...",
    };
    //получаем переменнные для работы
    let form = document.querySelector(".main-form"),
        input = form.getElementsByTagName("input"),
        statusMessage = document.createElement("div");

    statusMessage.classList.add("status");
    //прописываем запрос
    //запрос отправляется по клику на кнопку
    //В ЛЮБОЙ форме, для отправки данных необходимо чтобы было либо button либо inputTypeSubmint и при клике запрос отправляется на сервер

    //вешаем обработчик событий именно на форму,а не на кнопку
    //submit - подтверждение нашей формы
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        //чтобы оповестить пользователя о состоянии запроса создаём повую переменную
        form.appendChild(statusMessage);

        //запрос для отправки данных на сервер
        let request = new XMLHttpRequest();
        //настраиваем запрос
        request.open("POST", "server.php");
        //настраиваем заголовки http
        //он говорит, что наш контент будет содержать данные которые получены из формы application / x - www - form - urlencoded
        //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        //Изменения для передачи в формате JSON
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");

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
        request.send(json);

        //наблюдение за состояниями нашего запроса readystatechenge
        // Получение содержимого элемента
        //var content = element.innerHTML;

        // Установка содержимого для элемента
        //element.innerHTML = content;
        //request.readyState === 4 && request.status == 200 - иначе если наш запрос полностью ушёл, то мы будем производить действия
        request.addEventListener("readystatechange", function () {
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
            input[i].value = "";
        }
    });

    //Slider

    //Параметр текущего слайда (Слайд который показывается)
    let slideIndex = 1,
        slides = document.querySelectorAll(".slider-item"),
        prev = document.querySelector(".prev"),
        next = document.querySelector(".next"),
        dotsWrap = document.querySelector(".slider-dots"),
        dots = document.querySelectorAll(".dot");

    showSlides(slideIndex);

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        //скроем слайды
        //1 способ
        slides.forEach((item) => (item.style.display = "none"));
        //второй способ
        //for (let i = 0; i < slides.length; i++) {
        //    slides[i].style.display = 'none';
        //}

        //работаем с точками. уббираем класс 'dot-active'
        dots.forEach((item) => item.classList.remove("dot-active"));
        //чтобы показать нужный слайд
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].classList.add("dot-active");
    }
    //ф-я увеличивающая параметр slideIndex
    //прямо здесь вызываем ф-ю showSlides
    function plusSlides(n) {
        showSlides((slideIndex += n));
    }
    //ф-я определяет текущий слайд и устанавливает его
    function currentSlide(n) {
        showSlides((slideIndex = n));
    }

    prev.addEventListener("click", function () {
        plusSlides(-1);
    });

    next.addEventListener("click", function () {
        plusSlides(1);
    });

    //используем делегирование событий - проверяем эл-т на определённые параметры и в соответствии с этим что то делаем
    // клик на точку
    dotsWrap.addEventListener("click", function (event) {
        for (let i = 0; i < dots.length + 1; i++) {
            if (
                event.target.classList.contains("dot") &&
                event.target == dots[i - 1]
            ) {
                currentSlide(i);
            }
        }
    });

    //Calc

    let persons = document.querySelectorAll(".counter-block-input")[0],
        restDays = document.querySelectorAll(".counter-block-input")[1],
        place = document.getElementById("select"),
        totalValue = document.getElementById("total"),
        personsSum = 0,
        daysSum = 0,
        total = 0;

    //подправим значение в калькуляторе
    totalValue.innerHTML = 0;

    //с помошью this - контекста вызова, мы получаем тот элемент с которым общаемся, т.е.  persons, на котором происходит событие 'change'
    persons.addEventListener("change", function () {
        personsSum = +this.value;
        //формула расчёта поездки
        total = (daysSum + personsSum) * 4000;

        //условие. если одно из полей пустое, то не расчитываем
        if (restDays.value == "") {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    restDays.addEventListener("change", function () {
        daysSum = +this.value;
        //формула расчёта поездки
        total = (daysSum + personsSum) * 4000;

        //условие. если одно из полей пустое, то не расчитываем
        if (persons.value == "") {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    //  базы отдыха
    place.addEventListener("change", function () {
        if (restDays.value == "" || persons.value == "") {
            totalValue.innerHTML = 0;

        } else {
            /* чтобы избежать потери данных в переменной total, используем промежуточную переменную*/
            //  в totalValue, при помощи .innerHTML помещаем значение
            //с помощью this обращаемся к options, к тому элементу на который и воздействуем сейчас( на котором "change" происходит)
            //  через [] обращаемся к тому эл-ту который был выбран
            //  и получаем его value
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });
});

// Message

//let age = document.getElementById('age');

//function showUser(surname, name) {
//    alert("Пользователь " + surname + " " + name + ", его возраст " + this.value);
//}

//showUser.apply(age, ["Горький", "Максим"]);