import * as fs from 'fs';

export function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
}
