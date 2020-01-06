import React, { useState, useEffect } from 'react';
import { TableTabScene } from '../components';
import { makeStyles, Typography, Tab, Tabs, AppBar, Button, Toolbar } from '@material-ui/core/';
import green from '@material-ui/core/colors/green';
import { GenericTab } from '../components/GenericTab';
import {
  getStudents,
  getTutors,
  getCoordinators,
  getDepartmentManagers
} from '../utils/createRowData';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import Loader from 'react-loader-spinner';
import { addOwners } from '../utils/local-db';
import { firestoreModule } from '../Firebase/Firebase';
import Upload from '../utils/Upload';
import ReportsTabScene from './ReportsTabScene';
import logo from '../assets/images/tamir_logoshakuf.png';
import backG from '../assets/images/S.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1),
    textAlign: 'right',
    backgroundColor: theme.palette.background.paper,
    width: '100%'
  },
  table: {
    padding: 20,
    paddingTop: 5,
    borderRadius: 3
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '15%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  details: {
    textAlign: 'right',
    backgroundColor: theme.palette.background.paper,
    padding: 5
  },
  appBar: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9'
  },
  tabLabel: {
    fontFamily: 'Alef',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#41ad48'
  }
}));

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'IL'
    }
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const popup = () => {
  return 'are you sure you want to exit?';
};

const MainScene = () => {
  const [userStatus, setUserStatus] = useState('SignedOut');
  const [loading, setLoading] = useState(true);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [loadingCoordinators, setLoadingCoordinators] = useState(true);
  const [loadingDepartmentManagers, setLoadingDepartmentManagers] = useState(true);
  const [studentsRows, setStudentsRows] = useState([]);
  const [saveButtonColor, setSaveButtonColor] = useState('default');
  const [tutorsSaveButtonColor, setTutorsSaveButtonColor] = useState('default');
  const [coordinatorsSaveButtonColor, setCoordinatorsSaveButtonColor] = useState('default');
  const [departmentManagersSaveButtonColor, setDepartmentManagersSaveButtonColor] = useState(
    'default'
  );
  const [coordinatorsRows, setCoordinatorsRows] = useState([]);
  const [tutorsRows, setTutorsRows] = useState([]);
  const [departmentManagersRows, setDepartmentManagersRows] = useState([]);
  const [displayedTab, setDisplayedTab] = useState('TableTabScene');
  const [originalRows, setOriginalRows] = useState([]);
  const [tutorsOriginalRows, setTutorsOriginalRows] = useState([]);
  const [coordinatorsOriginalRows, setCoordinatorsOriginalRows] = useState([]);
  const [departmentManagersOriginalRows, setDepartmentManagersOriginalRows] = useState([]);

  firebase.auth().languageCode = 'iw';
  let unregisterAuthObserver;
  // componentDidMount
  useEffect(() => {
    unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUserStatus('SignedInCheckingPermissions');
        user
          .getIdTokenResult()
          .then(idTokenResult => {
            if (idTokenResult && idTokenResult.claims && idTokenResult.claims.isRegistered) {
              setUserStatus(idTokenResult.claims);
            } else {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  setUserStatus('SignedOutPermissionDenied');
                });
            }
          })
          .catch(err => {
            firebase
              .auth()
              .signOut()
              .then(() => setUserStatus('SignedOutPermissionDenied'));
            console.error(err);
          });
      }
    });
  }, []);

  // componentWillUnmount
  useEffect(() => {
    return () => {
      unregisterAuthObserver();
    };
  }, []);

  if (userStatus.isRegistered && loading) {
    const { uid } = firebase.auth().currentUser;
    const { role } = userStatus;
    getStudents(setStudentsRows, setLoading, uid, role);
    getStudents(setOriginalRows, setLoading, uid, role);
    if (role !== 'tutor') {
      getTutors(setTutorsRows, uid, setLoadingTutors, role);
      getTutors(setTutorsOriginalRows, uid, setLoadingTutors, role);
    }
    if (role === 'departmentManager' || role === 'ceo') {
      getCoordinators(setCoordinatorsRows, uid, setLoadingCoordinators, role);
      getCoordinators(setCoordinatorsOriginalRows, uid, setLoadingCoordinators, role);
    }
    if (role === 'ceo') {
      getDepartmentManagers(setDepartmentManagersRows, setLoadingDepartmentManagers);
      getDepartmentManagers(setDepartmentManagersOriginalRows, setLoadingDepartmentManagers);
    }
  }

  function handleChange(event, newValue) {
    setDisplayedTab(newValue);
  }

  const classes = useStyles();

  function getAppropriateStudentsRows() {
    const { uid } = firebase.auth().currentUser;
    const { role } = userStatus;

    if (role === 'tutor' && !loading) {
      return (
        <TableTabScene
          originalRows={originalRows}
          setOriginalRows={setOriginalRows}
          rows={studentsRows}
          setMainRows={setStudentsRows}
          saveButtonColor={saveButtonColor}
          setSaveButtonColor={setSaveButtonColor}
          userStatus={userStatus}
          role={role}
          uid={uid}
          tutors={tutorsRows}
          coordinators={coordinatorsRows}
          departmentManagers={departmentManagersRows}
        />
      );
    } else if (role === 'coordinator' && !loading && !loadingTutors) {
      return (
        <TableTabScene
          originalRows={originalRows}
          setOriginalRows={setOriginalRows}
          rows={studentsRows}
          setMainRows={setStudentsRows}
          saveButtonColor={saveButtonColor}
          setSaveButtonColor={setSaveButtonColor}
          userStatus={userStatus}
          role={role}
          uid={uid}
          tutors={tutorsRows}
          coordinators={coordinatorsRows}
          departmentManagers={departmentManagersRows}
        />
      );
    } else if (role === 'departmentManager' && !loading && !loadingTutors && !loadingCoordinators) {
      return (
        <TableTabScene
          originalRows={originalRows}
          setOriginalRows={setOriginalRows}
          rows={studentsRows}
          setMainRows={setStudentsRows}
          saveButtonColor={saveButtonColor}
          setSaveButtonColor={setSaveButtonColor}
          userStatus={userStatus}
          role={role}
          uid={uid}
          tutors={tutorsRows}
          coordinators={coordinatorsRows}
          departmentManagers={departmentManagersRows}
        />
      );
    } else if (
      role === 'ceo' &&
      !loading &&
      !loadingTutors &&
      !loadingCoordinators &&
      !loadingDepartmentManagers
    ) {
      return (
        <TableTabScene
          originalRows={originalRows}
          setOriginalRows={setOriginalRows}
          rows={studentsRows}
          setMainRows={setStudentsRows}
          saveButtonColor={saveButtonColor}
          setSaveButtonColor={setSaveButtonColor}
          userStatus={userStatus}
          role={role}
          uid={uid}
          tutors={tutorsRows}
          coordinators={coordinatorsRows}
          departmentManagers={departmentManagersRows}
        />
      );
    } else return null;
  }

  if (userStatus === 'SignedOut')
    return (
      <div
        style={{
          backgroundColor: '#F9F9F9',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          // backgroundImage: `url(${backG})`,
          // backgroundSize: 'cover',
          // backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center'
        }}>
        <AppBar>
          <Toolbar style={{ textAlign: 'center' }}>
            <Typography variant="h3" style={{ flexGrow: 1, alignContent: 'center', alignItems: 'center' }} >
              <h3 color="inherit"  >דף התחברות</h3>
            </Typography>
          </Toolbar>
        </AppBar>
        <img
          src={logo}
          style={{
            width: 245,
            height: 128,
            alignSelf: 'flex-end',
            marginRight: 50,
            marginTop: 100
          }}
        />
        <div>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>
    );
  else if (userStatus === 'SignedOutPermissionDenied')
    return (
      <div
        style={{
          backgroundColor: '#F9F9F9',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          // backgroundImage: `url(${backG})`,
          // backgroundSize: 'cover',
          //     backgroundRepeat  : 'no-repeat',
          //  backgroundPosition: 'center'
        }}>
        <AppBar>
          <Toolbar style={{ textAlign: 'center' }}>
            <Typography variant="h3" style={{ flexGrow: 1, alignContent: 'center', alignItems: 'center' }} >
              <h3 color="inherit"  >דף התחברות</h3>
            </Typography>
          </Toolbar>
        </AppBar>
        <img
          src={logo}
          style={{
            width: 245,
            height: 128,
            alignSelf: 'flex-end',
            marginRight: 50,
            marginTop: 100
          }}
        />
        <div>
          <Typography variant="h5" component="h5" style={{ textAlign: 'right', color: 'red' }}>
            !אין הרשאות גישה למספר זה
          </Typography>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>
    );
  else if (userStatus === 'SignedInCheckingPermissions')
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Loader type="Grid" color="#41ad48" height="100" width="100" />
      </div>
    );
  else {
    const { uid } = firebase.auth().currentUser;
    const { role } = userStatus;
    return (
      <div>
        {saveButtonColor === 'secondary' ? (window.onbeforeunload = popup) : null}
        <div>
          <AppBar
            position="static"
            color="default"
            className={classes.appBar}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              paddingLeft: 10,
              paddingTop: 7
            }}>
            <Button
              style={{
                marginRight: 'auto',
                fontSize: 18,
                fontWeight: 'bold',
                alignContent: 'center',
                textAlign: 'right',
                color: '#41ad48'
              }}
              size="large"

              onClick={() => {
                firebase.auth().signOut().then(() => {
                  setUserStatus('SignedOut');
                });

              }}>
              התנתק
            </Button>
            <Tabs
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#41ad48'
                }
              }}
              style={{ marginRight: 'auto' }}
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              value={displayedTab}
              onChange={handleChange}>
              <Tab
                key={0}
                value="ReportsTabScene"
                label={<span className={classes.tabLabel}>דו״חות</span>}
              />
              <Tab
                key={5}
                value="ImportFile"
                label={<span className={classes.tabLabel}>ייבוא מאקסל</span>}
              />
              {role === 'ceo' ? (
                <Tab
                  key={1}
                  value="DepartmentManagersTabScene"
                  label={<span className={classes.tabLabel}>מנהלי מחלקות</span>}
                />
              ) : null}
              {role === 'departmentManager' || role === 'ceo' ? (
                <Tab
                  key={2}
                  value="CoordinatorsTabScene"
                  label={<span className={classes.tabLabel}>רכזים</span>}
                />
              ) : null}
              {role !== 'tutor' ? (
                <Tab
                  key={3}
                  value="TutorsTabScene"
                  label={<span className={classes.tabLabel}>מדריכים</span>}
                />
              ) : null}
              <Tab
                key={4}
                value="TableTabScene"
                label={<span className={classes.tabLabel}>חניכים</span>}
              />
            </Tabs>

            <img
              src={logo}
              style={{
                width: 124,
                height: 67,
                //alignSelf: 'flex-end',
                marginRight: 70,
                // marginTop: 5
              }}
            />
          </AppBar>

          {displayedTab === 'TableTabScene' ? (
            <div className={classes.table}>{getAppropriateStudentsRows()}</div>
          ) : null}

          {displayedTab === 'TutorsTabScene' ? (
            <div className={classes.table}>
              <GenericTab
                originalRows={tutorsOriginalRows}
                setOriginalRows={setTutorsOriginalRows}
                rows={tutorsRows}
                setMainRows={setTutorsRows}
                genericSaveButtonColor={tutorsSaveButtonColor}
                setGenericSaveButtonColor={setTutorsSaveButtonColor}
                type="tutors"
                userStatus={userStatus}
                role={role}
                uid={uid}
              />
            </div>
          ) : null}

          {displayedTab === 'CoordinatorsTabScene' ? (
            <div className={classes.table}>
              <GenericTab
                originalRows={coordinatorsOriginalRows}
                setOriginalRows={setCoordinatorsOriginalRows}
                rows={coordinatorsRows}
                setMainRows={setCoordinatorsRows}
                genericSaveButtonColor={coordinatorsSaveButtonColor}
                setGenericSaveButtonColor={setCoordinatorsSaveButtonColor}
                type="coordinators"
                userStatus={userStatus}
                role={role}
                uid={uid}
              />
            </div>
          ) : null}

          {displayedTab === 'DepartmentManagersTabScene' ? (
            <div className={classes.table}>
              <GenericTab
                originalRows={departmentManagersOriginalRows}
                setOriginalRows={setDepartmentManagersOriginalRows}
                rows={departmentManagersRows}
                setMainRows={setDepartmentManagersRows}
                genericSaveButtonColor={departmentManagersSaveButtonColor}
                setGenericSaveButtonColor={setDepartmentManagersSaveButtonColor}
                type="departmentManagers"
                userStatus={userStatus}
                role={role}
                uid={uid}
              />
            </div>
          ) : null}
          {displayedTab === 'ImportFile' ? (
            <div className={classes.table}>
              <Upload
                onNewFile={aooToAdd => {
                  aooToAdd.forEach(student => {
                    const fixedStudent = addOwners(role, uid, userStatus.owners, null, student);
                    firestoreModule
                      .getStudents()
                      .add({ ...fixedStudent, lastModified: new Date() });
                  });
                }}
              />
            </div>
          ) : null}

          {displayedTab === 'ReportsTabScene' ? (
            <div className={classes.table}>
              {role !== 'tutor' ? <ReportsTabScene tutors={tutorsOriginalRows} />
                : <ReportsTabScene tutor={{
                  fid: firebase.auth().currentUser.uid
                }} />
              }
            </div>
          ) : null}
        </div>
      </div>
    );
  }
};

export default MainScene;
