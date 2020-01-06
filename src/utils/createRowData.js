import { firestoreModule } from '../Firebase/Firebase';

const getStudents = (setRows, setLoading, uid, role) => {
  let str = 'owners.' + role + 's';
  if (role === 'ceo')
    firestoreModule
      .getStudents()
      .onSnapshot(querySnapshot => {
        setRows(querySnapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id })))
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });
  else if (role === 'tutor')
    firestoreModule
      .getStudents()
      .where(str, 'array-contains', { uid })
      .onSnapshot(querySnapshot => {
        console.log(querySnapshot);
        setRows(querySnapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id })))
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });
  else {
    firestoreModule
      .getStudents()
      .where(str, 'array-contains', uid)
      .onSnapshot(querySnapshot => {
        setRows(querySnapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id })))
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });
  }
};

const getUsersPhones = (setIDArr) => {
  firestoreModule
    .getUsers()
    .onSnapshot(snapshot => {
      setIDArr(snapshot.docs.map(doc => doc.data()['phone']));
    }, err => {
      console.log(err);
    });
}
const getStudentsPhones = (setIDArr) => {
  firestoreModule
    .getStudents()
    .onSnapshot(snapshot => {
      setIDArr(snapshot.docs.map(doc => doc.data()['phone']));
    }, err => {
      console.log(err);
    });
}

const getTutors = (setRows, uid, setLoading, role) => {

  let str = 'owners.' + role + 's';
  if (role === 'ceo') {
    firestoreModule
      .getUsers()
      .onSnapshot(snapshot => {
        let answer = snapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id }));
        answer = answer.filter(row => row.role === 'tutor');
        setRows(answer);
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });
  }
  else {
    firestoreModule
      .getUsers()
      .where(str, 'array-contains', uid)
      .onSnapshot(snapshot => {
        let answer = snapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id }));
        answer = answer.filter(row => row.role === 'tutor');
        setRows(answer);
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });
  }
}

const getCoordinators = (setRows, uid, setLoading, role) => {
  if (role === 'departmentManager')
    firestoreModule
      .getUsers()
      .where("owners.departmentManagers", 'array-contains', uid)
      .onSnapshot(snapshot => {
        let answer = snapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id }));
        answer = answer.filter(row => row.role === 'coordinator');
        setRows(answer);
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });
  else
    firestoreModule
      .getUsers()
      .onSnapshot(snapshot => {
        let answer = snapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id }));
        answer = answer.filter(row => row.role === 'coordinator');
        setRows(answer);
        setLoading(false);
      }, err => {
        console.log(err);
        setLoading(false);
      });

}

const getDepartmentManagers = (setRows, setLoading) => {

  firestoreModule
    .getUsers()
    .onSnapshot(snapshot => {

      let answer = snapshot.docs.map(doc => ({ ...doc.data(), fid: doc.id }));
      answer = answer.filter(row => row.role === 'departmentManager');
      setRows(answer);
      setLoading(false);
    }, err => {
      console.log(err);
      setLoading(false);
    });

}

export { getStudents, getTutors, getCoordinators, getDepartmentManagers, getUsersPhones, getStudentsPhones };
