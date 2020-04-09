import {createSiteMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskEditTemplate} from './components/task-form.js';
import {createTaskTemplate} from './components/task.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {generateFilters} from './mock/filter.js';
import {generateTasks} from "./mock/task.js";

// Задаем общее кол-во карточек, количество карточек к первоначальному показу и кол-во к дозагрузке по кнопке
const TASK_COUNT = 19;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

// Генерируем моки для фильтров и для карточек задач
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
// Функция отрисовки переданного в нее шаблона в указанное место
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
// Сохраняем места для вставки компонентов
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
// Добавляем меню, фильтры и панель сортировки
render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);
// Ищем элемент, куда будем добавлять карточки задач и крайний контейнер для добавления кнопки "Загрузить еще"
const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);
// Отрисовываем карточки задач
let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTasksCount)
  .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

// Отрисовываем кнопку "Загрузить еще"
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
// Добавляем обработчик клика

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  // Текушее количество показанных карточек
  const prevTasksCount = showingTasksCount;
  // Сколько должно быть показано после клика
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
  // Рендерим карточки
  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));
  // Условие удаления кнопки
  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
