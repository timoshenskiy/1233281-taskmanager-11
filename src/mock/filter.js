const filterTitles = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `archive`
];
// Функция генерации массива объектов с фильтрами (поля title и count)
const generateFilters = () => {
  return filterTitles.map((it) => {
    return {
      title: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

export {generateFilters};
