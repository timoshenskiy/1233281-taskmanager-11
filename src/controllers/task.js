import TaskComponent from "../components/task.js";
import TaskFormComponent from "../components/task-form.js";
import TaskModel from "../models/task.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {COLOR, DAYS} from "../const.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const SHAKE_ANIMATION_TIMEOUT = 600;

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "color": formData.get(`color`),
    "is_favorite": false,
    "is_done": false,
  });
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._taskComponent = null;
    this._taskFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskFormComponent = this._taskFormComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskFormComponent = new TaskFormComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !newTask.isArchive;

      this._onDataChange(this, task, newTask);
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;

      this._onDataChange(this, task, newTask);
    });

    this._taskFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._taskFormComponent.getData();
      const data = parseFormData(formData);
      this._onDataChange(this, task, data);
    });
    this._taskFormComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));
    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskFormComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskFormComponent, oldTaskFormComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskFormComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskFormComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskFormComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }
  destroy() {
    remove(this._taskFormComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskFormComponent.reset();
    if (document.contains(this._taskFormComponent.getElement())) {
      replace(this._taskComponent, this._taskFormComponent);
    }
    replace(this._taskComponent, this._taskFormComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskFormComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
  shake() {
    this._taskFormComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskFormComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
