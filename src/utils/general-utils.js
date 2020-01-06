const concatAll = aoaoa => {
  const aoas = [];
  aoaoa.forEach(subArray => {
    subArray.forEach(subArrayValue => {
      aoas.push(subArrayValue);
    });
  });
  return aoas;
};

const entriesToObj = entries =>
  entries.reduce((prev, curr) => {
    const [key, val] = curr;
    return { ...prev, [key]: val };
  }, {});

const zip = (arr1, arr2) => arr1.map((elm, i) => [elm, arr2[i]]);

const exists = (obj, field) => obj[field];

const checkIfAllFieldsHaveValue = (fields, obj, hasValue = exists) => {
  return fields.every(field => hasValue(obj, field));
};

const removeEmptyFields = obj => entriesToObj(Object.entries(obj).filter(([, v]) => v));

export { concatAll, entriesToObj, zip, checkIfAllFieldsHaveValue, removeEmptyFields };
