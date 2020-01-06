import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { entriesToObj, checkIfAllFieldsHaveValue } from './general-utils'
import { Dropzone, MsgToShow, Select } from '../components';

const mandatoryRows = ['firstName', 'lastName', 'gender'];
const INIT_STATE = {
    aoo: [],
    selecting: false,
    uploading: false,
    uploadProgress: {},
    successfullUploaded: false,
    errorUploading: false
}
class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = INIT_STATE;
    }

    aoaToAoo(aoa) {
        const [columnsNames, ...data] = aoa;
        return data.map((row) => entriesToObj(row.map((cellVal, idx) => [columnsNames[idx], cellVal])))
    }

    render() {
        return (
            <div style={{ width: '1000' }}>
                {this.state.selecting ?
                    <Select
                        uploadedFinished={(val) => this.setState({ selecting: val })}
                        onSelectingDone={fileRowsToTableRows => {
                            const aoo = this.state.aoo.map(obj =>
                                entriesToObj(fileRowsToTableRows.map(([tableName, fileName]) =>
                                    [tableName, obj[fileName]])));
                            if (aoo.every(obj => checkIfAllFieldsHaveValue(mandatoryRows, obj))) {
                                this.props.onNewFile(aoo);
                            } else {
                                this.setState({ ...INIT_STATE, errorUploading: true })
                            }
                        }}
                        fileRows={Object.keys(this.state.aoo[0])}
                    /> :
                    <>
                        <Dropzone onGetFile={aoa => this.setState({ aoo: this.aoaToAoo(aoa), selecting: aoa.length > 0, successfullUploaded: aoa.length > 0 })} />
                        <Typography align='center' style={{ fontSize: 40, color: '#41ad48' }}>
                            גרור / לחץ לבחירת קובץ
                        </Typography>
                    </>
                }
                <MsgToShow
                    title="שגיאה בטעינת הקבוץ"
                    body="המערכת לא הצליחה לטעון את הנתונים בדוק אם מלאת את כל שדות החובה"
                    visible={this.state.errorUploading}
                    handleClose={() => this.setState({ errorUploading: false })}
                />
            </div>
        )
    }
}

export default Upload;
