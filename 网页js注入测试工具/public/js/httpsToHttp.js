
var script = document.createElement('meta');
script.setAttribute("http-equiv","Content-Security-Policy");
script.setAttribute("content","upgrade-insecure-requests");
document.getElementsByTagName('head')[0].appendChild(script);