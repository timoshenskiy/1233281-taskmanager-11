import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};
export const compareDates = (date1, date2) => {
  return moment(date2).isAfter(date1);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
