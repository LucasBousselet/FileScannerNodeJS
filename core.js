const fsPromise = require('fs').promises;
const fs = require('fs');
const path = require('path');
const rootDir = path.join('L:/Informatique/Sandbox/FileScannerNodeJS');
//const rootDir = path.join('L:/Informatique/Sandbox');
//const rootDir = path.join('L:/Informatique');

// Cleans the 'output' file 
fs.truncate(path.join(rootDir, 'output.txt'), () => { });
const stream = fs.createWriteStream(path.join(rootDir, 'output.txt'));

async function scanFolderForFileSize(rootPath) {
    console.log('start ...');
    const top = Date.now() / 1000;
    const result = await scanFolderRecursivelyForFileSizes(rootPath);
    
    console.table(
        result.map(result => {
          return {
            "File": result.path + '\\' + result.name,
            "Size (Mo)": result.size
          };
        })
      );
    const stop = Date.now() / 1000;
    console.log('end ... ' + result.length);
    console.log('Finished in ' + (stop - top).toFixed(3) + ' seconds');
};
/*
function scanFolderRecursivelyForFileSizes(rootPath) {
    //console.log('start loop : ' + rootPath);
    return new Promise((resolve, reject) => {
        fsPromise.readdir(rootPath, { withFileTypes: true })
        .then(files => {
            const listPromises = [];
            if (files.length > 1000) { 
                console.log('Folder has too many files to process (>10 000)'); 
                resolve();
            }
            files.forEach(file => {
                if (file.isFile()) {
                    listPromises.push(new Promise((resolve, reject) => {
                        fsPromise.stat(path.join(rootPath, file.name))
                        .then(stat => {
                            stream.write(`${rootPath}\\\\${file.name} <>${(stat.size / (1024 * 1024)).toFixed(3)}</>`)
                            resolve();
                        })
                    }))
                } else {
                    listPromises.push(scanFolderRecursivelyForFileSizes(path.join(rootPath, file.name)));
                }
            });
            Promise.all(listPromises).then(result => {
                resolve();
            });
        })
        .catch(error => console.log(error))
    });
}*/
function scanFolderRecursivelyForFileSizes(rootPath) {
    //console.log('start loop : ' + rootPath);
    return new Promise((resolve, reject) => {
        fsPromise.readdir(rootPath, { withFileTypes: true })
        .then(files => {
            const listPromises = [];
            if (files.length > 1000) { 
                console.log('Folder has too many files to process (>10 000)'); 
                resolve([]);
            }
            files.forEach(file => {
                if (file.isFile()) {
                    listPromises.push(new Promise((resolve, reject) => {
                        fsPromise.stat(path.join(rootPath, file.name))
                        .then(stat => {
                            resolve({
                                name: file.name,
                                path: rootPath,
                                size: (stat.size / (1024 * 1024)).toFixed(3)
                            });
                        })
                    }))
                } else {
                    listPromises.push(scanFolderRecursivelyForFileSizes(path.join(rootPath, file.name)));
                }
            });
            Promise.all(listPromises).then(result => {
                resolve(result.flat());
            });
        })
        .catch(error => console.log(error))
    });
}

scanFolderForFileSize(rootDir);

/**********************
files  = ['core.js', 'package.json', 'test.jpg'];
listFiles = [];
const listPromises = [];
let stat = null;
files.forEach(file => {
    listPromises.push(new Promise((resolve, reject) => {
        stat = fsPromise.stat(path.join(rootDir, file))
        .then(stat =>{
            resolve({
                name: file,
                path: rootDir,
                size: stat.size / (1024 * 1024)
            });
        })
    }))
});
Promise.all(listPromises).then(result => {
    console.log(result);
});******************************/
    
/*fsPromise.stat('test.jpg')
    .then(stat => console.log(`size is ${stat.size / (1024 * 1024)} Mo`))
    .catch(error => console.log(error));
*/
/*fs.readdir('./', (err, files) => {
    if (err) { console.log(err); }
    else { 
        console.log('Async');
        console.log(__dirname);
        const myStat = fs.statSync("test.jpg");
        console.log(myStat.size / (1024 * 1024));
        console.log(files); 
    }
});*/


/*
fs.writeFile('newfile.txt', 'Learn Node FS module', (err) => {
    if (err) {
        throw err;
    }
    console.log('File was created successfully');
});*/