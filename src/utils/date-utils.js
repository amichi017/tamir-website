import moment from 'moment';

const toMoment = date => {
  if (date instanceof Date) {
    return moment(date);
  }
  return moment(date.toDate());
};

const diffInHours = (start, end) => {
  const startMoment = toMoment(start);
  const endMoment = toMoment(end);
  const diff = moment.duration(endMoment.diff(startMoment)).asHours();
  return diff < 0 ? 0 : diff;
};

export { diffInHours, toMoment };
