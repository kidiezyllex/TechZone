const fs = require('fs'); 
// Import module 'fs' để thao tác với file hệ thống (read/write file)

const filePath = './src/utils/index.ts'; 

let content = fs.readFileSync(filePath, 'utf8'); 

const originalFunction = `export const camelizeConvert = (obj: any) => {
  return _.transform(obj, (acc: any, value, key: any, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelKey] = _.isObject(value) ? camelizeConvert(value) : value;
  });
};`;

const fixedFunction = `export const camelizeConvert = (obj: any) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  return _.transform(obj, (acc: any, value, key: any, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    
    // Nếu value là array thì đệ quy từng phần tử trong array
    if (_.isArray(value)) {
      acc[camelKey] = value.map(item => _.isObject(item) ? camelizeConvert(item) : item);
    } 
    else if (_.isObject(value) && !_.isFunction(value) && value !== null) {
      acc[camelKey] = camelizeConvert(value);
    } 
    else {
      acc[camelKey] = value;
    }
  });
};`;

content = content.replace(originalFunction, fixedFunction); 

fs.writeFileSync(filePath, content, 'utf8'); 
