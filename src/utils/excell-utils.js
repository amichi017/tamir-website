import XLSX from 'xlsx';
import { concatAll } from './general-utils';

const openFile = inputFile => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      resolve();
    };
    fileReader.onload = () => {
      resolve({ fileName: inputFile.name, result: fileReader.result });
    };
    fileReader.readAsArrayBuffer(inputFile);
  });
};

const fileToAOA = ({ fileName, result }) => {
  const res = [];
  if (typeof result !== 'string') {
    const worksheet = XLSX.read(new Uint8Array(result), { type: 'array' });
    worksheet.SheetNames.forEach(function (sheetName) {
      const roa = XLSX.utils.sheet_to_json(worksheet.Sheets[sheetName], { header: 1 });
      if (roa.length) {
        res.push({ fileName, sheetName, aoa: roa });
      }
    });
  }
  return res;
};

const filesToAOAs = files => {
  const openPromises = files.map(openFile);
  return new Promise((resolve, reject) => {
    Promise.all(openPromises).then(openedFiles => {
      resolve(
        concatAll(
          openedFiles
            .filter(x => x !== undefined)
            .map(fileToAOA)
            .filter(aoa => aoa.length !== 0)
        )
      );
    });
  });
};

const aoaToFile = ({ fileName, sheetName = 'Sheet1', aoa }) => {
  if (aoa) {
    const workbook = XLSX.utils.book_new();
    set_right_to_left(workbook);
    const sheet = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFile(workbook, fileName + '.xlsx');
  }
};

const set_right_to_left = wb => {
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Views) wb.Workbook.Views = [];
  if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
  wb.Workbook.Views[0].RTL = true;
};

export { filesToAOAs, aoaToFile };
