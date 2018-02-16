interface JsonObject
{
    [key: string]: any;
}

const iterateObject = (objectToIterate: JsonObject, callback: Function): void => {
  for (let field in objectToIterate) {
    if (objectToIterate.hasOwnProperty(field)) {
      callback(objectToIterate[field], field);
    }
  }
}

const duplicateObject = (objectToDuplicate: JsonObject, duplicatedObject: JsonObject = {}): JsonObject => {
  let visited = {};   
  for (let field in objectToDuplicate) {
    if (objectToDuplicate.hasOwnProperty(field)) {
      if (typeof objectToDuplicate[field] === 'object') {
        duplicatedObject[field] = {...objectToDuplicate[field]};
        duplicateObject(objectToDuplicate[field], duplicatedObject[field]);
      } else {
        duplicatedObject[field] = objectToDuplicate[field];
      }
    }
  }
  return duplicatedObject;
};

export {
  iterateObject,
  duplicateObject
}