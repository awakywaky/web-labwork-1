# Работа с API

## Prerequisites

- Как работает интернет\
Например: <https://habr.com/ru/articles/709210/>, но я бы порекомендовал найти еще что-то самостоятельно.
- Что такое DNS?\
Например: <https://habr.com/ru/articles/303446/>
- HTTP/HTTPS\
Например: <https://habr.com/ru/companies/avito/articles/710660/>, <https://habr.com/ru/articles/813395/>, что-то про HTTPS...\
Я очень рекомендую руками (через `curl`/`telnet`) руками потыкать какие-то запросы (в т.ч. в API, которое ты будешь использовать). Postman - удобный UI для них, но нужно уметь жить и без него.
- REST\
Например: <https://habr.com/ru/articles/768752/>, <https://habr.com/ru/amp/publications/483202/>, <https://habr.com/ru/articles/590679/>.
- HTML, CSS\
Курс не про верстку, поэтому я верю, что это ты уже знаешь.
- JS\
Например: <https://developer.mozilla.org/en-US/docs/Web/JavaScript>, <https://javascript.info>.\
Точно нужно знать, как делать запросы и как работает promise. И я это спрошу на защите.

## Задание

Веб-сайт, спрашивающий у пользователя город, в котором он проживает, а затем текущую погоду в этом городе. Город должен запоминаться, то есть после перезагрузки сайта или перезахода в браузер, должен отображаться тот же самый город (самостоятельно узнай, как это сделать), но его должно быть можно перевыбрать. Для разной погоды сайт должен выглядеть по-разному (идеально, если будет какая-то анимация).

Пример (оно не обязательно должно выглядеть именно так):
![картинка](пример.avif)

Прогноз погоды брать из [open-meteo](https://open-meteo.com/en/docs#latitude=59.94&longitude=30.31&hourly=temperature_2m&forecast_days=16), а координаты по названию города определять с помощью [api-ninjas](https://api-ninjas.com/api/city).


#### Нужно использовать
- BEM
- [Code style](https://github.com/yandex/mapsapi-codestyle/blob/master/javascript.md).
- [Conventional commits](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13).

#### Можно использовать
- Браузер. Поставь себе хром, ты же фронтендер.
- [google.com](https://www.google.com/)
- VSCode/Vim/Emacs.
- Эмулятор терминала и shell.
- Встроенные библиотеки твоего языка программирования.
- Свой личный мозг.

#### Нельзя использовать
- Других людей.\
Максимум, кому можно задавать вопросы, это мне, но тебе вряд ли понравятся мои ответы.
- ИИ ассистенты.
- IDE.
- Сторонние библиотеки/фреймворки/etc.
- Линтер/автоформаттер в твоем редакторе кода.

#### Как я буду проверять

Я открою в chrome файл `main.html` из твоего pull request и буду смотреть. Потом прочитаю код.


## Дополнительная информация, которую я спрошу на защите
- [Missing semester of cs](https://missing.csail.mit.edu). Изучай это в фоне в течение всех лаб.
- Компиляция и интепретация, разница. Компилируемые и интепретируемые языки. Трансляция. \
Например: <https://ru.hexlet.io/blog/posts/kompilyatsiya-i-interpretatsiya-koda-chto-eto-takoe-i-v-chem-raznitsa>, <https://blog.skillfactory.ru/glossary/interpretator/>. Найди что-то самостоятельно про трансляцию.\
Вопрос на засыпку - а что такое вообще браузер?
- Какая бывает типизация.\
Например: <https://habr.com/ru/articles/161205/>.
- Что такое многопоточность? Что такое асинхронность? В чем разница? Что такое гонка? Асинхронность и многопотность в твоем ЯП.

<br/><br/>

Вообще, мы стараемся идти по <https://roadmap.sh/frontend>, рекомендую ознакомиться
