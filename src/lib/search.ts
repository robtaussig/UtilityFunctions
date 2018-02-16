import {
  duplicateObject,
  iterateObject
} from './general';

interface JsonObject
{
    [key: string]: any;
}

interface SearchOptionsParams
{
  objectToSearch: any
}

const searchObject = (options: SearchOptionsParams, callback: Function): void => {
  const { objectToSearch } = options;
  let duplicatedObject = duplicateObject(objectToSearch);
  let queue = [duplicatedObject];  
  let stringified;
  while (queue.length > 0) {
    let currentItem = queue.shift();    
    if (typeof currentItem === 'object') {
      for (let key in currentItem) {
        if (currentItem.hasOwnProperty(key) && typeof currentItem[key] === 'object') {        
          queue.push(currentItem[key]);
        } else if (currentItem.hasOwnProperty(key)) {
          callback(currentItem[key]);
        }
      }
    }
    callback(currentItem);
  }
};

const searchObjectForKey = (options: SearchOptionsParams, targetKey: string, caseSensitive: boolean = true): JsonObject[] => {
  const { objectToSearch } = options;
  let searchResults: JsonObject[] = [];
  searchObject({objectToSearch}, (objectToTest: any) => {      
    if (typeof objectToTest === 'object') {      
      iterateObject(objectToTest, (item: any, key: string) => {
        if (caseSensitive && key === targetKey) {
          searchResults.push(item);
        } else if (key.toLowerCase() === targetKey.toLowerCase()) {
          searchResults.push(item);
        }
      });
    } 
  });
  return searchResults;
}

const searchObjectForValue = (options: SearchOptionsParams, targetValue: any, caseSensitive: boolean = true): any[] => {
  const { objectToSearch } = options;
  let searchResults: any[] = [];
  searchObject({objectToSearch}, (objectToTest: any) => {   
    if (typeof objectToTest === 'object') {
      iterateObject(objectToTest, (item: any, key: string) => {
        if (item === targetValue) {
          searchResults.push({[key]: item});
        } else if (typeof item === 'string' && typeof targetValue ==='string') {
          if (caseSensitive === false && item.toLowerCase() === targetValue.toLowerCase()) {
            searchResults.push({[key]: item});
          }
        }
      });
    } else if (typeof objectToSearch === 'string' && typeof targetValue ==='string') {
      if (caseSensitive === false && objectToSearch.toLowerCase() === targetValue.toLowerCase()) {
        searchResults.push(objectToSearch);
      }
    }
  });
  return searchResults;
}

const searchObjectForKeyOrValue = (options: SearchOptionsParams, target: any, caseSensitive: boolean = true): any[] => {
  let foundKeys = searchObjectForKey(options, target, caseSensitive);
  let foundValues = searchObjectForValue(options, target, caseSensitive);
  let results = foundKeys.concat(foundValues);
  return results;
};

export { 
  searchObjectForKey,
  searchObjectForValue,
  searchObjectForKeyOrValue,
  searchObject
}