import {
  iterateObject
} from './general';

interface JsonObject
{
    [key: string]: any;
}

const convertCsvToJson = (csv: string): JsonObject[] => {
  let lines = csv.split('\n');
  let fields = lines[0].split(',');
  let jsonArray = [];
  for (let i = 1; i < lines.length; i++) {
    let currentLine = lines[i].split(',');    
    let currentJsonObject: JsonObject = {};
    for (let j = 0; j < currentLine.length; j++) {
      currentJsonObject[fields[j]] = currentLine[j];
    }
    jsonArray.push(currentJsonObject);
  }
  return jsonArray;
};

const createLineFromJsonObjectAndAppendToCsvString = (jsonObject: JsonObject, fields: string[]): string => {
  let lineString = '';

  for (let i = 0; i < fields.length; i++) {
    let currentField = fields[i];    
    if (i === fields.length - 1) {      
      lineString += `${jsonObject[currentField]}`;      
    } else {      
      lineString += `${jsonObject[currentField]},`;      
    }
  }
  return lineString;
};

const generateCsvFromJsonWithFields = (json: JsonObject[], fieldsString: string, fields: string[]): string => {
  let csvString = fieldsString; 
  for (let i = 0; i < json.length; i++) {
    let currentJson = json[i];
    csvString += '\n';
    csvString += createLineFromJsonObjectAndAppendToCsvString(currentJson, fields);    
  }  
  return csvString;
};

const handleCsvFields = (json: JsonObject): { fieldsString: string, fields: string[]} => {
  let numFields = Object.keys(json).length;
  let fieldsString = '';
  let fields = [];

  for (let field in json) {
    fields.push(field);
    numFields--;
    if (numFields === 0) {
      fieldsString += `${field}`;
    } else {
      fieldsString += `${field},`;
    }
  }
  return {
    fieldsString,
    fields
  };
};

const convertJsonToCsv = (json: JsonObject[]): string => {     
  let {
    fieldsString,
    fields
  } = handleCsvFields(json[0]);

  let csvString = generateCsvFromJsonWithFields(json, fieldsString, fields);
  return csvString;
};

const convertObjectToArray = (objectToConvert: JsonObject, keyName?: string): JsonObject[] => {
  let objectArray:any[] = [];
  iterateObject(objectToConvert, (item: any, field: string) => {
    let currentObject = {
      ...item
    };

    if (keyName) {
      currentObject[keyName] = field;
    }
    objectArray.push(currentObject);
  });  
  return objectArray;
};

const convertArrayToObject = (arrayToConvert: any[], keyName?: string): JsonObject => {
  let convertedObject: JsonObject = {};
  for (let i = 0; i < arrayToConvert.length; i++) {
    let currentItem = arrayToConvert[i];
    if (keyName) {
      convertedObject[currentItem[keyName]] = currentItem;
    } else {
      convertedObject[i] = currentItem;
    }
  }
  return convertedObject;
}


export {
  convertCsvToJson,
  convertJsonToCsv,
  convertObjectToArray,
  convertArrayToObject
}