setInterval(()=>{
    window.frames["messageWindow"].document.getElementsByClassName("flexiField_Input")[0].val("asd");
    // 验证码按钮点击
    window.frames["messageWindow"].document.getElementsByClassName("accept-button")[0].click();

    window.frames["messageWindow"].document.getElementById("CaptchaInput").value = 'm6xxhha6vs';
    window.frames["messageWindow"].document.getElementsByClassName("accept-button")[0].click();


},2*1000);