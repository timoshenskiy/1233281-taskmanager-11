
// Задаем количество отрисованных карточек
const TASK_COUNT = 3;
// Описываем функции возвращающие компоненты
// 1. Меню
import {createSiteMenuTemplate} from './components/menu.js';
// 2. Фильтры
import {createFilterTemplate} from './components/filter.js';
// 3. Панель сортировки вместе с общим контейнером и контейнером для для добавления задач
import {createBoardTemplate} from './components/board.js';
// 4. Форма создания задачи
import {createTaskEditTemplate} from './components/task-form.js';
// 5. Карточка задачи (Дефолтная, черная)
import {createTaskTemplate} from './components/task.js';
// 6. Загрузить еще
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
// Функция отрисовки переданного в нее шаблона в указанное место
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
// Сохраняем места для вставки компонентов
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
// Добавляем меню, фильтры и панель сортировки
render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);
// Ищем элемент, куда будем добавлять карточки задач и крайний контейнер для добавления кнопки "Загрузить еще"
const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(taskListElement, createTaskEditTemplate(), `beforeend`);
// Отрисовываем карточки задач
for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate(), `beforeend`);
}
// Отрисовываем кнопку "Загрузить еще"
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
