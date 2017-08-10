const fs = require('fs');
const path = require('path');
const cp = require('fs-copy');
const mime = require('mime-types');
const chalk = require('chalk');

var currentPath = path.resolve();
var newExt = process.argv[2];

// Data
var today = new Date();
var d = today.getDate(),
    m = today.getMonth(),
    y = today.getFullYear();
var newPath = path.resolve(`./fra-renamed_${d}${m}${y}`);


console.log(chalk.green.bold(`
###############################################################
                                    
      _/_/_/_/  _/_/_/      _/_/    
     _/        _/    _/  _/    _/   
    _/_/_/    _/_/_/    _/_/_/_/    
   _/        _/    _/  _/    _/     Fast Replace All
  _/        _/    _/  _/    _/      v. 1.0
                                                                                       
###############################################################`));
console.log(chalk.cyan(`You choose to rename in ".${newExt}": ${mime.lookup(newExt)}
###############################################################
`))
var separator = '###############################################################';

var showFilesRenamed = function (renamed) {
    return console.log(chalk.cyan(`###############################################################

Files renamed: ${renamed} \n`));
}

const Fra = function (newPath, currentPath, newExt) {
    // Props
    const self = this;
    this.counter = 0;
    // Methods
    this.fileName = function (file) {
        let oldExt = file.split('.')[file.split('.').length - 1];
        return {
            oldName: file.replace(new RegExp('.' + oldExt + '$'), ''),
            oldExt: oldExt
        }
    }
    this.folderNotExists = function (newPath, newExt) {
        if (!fs.existsSync(newPath))
            fs.mkdirSync(newPath);
    }
    this.cpFile = function (file, newPath, currentName, prevExt, newExt) {
        cp(file, `${newPath}/${currentName}.${newExt}`);
        console.log(chalk.gray(`${currentName}.${prevExt} -> ${chalk.white(currentName + '.' + newExt)}`));
        self.counter++;
    }

    this.filterByExt = function () { }

    fs.readdir(currentPath, (err, files) => {
        var totalFiles = files.length;

        self.folderNotExists(newPath);

        return files.forEach((file) => {
            var fileInfo = self.fileName(file);
            var prevExt = fileInfo.oldExt;
            var currentName = fileInfo.oldName;

            fs.lstat(file, (err, stats) => {
                if (err)
                    return console.log(err); //Handle error

                if (stats.isFile()) {
                    self.cpFile(file, newPath, currentName, prevExt, newExt)
                }

                
            })
        })
    })
}

new Fra(newPath, currentPath, newExt)