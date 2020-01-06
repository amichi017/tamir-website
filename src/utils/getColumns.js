import React from 'react';
import { Filters, Editors } from 'react-data-grid-addons';
import { TextField } from '@material-ui/core';
import ReactDOM from 'react-dom';
import 'react-dates/initialize';
import PhoneInput from 'react-phone-number-input/react-responsive-ui';

class BirthDayEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: props.value
    };
  }

  getValue() {
    return { dob: this.state.dob };
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
  }

  handleChangeComplete = event => {
    this.setState({ dob: event.target.value }, () => this.props.onCommit());
  };

  render() {
    return (
      <form>
        <TextField
          id="date"
          label="Birthday"
          style={{
            width: 200
          }}
          type="date"
          defaultValue="30-06-2019"
          value={this.state.dob}
          onChange={this.handleChangeComplete}
          InputLabelProps={{
            shrink: true
          }}
        />
      </form>
    );
  }
}

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

const TShirtSizes = [
  { id: 'xSmall', value: 'XXXS' },
  { id: 'xSmall', value: 'XXS' },
  { id: 'xSmall', value: 'XS' },
  { id: 'small', value: 'S' },
  { id: 'medium', value: 'M' },
  { id: 'large', value: 'L' },
  { id: 'xLarge', value: 'XL' },
  { id: 'xSmall', value: 'XXL' },
  { id: 'xSmall', value: 'XXXL' }
];

const gradeOptions = [
  { id: '1', value: 'א' },
  { id: '2', value: 'ב' },
  { id: '3', value: 'ג' },
  { id: '4', value: 'ד' },
  { id: '5', value: 'ה' },
  { id: '6', value: 'ו' },
  { id: '7', value: 'ז' },
  { id: '8', value: 'ח' },
  { id: '9', value: 'ט' },
  { id: '10', value: 'י' },
  { id: '11', value: 'יא' },
  { id: '12', value: 'יב' }
];

const genderOptions = [{ id: 'male', value: 'ז' }, { id: 'female', value: 'נ' }];

const TShirtSizesEditor = <DropDownEditor options={TShirtSizes} />;
const genderEditor = <DropDownEditor options={genderOptions} />;
const classEditor = <DropDownEditor options={gradeOptions} />;

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
    key: 'groups',
    name: 'קבוצות',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'phone',
    name: 'נייד',
    width: 130,
    editor: phoneEditor,
    formatter: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'gender',
    name: 'מין',
    editor: genderEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'tutor',
    name: 'מדריך',
    editable: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'coordinator',
    name: 'רכז שכונה',
    editable: false,
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'departmentManager',
    name: 'מנהל מחלקה',
    editable: false,
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'schoolGrade',
    name: 'כיתה',
    width: 110,
    editor: classEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'school',
    name: 'מוסד לימודים',
    width: 110,
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
    key: 'dob',
    name: 'תאריך לידה',
    editor: BirthDayEditor,
    width: 100,
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
    key: 'shirtSize',
    name: 'מידת חולצה',
    width: 100,
    filterRenderer: AutoCompleteFilter,
    editor: TShirtSizesEditor
  },

  {
    key: 'friends',
    name: 'חברים',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'socialCircle',
    name: 'מעגל חברתי',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'youthGroup',
    name: 'תנועת נוער',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'interests',
    name: 'תחומי עניין',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'specialIssues',
    name: 'בעיות מיוחדות',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'prefferedDays',
    name: 'ימים מועדפים',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'staffMemberAppointed',
    name: 'איש צוות מטפל',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'comments',
    name: 'הערות',
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'studentStatus',
    name: 'סטטוס',
    filterRenderer: AutoCompleteFilter,
    editable: false
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

const departmentManagerColumns = [
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
    key: 'groups',
    name: 'קבוצות',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'phone',
    name: 'נייד',
    width: 130,
    editor: phoneEditor,
    formatter: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'gender',
    name: 'מין',
    editor: genderEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'tutor',
    name: 'מדריך',
    editable: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'coordinator',
    name: 'רכז שכונה',
    editable: false,
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'schoolGrade',
    name: 'כיתה',
    width: 110,
    editor: classEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'school',
    name: 'מוסד לימודים',
    width: 110,
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
    key: 'dob',
    name: 'תאריך לידה',
    editor: BirthDayEditor,
    width: 100,
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
    key: 'shirtSize',
    name: 'מידת חולצה',
    width: 100,
    filterRenderer: AutoCompleteFilter,
    editor: TShirtSizesEditor
  },

  {
    key: 'friends',
    name: 'חברים',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'socialCircle',
    name: 'מעגל חברתי',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'youthGroup',
    name: 'תנועת נוער',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'interests',
    name: 'תחומי עניין',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'specialIssues',
    name: 'בעיות מיוחדות',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'prefferedDays',
    name: 'ימים מועדפים',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'staffMemberAppointed',
    name: 'איש צוות מטפל',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'comments',
    name: 'הערות',
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'studentStatus',
    name: 'סטטוס',
    filterRenderer: AutoCompleteFilter,
    editable: false
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

const coordinatorColumns = [
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
    key: 'groups',
    name: 'קבוצות',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'phone',
    name: 'נייד',
    width: 130,
    editor: phoneEditor,
    formatter: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'gender',
    name: 'מין',
    editor: genderEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'tutor',
    name: 'מדריך',
    editable: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'schoolGrade',
    name: 'כיתה',
    width: 110,
    editor: classEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'school',
    name: 'מוסד לימודים',
    width: 110,
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
    key: 'dob',
    name: 'תאריך לידה',
    editor: BirthDayEditor,
    width: 100,
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
    key: 'shirtSize',
    name: 'מידת חולצה',
    width: 100,
    filterRenderer: AutoCompleteFilter,
    editor: TShirtSizesEditor
  },

  {
    key: 'friends',
    name: 'חברים',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'socialCircle',
    name: 'מעגל חברתי',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'youthGroup',
    name: 'תנועת נוער',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'interests',
    name: 'תחומי עניין',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'specialIssues',
    name: 'בעיות מיוחדות',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'prefferedDays',
    name: 'ימים מועדפים',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'staffMemberAppointed',
    name: 'איש צוות מטפל',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'comments',
    name: 'הערות',
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'studentStatus',
    name: 'סטטוס',
    filterRenderer: AutoCompleteFilter,
    editable: false
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

const tutorColumns = [
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
    key: 'groups',
    name: 'קבוצות',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'phone',
    name: 'נייד',
    width: 130,
    editor: phoneEditor,
    formatter: false,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'gender',
    name: 'מין',
    editor: genderEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'schoolGrade',
    name: 'כיתה',
    width: 110,
    editor: classEditor,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'school',
    name: 'מוסד לימודים',
    width: 110,
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
    key: 'dob',
    name: 'תאריך לידה',
    editor: BirthDayEditor,
    width: 100,
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
    key: 'shirtSize',
    name: 'מידת חולצה',
    width: 100,
    filterRenderer: AutoCompleteFilter,
    editor: TShirtSizesEditor
  },

  {
    key: 'friends',
    name: 'חברים',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'socialCircle',
    name: 'מעגל חברתי',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'youthGroup',
    name: 'תנועת נוער',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'interests',
    name: 'תחומי עניין',
    width: 100,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'specialIssues',
    name: 'בעיות מיוחדות',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'prefferedDays',
    name: 'ימים מועדפים',
    width: 110,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'staffMemberAppointed',
    name: 'איש צוות מטפל',
    width: 120,
    filterRenderer: AutoCompleteFilter
  },
  {
    key: 'comments',
    name: 'הערות',
    filterRenderer: AutoCompleteFilter
  },

  {
    key: 'studentStatus',
    name: 'סטטוס',
    filterRenderer: AutoCompleteFilter,
    editable: false
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

const Columns = role => {
  if (role === 'departmentManager') return departmentManagerColumns;
  else if (role === 'coordinator') return coordinatorColumns;
  else if (role === 'tutor') return tutorColumns;
  else return columns;
};

export { Columns };
