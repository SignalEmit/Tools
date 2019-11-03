window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;
// const fs = nodeRequire("fs");

// function loadScript(data){
//     var script = document.createElement('script');
//     script.text = data;
//     document.getElementsByTagName('head')[0].appendChild(script);
// }

// // var script = document.createElement('meta');
// // script.setAttribute("http-equiv","Content-Security-Policy");
// // script.setAttribute("content","upgrade-insecure-requests");
// // document.getElementsByTagName('head')[0].appendChild(script);

// // 注入jquery
// let data = fs.readFileSync("public\\js\\jquery.js");
// console.log(data.length);

// loadScript(data);




// 下面是测试代码
function loadScript(url, callback, dataName, dataDeps){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if(dataName){
        script.setAttribute("data-name",dataName);
    }
    if(dataDeps){
        script.setAttribute("data-deps",dataDeps);
    }
    if(script.readyState){//IE
        script.onreadystatechange = function(){
            if(script.readyState == 'loaded' || script.readyState == 'complete'){
                script.onreadystatechange = null;
                callback()
            }
        }
    }else{//Other
        script.onload = function(){
            callback();
        }
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}


loadScript('http://127.0.0.1:23456/public/js/jquery.js', function () {
});
loadScript('http://127.0.0.1:23456/public/js/html2canvas.js', function () {
});
loadScript('http://127.0.0.1:23456/public/js/canvas2image.js', function () {
});

/*
loadScript('http://127.0.0.1/JS/truejquery.js', function () {
});
loadScript('http://127.0.0.1/JS/html2canvas.js', function () {
});
loadScript('http://127.0.0.1/JS/canvas2image.js', function () {
});*/
