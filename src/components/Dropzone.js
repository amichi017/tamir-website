import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { filesToAOAs } from '../utils/excell-utils';
import { MsgToShow } from './MsgToShow';

import logo from '../assets/images/tamir_logoshakuf.png';
const hasAtLeastOneValue = arr => arr.some(v => v !== undefined && v !== null && v !== '');
const Dropzone = ({ onGetFile }) => {
  const [msgState, setMsgState] = useState({ title: '', body: '', visible: false });
  const onDrop = useCallback(acceptedFiles => {
    filesToAOAs(acceptedFiles).then(aoas => {
      if (aoas.length > 0) onGetFile(aoas[0].aoa.filter(hasAtLeastOneValue));
      else {
        setMsgState({
          title: 'ייבוא מאקסל',
          body: '!נא לטעון קובץ לא ריק',
          visible: true
        });
      }
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
      <MsgToShow {...msgState} handleClose={() => setMsgState({ ...msgState, visible: false })} />

      <input {...getInputProps()} />
      {isDragActive ? (

        <img src={"https://i.imgur.com/7YQeiQX.png"} style={{
          width: 350,
          height: 350,
          alignSelf: 'center',
        }} />

      ) : (
          <img src={"https://i.imgur.com/7YQeiQX.png"} style={{
            width: 350,
            height: 350,
            alignSelf: 'center',
          }} />
        )}
    </div>
  );
};

export { Dropzone };
