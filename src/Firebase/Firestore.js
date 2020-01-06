import firebase from 'firebase/app';
import 'firebase/firestore';

let firestoreDb = null;

const collections = {
  students: 'Students',
  attendanceDays: 'AttendanceDays',
  users: 'Users'
};

function getStudents() {
  return firestoreDb.collection(collections.students);
}

function getSpecificStudent(studentId) {
  return firestoreDb.collection(collections.students).doc(studentId);
}

function getSpecificUser(Uid) {
  return firestoreDb.collection(collections.users).doc(Uid);
}

function getUsers() {
  return firestoreDb.collection(collections.users);
}

function deleteStudent(studentId) {
  return firestoreDb
    .collection(collections.students)
    .doc(studentId)
    .delete();
}

function deleteUser(userId) {
  return firestoreDb
    .collection(collections.users)
    .doc(userId)
    .delete();
}

const getDaysCountInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const getAttendance = (tutorUIDs, month) => {
  if (month) {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth());
    const lastOfMonth = new Date(month.getFullYear(), month.getMonth(), getDaysCountInMonth(month));

    return Promise.all(
      tutorUIDs.map(tutorUID =>
        firestoreDb
          .collection(collections.attendanceDays)
          .where('owners.tutors', 'array-contains', tutorUID)
          .where('day', '>=', firstOfMonth)
          .where('day', '<=', lastOfMonth)
          .get()
          .then(snapshot => snapshot.docs.flatMap(doc => doc.data().shifts))
      )
    );
  } else {
    return Promise.all(
      tutorUIDs.map(tutorUID =>
        firestoreDb
          .collection(collections.attendanceDays)
          .where('owners.tutors', 'array-contains', tutorUID)
          .get()
          .then(snapshot => snapshot.docs.flatMap(doc => doc.data().shifts))
      )
    );
  }
};

const getModule = () => {
  firestoreDb = firebase.firestore();
  return {
    deleteStudent,
    getStudents,
    deleteUser,
    getSpecificStudent,
    getSpecificUser,
    getUsers,
    getAttendance
  };
};

export default getModule;
