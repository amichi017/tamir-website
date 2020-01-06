import React, { useState } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid-addons';
import {
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core/';
import { MsgToShow } from '.';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { aoaToFile } from '../utils/excell-utils';
import green from '@material-ui/core/colors/green';
import 'react-responsive-ui/style.css';
import PhoneInput from 'react-phone-number-input/react-responsive-ui';
import { firestoreModule } from '../Firebase/Firebase';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { Filters, Editors } from 'react-data-grid-addons';
import deepcopy from 'deepcopy';
import { getUsersPhones } from '../utils/createRowData';
import { removeEmptyFields } from '../utils/general-utils';
import { addOwners } from '../utils/local-db';

class phoneEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: props.value
    };
  }
  getValue() {
    return { phone: this.state.phone };
  }
  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
  }
  handleChangePhone = name => value => {
    this.setState({ ...this.state, [name]: value });
  };
  render() {
    return (
      <form>
        <PhoneInput
          country="IL"
          placeholder="נייד"
          value={this.state.phone}
          onChange={this.handleChangePhone('phone')}
        />
      </form>
    );
  }
}

const formatter = ({ value }) => {
  return <div style={{ textAlign: 'right' }}>{value}</div>;
};

const defaultColumnProperties = {
  filterable: true,
  sortable: true,
  resizable: true,
  editable: true,
  formatter: formatter,
  minWidth: 50
};

const { DropDownEditor } = Editors;
const { NumericFilter, AutoCompleteFilter } = Filters;

const genderOptions = [{ id: 'male', value: 'ז' }, { id: 'female', value: 'נ' }];
const genderEditor = <DropDownEditor options={genderOptions} />;

const columns = [
  {
    key: 'id',
    name: 'No.',
    width: 40,
    filterRenderer: NumericFilter,
    editable: false
  },
  {
    key: 'lastName',
    name: 'שם משפחה',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'firstName',
    name: 'שם פרטי',
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'phone',
    name: 'נייד',
    width: 130,
    editor: phoneEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'gender',
    name: 'מין',
    editor: genderEditor,
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'address',
    name: 'כתובת',
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'neighborhood',
    name: 'שכונה',
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'govID',
    name: 'תעודת זהות',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'city',
    name: 'עיר',
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'email',
    name: 'מייל',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'lastModified',
    name: 'שינוי אחרון',
    filterRenderer: AutoCompleteFilter,
    editable: false,
    width: 160
  },
  {
    key: 'check',
    width: 5
  }
].map(c => ({ ...defaultColumnProperties, ...c }));

const genders = [
  {
    value: 'ז',
    label: 'זכר'
  },
  {
    value: 'נ',
    label: 'נקבה'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    alignContent: 'center',
    border: 3,
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 3,
    width: '100%',
    maxWidth: 300
  },
  nested: {
    paddingLeft: theme.spacing(2),
    border: 3,
    borderRadius: 3
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  actions: {
    display: 'flex',
    margin: theme.spacing(1),
    flexDirection: 'column',
    padding: 5,
    marginTop: 20
  },
  saveContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
    marginRight: 'auto',
    padding: 5,
    marginTop: 20,
    Size: 50
  },
  button: {
    borderRadius: 5,
    fontFamily: 'Arial',
    fontSize: 18,
    padding: 4,
    margin: theme.spacing(1),
    alignContent: 'center',
    textAlign: 'right'
  },
  formTitle: {
    textAlign: 'center',
    font: 30
  },
  formText: {
    textAlign: 'right'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textAlign: 'right',
    width: 150
  },

  icon: {
    margin: theme.spacing(1)
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  menu: {
    width: 150
  },
  rowRener: {
    border: 1,
    borderRadius: 3
  }
}));

const selectors = Data.Selectors;

const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
  const comparer = (a, b) => {
    if (sortDirection === 'ASC') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else if (sortDirection === 'DESC') {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  };
  return sortDirection === 'NONE' ? initialRows : [...rows].sort(comparer);
};

const handleFilterChange = filter => filters => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getValidFilterValues(rows, columnId) {
  return rows
    .map(r => r[columnId])
    .filter((item, i, a) => {
      return i === a.indexOf(item);
    });
}

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}

const RowRenderer = ({ row, renderBaseRow, ...props }) => {
  const rowToRender = {
    ...row,
    lastModified: moment(row.lastModified).format('DD/MM/YYYY HH:MM:SS')
  };
  const color = props.idx % 2 ? '#eee' : '#555';
  return (
    <div style={{ backgroundColor: color }}>{renderBaseRow({ ...props, row: rowToRender })}</div>
  );
};

function GenericTab({
  originalRows,
  setOriginalRows,
  rows,
  setMainRows,
  genericSaveButtonColor,
  setGenericSaveButtonColor,
  type,
  userStatus,
  role,
  uid
}) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [filters, setFilters] = useState({});
  let [rowsCopy, setRows] = useState(rows);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [msgState, setMsgState] = useState({ title: '', body: '', visible: false });
  const [formState, setFormState] = useState({
    firstNameErr: false,
    lastNameErr: false,
    genderErr: false,
    phoneErr: false
  });
  const [openForm, setOpenForm] = useState(false);
  let filteredRows = getRows(rowsCopy, filters);
  const [newRow, setNewRow] = useState({});
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [openDeleteCheck, setOpenDeleteCheck] = useState(false);
  const [usersPhones, setUsersPhones] = useState([]);

  const fixRowFields = row => {
    columns.forEach(({ key }) => {
      if (row.hasOwnProperty(key)) {
        if (
          key === 'lastModified' &&
          row[key] !== undefined &&
          row[key] !== null &&
          row[key] !== ''
        ) {
          row[key] = row[key] instanceof Date ? row[key] : row[key].toDate();
        }
        if (row[key] === null || row[key] === undefined || key === 'dob') {
          row[key] = '';
        }
      } else {
        row = { ...row, [key]: '' };
      }
    });
    return row;
  };

  const fixRowsFields = arr => {
    return arr.map(fixRowFields);
  };

  function checkIfUserExist(phone) {
    return usersPhones.includes(phone);
  }

  function isValidPhone(phone) {
    if (phone.length === 13) return true;
    return false;
  }

  const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    if (updated.phone !== undefined) {
      if (!isValidPhone(updated.phone)) {
        setMsgState({
          title: 'עריכת נייד',
          body: '!נא להכניס נייד תקין',
          visible: true
        });
        return;
      }
      if (checkIfUserExist(updated.phone)) {
        setMsgState({
          title: 'עריכת נייד',
          body: '!הנייד כבר קיים במערכת',
          visible: true
        });
        return;
      }
    }
    setGenericSaveButtonColor('secondary');
    const newRows = deepcopy(rowsCopy);
    for (let i = 0; i < newRows.length; i++) {
      if (i >= fromRow && i <= toRow) {
        newRows[i] = { ...rowsCopy[i], ...updated };
        newRows[i].lastModified = updateDate();
      } else {
        newRows[i].lastModified = new Date(newRows[i].lastModified);
      }
    }
    setRows(newRows);
    setMainRows(newRows);
  };

  const updateDate = () => {
    return new Date();
  };

  const updateNums = () => {
    for (let i = 0; i < rowsCopy.length; i++) {
      rowsCopy[i].id = i + 1;
    }
    setRows(rowsCopy);
    setMainRows(rowsCopy);
  };

  const handleChange = name => event => {
    let fieldName = name + 'Err';
    setFormState({ ...formState, [fieldName]: false });
    setNewRow({ ...newRow, [name]: event.target.value });
  };

  const handleChangePhone = name => value => {
    setFormState({ ...formState, phoneErr: false });
    setNewRow({ ...newRow, [name]: value });
  };

  function handleClickOpenForm() {
    setNewRow({ id: rowsCopy.length, lastModified: updateDate(), ...newRow });
    setOpenForm(true);
  }

  function handleCloseForm() {
    setOpenForm(false);
    setNewRow({});
  }

  function handleOpenCheckDelete() {
    if (selectedIndexes.length > 0) setOpenDeleteCheck(true);
  }
  function handleCloseCheckDelete() {
    setOpenDeleteCheck(false);
  }

  const deleteRow = () => {
    if (selectedIndexes.length === 0) return;
    if (!loading) {
      setLoading(true);
      const fids = [];
      selectedIndexes.forEach(idx => fids.push(rowsCopy[idx].fid));
      fids.forEach(id => firestoreModule.deleteUser(id));
      let newArr = rowsCopy.filter((row, i) => !selectedIndexes.includes(i));
      while (selectedIndexes.length !== 0) {
        selectedIndexes.shift();
      }
      rowsCopy = newArr;
      setRows(rowsCopy);
      setMainRows(rowsCopy);
      setLoading(false);
      handleCloseCheckDelete();
      if (type === 'tutors')
        setMsgState({
          title: 'מחיקת מדריכם',
          body: '!כל המדריכים שנבחרו נמחקו בהצלחה',
          visible: true
        });
      else if (type === 'coordinators')
        setMsgState({
          title: 'מחיקת רכזים',
          body: '!כל הרכזים שנבחרו נמחקו בהצלחה',
          visible: true
        });
      else if (type === 'departmentManagers')
        setMsgState({
          title: 'מחיקת מנהלי מחלקות',
          body: '!כל המנהלים שנבחרו נמחקו בהצלחה',
          visible: true
        });
      setGenericSaveButtonColor('secondary');
      updateNums();
    }
  };

  const removeUnnecessaryFields = row => {
    delete row.check;
    delete row.id;
    delete row.fid;
  };

  function formValidation() {
    if (newRow.firstName === '' || !newRow.hasOwnProperty('firstName')) {
      setFormState({ firstNameErr: true });
      return;
    } else {
      setFormState({ firstNameErr: false });
    }
    if (newRow.lastName === '' || !newRow.hasOwnProperty('lastName')) {
      setFormState({ lastNameErr: true });
      return;
    } else {
      setFormState({ lastNameErr: false });
    }
    if (newRow.gender === '' || !newRow.hasOwnProperty('gender')) {
      setFormState({ genderErr: true });
      return;
    } else {
      setFormState({ genderErr: false });
    }
    if (newRow.phone === '' || !newRow.hasOwnProperty('phone') || newRow.phone === undefined) {
      setFormState({ phoneErr: true });
      return;
    } else {
      setFormState({ phoneErr: false });
    }

    if (newRow.phone && !isValidPhone(newRow.phone)) {
      setMsgState({
        title: 'הוספת חניך',
        body: '!נא להכניס נייד תקין',
        visible: true
      });
      return;
    }
    if (checkIfUserExist(newRow.phone)) {
      if (type === 'tutors')
        setMsgState({
          title: 'הוספת מדריך',
          body: '!המדריך כבר קיים במערכת',
          visible: true
        });
      else if (type === 'coordinators')
        setMsgState({
          title: 'הוספת רכז',
          body: '!הרכז כבר קיים במערכת',
          visible: true
        });
      else if (type === 'departmentManagers')
        setMsgState({
          title: 'הוספת מנהל מחלקה',
          body: '!המנהל כבר קיים במערכת',
          visible: true
        });
      return;
    }
    addRow();
  }

  checkIfUserExist(newRow.phone);

  const addRow = () => {
    setLoadingAdd(true);
    handleCloseForm();
    let fixedRow = fixRowFields(newRow);
    removeUnnecessaryFields(fixedRow);
    fixedRow = addOwners(role, uid, userStatus.owners, type, fixedRow);
    fixedRow = removeEmptyFields(fixedRow);
    firestoreModule
      .getUsers()
      .add(fixedRow)
      .then(ref => {
        fixedRow = { ...fixedRow, fid: ref.id };
        fixedRow = fixRowFields(fixedRow);
        fixedRow = addOwners(role, uid, userStatus.owners, type, fixedRow);

        rowsCopy.unshift(fixedRow);

        updateNums();
        setRows(rowsCopy);
        setMainRows(rowsCopy);
        if (type === 'tutors')
          setMsgState({
            title: 'הוספת מדריך',
            body: '!המדריך הוסף בהצלחה',
            visible: true
          });
        else if (type === 'coordinators')
          setMsgState({
            title: 'הוספת רכז',
            body: '!הרכז הוסף בהצלחה',
            visible: true
          });
        else if (type === 'departmentManagers')
          setMsgState({
            title: 'הוספת מנהל מחלקה',
            body: '!המנהל הוסף בהצלחה',
            visible: true
          });
        setGenericSaveButtonColor('secondary');
        setLoadingAdd(false);
      })
      .catch(function (error) {
        console.log('Error adding', error);
      });
  };

  const classes = useStyles();

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    const newSelectedIndexes = selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1);
    setSelectedIndexes(newSelectedIndexes);
  };

  const getAppropriateSelect = () => {
    if (type === 'tutors') return selectedIndexes.length === 1 ? 'מדריך בחור' : 'מדריכים בחורים';
    if (type === 'coordinators') return selectedIndexes.length === 1 ? 'רכז בחור' : 'רכזים בחורים';
    if (type === 'departmentManagers')
      return selectedIndexes.length === 1 ? 'מנהל בחור' : 'מנהלים בחורים';
  };
  const rowText = getAppropriateSelect();

  const columnsToShow = [...columns];

  const rowToArr = row => columns.map(r => row[r.key]);

  const exportToExcel = () => {
    const columnNames = columns.map(r => r.name);
    const aoa = [columnNames].concat(rowsCopy.map(rowToArr));
    if (type === 'tutors') aoaToFile({ fileName: 'רשימת מדריכים', aoa });
    if (type === 'coordinators') aoaToFile({ fileName: 'רשימת רכזים', aoa });
    if (type === 'departmentManagers') aoaToFile({ fileName: 'רשימת מנהלי מחלקות', aoa });
  };

  const firstTimeLoading = () => {
    updateNums();
    getUsersPhones(setUsersPhones);
    let newRows = fixRowsFields(rowsCopy);
    setRows([...newRows]);
    setMainRows([...rowsCopy]);
    setLoadingPage(false);
  };
  if (loadingPage) firstTimeLoading();

  const deleteUnnecessaryRow = () => {
    let fids = rowsCopy.map(row => row.fid);
    originalRows = originalRows.filter(row => fids.includes(row.fid));
    setOriginalRows([...originalRows]);
  };

  const getRowsToUpdate = () => {
    let ids = [];
    let rows = [];
    rowsCopy.map(row => ids.push({ id: row.id - 1, fid: row.fid }));
    for (let i = 0; i < originalRows.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (originalRows[i].fid === ids[j].fid) {
          if (rowsCopy[ids[j].id] !== undefined) {
            if (originalRows[i].lastModified instanceof Date) {
              if (
                originalRows[i].lastModified.getTime() !==
                new Date(rowsCopy[ids[j].id].lastModified).getTime()
              )
                rows.push(rowsCopy[ids[j].id]);
            } else {
              if (
                originalRows[i].lastModified.toDate().getTime() !==
                new Date(rowsCopy[ids[j].id].lastModified).getTime()
              )
                rows.push(rowsCopy[ids[j].id]);
            }
          }
        }
      }
    }
    return rows;
  };

  const makeUpdate = arr => {
    arr.forEach(row => {
      let temp = { ...row };
      removeUnnecessaryFields(temp);
      temp = removeEmptyFields(temp);
      firestoreModule.getSpecificUser(row.fid).set(temp);
    });
  };
  const saveUpdates = () => {
    setLoadingSave(true);
    if (originalRows.length !== rowsCopy.length) deleteUnnecessaryRow();
    let arr = getRowsToUpdate();
    if (arr.length > 0) makeUpdate(arr);
    let newRows = fixRowsFields(rowsCopy);
    setRows(newRows);
    setOriginalRows(newRows);
    setMainRows(newRows);
    updateNums();
    setLoadingSave(false);
    setGenericSaveButtonColor('default');
    setMsgState({
      title: 'שמירת שינויים',
      body: 'כל השינויים נשמרו בהצלחה',
      visible: true
    });
  };

  return (
    <div>
      <div className={classes.actionsContainer}>
        <div className={classes.actions}>
          <Button
            style={{ color: '#0089c6', border: 3, borderStyle: 'solid' }}
            variant="outlined"
            disabled={loadingAdd}
            className={classes.button}
            onClick={() => handleClickOpenForm()}
            size="large">
            {type === 'tutors' && 'הוסף מדריך'}
            {type === 'coordinators' && 'הוסף רכז שכונה'}
            {type === 'departmentManagers' && 'הוסף מנהל מחלקה'}
            <AddIcon />
            {loadingAdd && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
          <MsgToShow
            {...msgState}
            handleClose={() => setMsgState({ ...msgState, visible: false })}
          />
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={openForm}
            onClose={handleCloseForm}
            aria-labelledby="form-dialog-title">
            <form validate="true" autoComplete="on">
              <DialogTitle id="form-dialog-title" className={classes.formTitle}>
                {type === 'tutors' && 'הוספת מדריך'}
                {type === 'coordinators' && 'הוספת רכז שכונה'}
                {type === 'departmentManagers' && 'הוספת מנהל מחלקה'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.formText}>
                  ** נא למלא את כל השדות **
                </DialogContentText>
                <TextField
                  required
                  autoFocus
                  error={formState.firstNameErr}
                  variant="outlined"
                  margin="dense"
                  id="firstName"
                  className={classes.textField}
                  placeholder="דוד"
                  label="שם פרטי"
                  type="name"
                  onChange={handleChange('firstName')}
                />
                <TextField
                  required
                  variant="outlined"
                  error={formState.lastNameErr}
                  margin="dense"
                  id="lastName"
                  className={classes.textField}
                  placeholder="כהן"
                  label="שם המשפחה"
                  type="name"
                  onChange={handleChange('lastName')}
                />
                <TextField
                  required
                  select
                  id="gender"
                  error={formState.genderErr}
                  variant="outlined"
                  margin="dens"
                  label="מין"
                  className={classes.textField}
                  onChange={handleChange('gender')}
                  value={newRow.gender}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}>
                  {genders.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <PhoneInput
                  required
                  country="IL"
                  error={formState.phoneErr}
                  label="מס' טלפון"
                  placeholder="נייד"
                  className={classes.textField}
                  value={newRow.phone}
                  onChange={handleChangePhone('phone')}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseForm} color="secondary" size="large">
                  בטל
                </Button>
                <Button onClick={() => formValidation()} color="primary" size="large">
                  אשר
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>

        <div className={classes.actions}>
          <Button
            style={{ color: '#0089c6', border: 3, borderStyle: 'solid' }}
            variant="outlined"
            size="large"
            className={classes.button}
            onClick={() => exportToExcel()}>
            ייצא לאקסל
            <SaveIcon />
          </Button>
        </div>

        <div className={classes.saveContainer}>
          <Button
            style={{ border: 3, borderStyle: 'solid' }}
            variant="outlined"
            size="large"
            color={genericSaveButtonColor}
            className={classes.button}
            onClick={() => (genericSaveButtonColor === 'secondary' ? saveUpdates() : {})}
            disabled={loadingSave}>
            שמור שינויים
            <SaveIcon />
            {loadingSave && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
        </div>
      </div>

      <ReactDataGrid
        rowKey="id"
        columns={columnsToShow.reverse()}
        rowGetter={i => filteredRows[i]}
        rowsCount={filteredRows.length}
        minHeight={350}
        toolbar={<Toolbar enableFilter={true} />}
        onAddFilter={filter => setFilters(handleFilterChange(filter))}
        onClearFilters={() => setFilters({})}
        getValidFilterValues={columnKey => getValidFilterValues(rowsCopy, columnKey)}
        onGridSort={(sortColumn, sortDirection) =>
          setRows(sortRows(rowsCopy, sortColumn, sortDirection))
        }
        onGridRowsUpdated={onGridRowsUpdated}
        rowRenderer={RowRenderer}
        enableCellSelect={true}
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: onRowsSelected,
          onRowsDeselected: onRowsDeselected,
          selectBy: {
            indexes: selectedIndexes
          }
        }}
      />

      {selectedIndexes.length !== 0 ? (
        <div className={classes.actionsContainer}>
          <List
            component="nav"
            className={classes.root}
            style={{ maxWidth: 250, border: 3, borderColor: 'black' }}>
            <ListItem button onClick={handleOpenCheckDelete} disabled={loading}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              {type === 'tutors' && (
                <ListItemText primary="מחק מדריכים שנבחרו" style={{ textAlign: 'right' }} />
              )}
              {type === 'coordinators' && (
                <ListItemText primary="מחק רכזים שנבחרו" style={{ textAlign: 'right' }} />
              )}
              {type === 'departmentManagers' && (
                <ListItemText primary="מחק מנהלים שנבחרו" style={{ textAlign: 'right' }} />
              )}

              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </ListItem>

            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={openDeleteCheck}
              onClose={handleCloseCheckDelete}>
              <DialogTitle className={classes.formTitle}>
                {type === 'tutors' && 'מחיקת מדריכים'}
                {type === 'coordinators' && 'מחיקת רכזים'}
                {type === 'departmentManagers' && 'מחיקת מנהלים'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.formText}>
                  {type === 'tutors' && 'אתה עומד למחוק את כל המדריכים שנבחרו'}
                  {type === 'coordinators' && 'אתה עומד למחוק את כל הרכזים שנבחרו'}
                  {type === 'departmentManagers' && 'אתה עומד למחוק את כל המנהלים שנבחרו'}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCheckDelete}
                  color="primary"
                  className={classes.button}
                  size="large">
                  בטל
                </Button>
                <Button
                  onClick={deleteRow}
                  color="secondary"
                  className={classes.button}
                  size="large">
                  אשר
                </Button>
              </DialogActions>
            </Dialog>
          </List>

          <List className={classes.saveContainer}>
            <Typography style={{ color: '#3F51B5', font: 30 }} variant="subtitle1">
              {selectedIndexes.length} {rowText}
            </Typography>
          </List>
        </div>
      ) : null}
    </div>
  );
}

export { GenericTab };
