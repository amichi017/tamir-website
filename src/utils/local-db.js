import { diffInHours } from '../utils/date-utils';

const totalHoursWorked = attendanceDays =>
  attendanceDays
    .map(({ endTime, startTime }) => (startTime && endTime ? diffInHours(startTime, endTime) : 0))
    .reduce((acc, curr) => acc + curr, 0);

const addOwners = (myRole, myUid, myOwners, roleOfUserToAdd, userToAdd) => {
  if (roleOfUserToAdd) {
    if (myRole === 'ceo')
      return {
        ...userToAdd,
        role: roleOfUserToAdd.substr(0, roleOfUserToAdd.length - 1)
      };
    return {
      ...userToAdd,
      owners: {
        ...myOwners,
        [myRole + 's']: [myUid]
      },
      role: roleOfUserToAdd.substr(0, roleOfUserToAdd.length - 1)
    };
  }
  return {
    ...userToAdd,
    owners: {
      ...myOwners,
      [myRole + 's']: myRole === 'tutor' ? [{ studentStatus: 'normal', uid: myUid }] : [myUid]
    }
  };
};

export { totalHoursWorked, addOwners };
