var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList);  //递归读取文件
        } else {
            filesList.push(fullPath);
        }
    });
    return filesList;
}

var arguments = process.argv.splice(2);
var filesList = [];
readFileList(arguments[0], filesList);

var JavaScriptObfuscator = require('javascript-obfuscator');
for (let i = 0; i < filesList.length; i++) {
    let filepath = filesList[i];
    let houzhui = filepath.substr(filepath.length - 3, filepath.length - 1);
    if (houzhui == ".js") {
        console.log("["+filepath+"] 加密中请稍后。");
        let data = fs.readFileSync(filepath, "utf-8");
        let obfuscationResult = JavaScriptObfuscator.obfuscate(data,
            {
                compact: false,
                controlFlowFlattening: true
                // controlFlowFlatteningThreshold: 1,
                // deadCodeInjection: true,
                // deadCodeInjectionThreshold: 1,
                // debugProtection: true,
                // debugProtectionInterval: true,
                // disableConsoleOutput: true,
                // identifierNamesGenerator: 'hexadecimal',
                // log: false,
                // renameGlobals: false,
                // rotateStringArray: true,
                // selfDefending: true,
                // stringArray: true,
                // stringArrayEncoding: 'rc4',
                // stringArrayThreshold: 1,
                // transformObjectKeys: true,
                // unicodeEscapeSequence: false
            }
        );

        fs.writeFileSync(filepath, obfuscationResult.getObfuscatedCode());
        console.log("["+filepath+"] 文件加密成功。");
    }
        
}



