window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;
const fs = nodeRequire("fs");

function loadScript(data){
    var script = document.createElement('script');
    script.text = data;
    document.getElementsByTagName('head')[0].appendChild(script);
}

// var script = document.createElement('meta');
// script.setAttribute("http-equiv","Content-Security-Policy");
// script.setAttribute("content","upgrade-insecure-requests");
// document.getElementsByTagName('head')[0].appendChild(script);

// 注入jquery
let data = fs.readFileSync("public\\js\\jquery.js");
console.log(data.length);

loadScript(data);
