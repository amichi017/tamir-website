import React from 'react';
import { checkIfAllFieldsHaveValue } from '../utils/general-utils';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CardContent,
  NativeSelect,
  Table,
  TableCell,
  TableBody,
  TableRow
} from '@material-ui/core';
import { MsgToShow } from './';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const mandatoryRows = ['firstName', 'lastName', 'gender'];
const rows = [
  'i',
  'lastName',
  'firstName',
  'groups',
  'phone',
  'gender',
  'schoolGrade',
  'school',
  'address',
  'neighborhood',
  'dob',
  'govID',
  'city',
  'email',
  'shirtSize',
  'friends',
  'socialCircle',
  'youthGroup',
  'interests',
  'specialIssues',
  'prefferedDays',
  'staffMemberAppointed',
  'comments'
];
class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastName: '',
      firstName: '',
      groups: '',
      phone: '',
      gender: '',
      schoolGrade: '',
      school: '',
      address: '',
      neighborhood: '',
      dob: '',
      govID: '',
      city: '',
      email: '',
      shirtSize: '',
      friends: '',
      socialCircle: '',
      youthGroup: '',
      interests: '',
      specialIssues: '',
      prefferedDays: '',
      staffMemberAppointed: '',
      comments: '',
      i: '',
      send: false,
      msgState: { title: '', body: '', visible: false }
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  getLabel = str => {
    switch (str) {
      case 'i':
        return 'בחר עמודה מתאימה';
      case 'lastName':
        return 'שם משפחה';
      case 'firstName':
        return 'שם פרטי';
      case 'phone':
        return 'נייד';
      case 'groups':
        return 'קבוצות';
      case 'gender':
        return 'מין';
      case 'schoolGrade':
        return 'כיתה';
      case 'school':
        return 'מוסד  לימודים';
      case 'address':
        return 'כתובת';
      case 'neighborhood':
        return 'שכונה';
      case 'dob':
        return 'תאריך לידה';
      case 'govID':
        return 'תעודת זהות';
      case 'city':
        return 'עיר';
      case 'email':
        return 'מייל';
      case 'friends':
        return 'חברים';
      case 'shirtSize':
        return 'מידת חולצה';
      case 'socialCircle':
        return 'מעגל חברתי';
      case 'youthGroup':
        return 'תנועת נוער';
      case 'interests':
        return 'תחומי עניין';
      case 'specialIssues':
        return 'בעיות מיוחדות';
      case 'prefferedDays':
        return 'ימים מועדפים';
      case 'staffMemberAppointed':
        return 'איש צוות מטפל';
      case 'comments':
        return 'הערות';
      default:
        return null;
    }
  };

  checkDisabled = str => {
    if (str === 'i') {
      return false;
    }
    return Object.values(this.state).includes(str);
  };

  chosen = (obj, name) => {
    return obj[name] && obj[name] !== 'בחר עמודה מתאימה';
  };

  handleClickOpen = () => {
    let canSend = checkIfAllFieldsHaveValue(mandatoryRows, this.state, this.chosen);

    if (canSend === true) {
      const [, ...rest] = rows;
      this.props.onSelectingDone(
        rest
          .filter(row => this.chosen(this.state, row))
          .map(existingName => [existingName, this.state[existingName]])
      );
      this.setState({ send: true });
    }

    if (!canSend) {
      this.setState({
        msgState: {
          title: 'שגיאה בטעינת הקבוץ',
          body: 'המערכת לא הצליחה לטעון את הנתונים בדוק אם מלאת את כל שדות החובה',
          visible: true
        }
      });
    }

    if (canSend) {
      this.setState({
        msgState: {
          title: 'טעינת קובץ',
          body: 'הקובץ נטען בהצלחה',
          visible: true
        }
      });
    }
  };

  handleClose = () => {
    this.setState({ send: false });
  };

  render() {
    const classes = {
      textField: {
        marginLeft: 100,

        width: 1000
      },
      dense: {
        marginTop: 19
      }
    };

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button
              align="right"
              color="secondary"
              style={{ width: 150, height: 50, position: 'relative', float: 'left', margin: 20 }}
              variant="contained"
              className={classes.button}
              onClick={this.handleClickOpen}>
              <ChevronLeftIcon style={{ marginRight: 20 }} />
              בצע התאמה
            </Button>
            <Typography variant="h6" style={{ flexGrow: 1 }} />
            <h2 color="inherit" style={{ flexGrow: 1 }}>
              התאמת עמודות
            </h2>
          </Toolbar>
        </AppBar>

        <CardContent>
          <Table style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <TableBody>
              <TableRow style={{ width: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>
                <TableCell component="th" scope="row" />
                <TableCell align="center"> מותאם לעמודה מהאקסל </TableCell>
                <TableCell align="center"> עמודה באתר </TableCell>
              </TableRow>
              {rows.map(row =>
                row !== 'i' ? (
                  <TableRow
                    key={row}
                    style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <TableCell component="th" scope="row" />
                    <TableCell align="center">
                      <NativeSelect
                        className={classes.selectEmpty}
                        value={this.state[row]}
                        name={row}
                        onChange={this.handleChange(row)}
                        inputProps={{ 'aria-label': 'age' }}>
                        {this.props.fileRows.map(row => (
                          <option key={row} disabled={this.checkDisabled(row)} value={row}>
                            {row}
                          </option>
                        ))}
                      </NativeSelect>
                    </TableCell>
                    <TableCell align="center">
                      {mandatoryRows.includes(row) ? '* ' + this.getLabel(row) : this.getLabel(row)}
                    </TableCell>
                  </TableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        </CardContent>
        <MsgToShow
          {...this.state.msgState}
          handleClose={() => {
            if (this.state.send) this.props.uploadedFinished(false);
            this.setState({ msgState: { ...this.state.msgState, visible: false } });
          }}
        />
      </div>
    );
  }
}

export { Select };
