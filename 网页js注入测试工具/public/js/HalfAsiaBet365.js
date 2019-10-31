var url = "1008611";                                //待替换的url
var onceLogin = true;
/* 大小球socket- Start */
var ws_bigball= new WebSocket("ws://127.0.0.1:88636175");

ws_bigball.onopen = function (evt) {
    //组成
    var json = {};
    json.type = "halfAsiaBet365_Js";
    ws_bigball.send(JSON.stringify(json));
    log("我日你奶奶")
    json.type = "login";
    ws_bigball.send(JSON.stringify(json));
};

function log(str) {
    var json = {};
    json.type = "log";
    json.data = str;
    ws_bigball.send(JSON.stringify(json));
}

function sendJsonObj(type,data){
    var json = {};
    json.type = type;
    json.data = data;
    ws_bigball.send(JSON.stringify(json));
}

/*1小时刷新一次 - Start*/
setInterval(function(){
    window.location.href="https://www."+url+".com";
}, 60*60*1000);


function findRecognitionResult(){
    var  bstrRecogn =  $(".notifications").html();
    if( bstrRecogn == undefined ){
        sendJsonObj("ocrSucess","识别成功");
        window.location.href="https://www."+url+".com";
        return;
    }
    var  strRecognition = $(".wmeFlexiField_Validation").text();
    if(strRecognition == "输入的字符有误，请重试。" || strRecognition  == "请仅输入有效的字符。"){
        RecognitionIdentifyingCode();
    }
}

var hostname = null;
var guestname = null;
var hostscore = null;
var guestscore = null;
var odds = null;
var position = null;
var money = null;
var mark = null;
var hostorguest = null;                 //这个是方向
var betting = false;
var type = null;
var lastMoney = null;
var battleodds = null;                  // 比赛的实时赔率
var direction = null;

ws_bigball.onmessage = function (evt) {
    var obj = JSON.parse(evt.data);
    switch (obj.type) {
        case "login": {
            mAccount = obj.data.account;
            mPassward = obj.data.passward;
        }; break;
        case "BigballOrRangqiu": {
            type = obj.data.type;
            hostname = obj.data.hostname;
            guestname = obj.data.guestname;
            hostscore = obj.data.hostscore;
            guestscore = obj.data.guestscore;
            odds = obj.data.odds;
            position = obj.data.position;
            money = obj.data.money;
            mark = obj.data.mark;
            hostorguest= obj.data.hostorguest;
            log("收到投注");
            if( bCanBet ){
                resetBet(false);
                var moneyText = $(".hm-Balance").text();
                moneyText = moneyText.substr(1,moneyText.length);
                log("+++++投注时获得现在的金额++++++"+moneyText);
                if( moneyText != undefined ){
                    lastMoney = parseFloat(moneyText);
                }
                
                checkbet(type,hostname, guestname, hostscore, guestscore, position, odds, money,hostorguest);
            }else{
                log("正在投注此次不接受");
            }
            
        }; break;
        case "restartstatus":{
            /*将下注错误的队伍反馈给上层*/
            OddsWrong("",hostname,guestname);
            /*数据更新后将状态更新*/
            resetBet(true); 
            betting = false;
        };break;
        case "oddsSucess":{
            log("下注成功解除锁定！！！！！！");
            resetBet(true); 
            betting = false;
        };break;
        case "recognitionfinish":{
            var data = obj.data;
            /* 识别正常 */
            
            if (data.length > 0) {
                var strRecognition = data;
                log("识别出来的数据/////++++：" + strRecognition);
                var checkStr = new RegExp("^[A-Za-z0-9]+$");
                if (checkStr.test(strRecognition) && strRecognition.length == 10) {
                    log("检测成功数据为---=====:" + strRecognition);
                    $(".flexiField_Input").click();
                    $(".flexiField_Input").val(strRecognition);
                    $(".accept-button").click();
                    setTimeout(findRecognitionResult, 5000);
                } else {
                    log("检测未成功");
                    RecognitionIdentifyingCode();
                }
            } else {
                //长度小于0失败重新识别
                RecognitionIdentifyingCode();
            }
            
        };break;
        default:
            break;
    }
};
/* 大小球socket- End */

/* 重置参数重新下注 - Start */
var bCanBet = true;                 //初始化可投注
function resetBet(ok) {
    bCanBet = ok;
}
/* 重置参数重新下注 - End */
var bclick_check_view = true;
function clickFinsh(){
    bclick_check_view = false;
}
/*各种点击的定时任务 - Start*/
setInterval(btClick, 1000);
function btClick() {
    /* 获得页面的json分析是否报错 */
    var html = document.getElementsByTagName('html')[0].innerHTML;
    if( html.search("作为世界领先的网络博彩集团之一，我们提供最丰富的滚球盘服务。精彩投注项目包括英超联赛和欧冠联赛足球、网球大满贯，以及CBA和NBA篮球。为了让您轻松观看现场体育比赛，我们提供超过140,000场的现场赛事链接。请立刻开始体育投注，加入我们的娱乐场、扑克牌、游戏及维加斯。") != -1 ){
        window.location.href="https://www."+url+".com";
    }
    /* json解析成功说明页面已经报错 */
    if( (html.search("session-expired") != -1 &&
        html.search("loginStateChanged") != -1 &&
        html.search("sessionTerminated") != -1) ||
        html.search("未连接到互联网") != -1 ||
        html.search("无法访问此网站") != -1 ||
        html.search("重新加载") !=-1
        ){
        sendJsonObj("webviewError");
        log("页面报错，准备重启");
    }

    html = null;
/*
    var identityCheck = $("#remindLater");
    if( identityCheck != undefined ){
        identityCheck.click();
    }*/

    $(".hm-BigButton")[1].click();
    $(".ipc-InPlayClassificationIcon")[1].click();
    $(".wl-PushTargetedMessageOverlay_CloseButton").click();
    $(".hm-BalanceDropDown_RefreshBalance").click();
    $(".wl-PushTargetedMessageOverlay_CloseButton").click();
    $(".ipo-InPlayClassificationMarketSelectorDropdownLabelContainer").click();
 
    $(".lul-DropDownItem_Label")[1].click();
  
    $(".ipc-InPlayClassificationIcon")[1].click();
  
    $(".bw-QuickBetDialog_Button2").click();
  
    $(".bw-BetslipHeader_Item")[1].click();
    

    var txtLabel = $(".mbr-MyBetsHeaderRhs_Button")[3].innerHTML;
    if (txtLabel == "全部" && bclick_check_view) {
        $(".mbr-MyBetsHeaderRhs_Button")[3].click();
        setTimeout(clickFinsh,5000);
    }
   
    txtLabel = $(".mbr-MyBetsHeaderRhs_Button")[1].innerHTML;
    if (txtLabel == "未結算" && !bclick_check_view) {
        $(".mbr-MyBetsHeaderRhs_Button")[1].click();
    }
    
    txtLabel = $(".mbr-MyBetsHeaderRhs_Button")[2].innerHTML;
    if (txtLabel == "未結算" && !bclick_check_view) {
        $(".mbr-MyBetsHeaderRhs_Button")[2].click();
    }

    txtLabel = null;
  
    window.frames["bsFrame"].document.getElementsByClassName("qb-Btn_Switch-false")[0].click();
    
}
/*各种点击的定时任务 - end*/


/* 验证码递归识别 */
function RecognitionIdentifyingCode(){
    log("识别1");
    var imgage = $(".botdetect").get(0);//imgurl 就是你的图片路径
    log("识别2");
    // 调用html2canvas插件
    html2canvas(imgage).then(function(canvas) {
        // 渲染canvas
        log("识别3");
        $('.toCanvas').after(canvas);
        var base64 = canvas.toDataURL('image/png', 1);
        
        var json = {};
        json.type = "recognitionPic";
        //.substr(22,base64.length)
        json.data = base64.substr(22,base64.length);
        log("识别5");
        imgage = null;
        log("识别4");
        ws_bigball.send(JSON.stringify(json));

        //return base64;
    });

}
/* 验证码递归识别 */

/* 登陆任务 -Start */
var bNowIdentifyingCode = false;
var bIsRecognition = true;
var mAccount = null;                    //账号
var mPassward = null;                   //密码
setInterval(login, 12000);
function login(){

    var imgage = $(".botdetect").get(0);
    /* 如果到了识别页面 */
    if (imgage != undefined && bIsRecognition) {
        log("准备识别");
        bIsRecognition = false;
        RecognitionIdentifyingCode();
        //log("base64:"+RecognitionIdentifyingCode());
    }
    imgage = null;

    var  identifyingcode =  $(".wl-UserNotificationsPopup_FrameContainer").html();
    if( identifyingcode != undefined && !bNowIdentifyingCode){
        window.location.href="https://members."+url+".com/members/services/Notifications/Process";
        bNowIdentifyingCode = true;
    } 
    identifyingcode = null;



    //账号密码均已赋值
    if (mAccount != null && mPassward != null && !bNowIdentifyingCode) {
        var logtxt = $(".hm-Login_LoginBtn").text();
        if (logtxt == "登录") {
            $("input:text").val(mAccount);
            $("input:password").val(mPassward);
            $(".hm-Login_LoginBtn").click();
        }
    } else {
        log("账号密码未赋值");
    }

}
/* 登陆任务 -End */


/* 下注失败- Start */
function OddsWrong(type, hostname, guestname) {
    betting = false;
    log("js解锁调用");
    var json = {};
    json.type = "oddwrong";

    var data = {};
    if( hostname == null || guestname == null )
    {
        data.hostname = "";
        data.guestname = "";
        data.mark = "";
    }
    else
    {
        data.hostname = hostname;
        data.guestname = guestname;
        data.mark = mark;
    }
    
    json.data = data;
    ws_bigball.send(JSON.stringify(json));
    
}
/* 下注失败 - End */

/* 大小球 - Start */

function pay_money(money) {
    var zero_money = 1;
    while (zero_money > 0) {
        $(".qb-QuickBetStake_Button")[0].click();
        var s = $(".qb-QuickBetStake_InputField").val();
        log("----当前的钱"+s+"-----");
        zero_money = parseInt(s);
    }

    if (money >= 300) {
        while (money >= 50) {
            $(".qb-QuickBetStake_BumperButton")[0].click();
            money -= 50;
        }
        $(".qb-QuickBetFooter_PlaceButtonContent").click();
    }
    else {
        var size_for = parseInt(money / 5) + 1;
        for (var i = 0; i < size_for; i++) {
            $(".qb-QuickBetStake_Button")[1].click();
        }
        $(".qb-QuickBetFooter_PlaceButtonContent").click();
    }
    betting = true;

}

function betin(i, money) {
    $(".gll-ParticipantCentered_Odds")[i].click();
    setTimeout(pay_money, 2500, money);
}

function countSubstr(str, substr, isIgnore) {
    var count;
    var reg = "";
    if (isIgnore === true) {
        reg = "/" + substr + "/gi";
    } else {
        reg = "/" + substr + "/g";
    }
    reg = eval(reg);
    if (str.match(reg) === null) {
        count = 0;
    } else {
        count = str.match(reg).length;
    }
    return count;
}

// 主队名、客队名、主队得分、客队得分、盘口、赔率
function checkbet(type,hostname, guestname, hostscore, guestscore, pankou, odds, money,dirtion) {
    log("------》"+type+hostname +" "+ guestname+" "+ hostscore+" "+ guestscore+" "+ odds+" "+ pankou+" "+ money+" "+ mark+" "+ dirtion);
    var click_where = 0;
    var nbetsize = getPlaceholderCount($(".ipo-CompetitionRenderer").html(), "ipo-Fixture_TableRow");
    log("------aaaaa》"+nbetsize );
    for (var i = 0; i < nbetsize; i++) {
        var strHost = $(".ipo-TeamStack_TeamWrapper")[3 * i].innerHTML;
        var strGuest = $(".ipo-TeamStack_TeamWrapper")[3 * i + 1].innerHTML;
        var nhostscore = $(".ipo-TeamPoints_TeamScore")[2 * i].innerHTML;
        var nguestscore = $(".ipo-TeamPoints_TeamScore")[2 * i + 1].innerHTML;
        /*校验一次各种参数 校验比分和盘口*/
        if (hostname == strHost && guestname == strGuest) {

            if (hostscore != nhostscore || guestscore != nguestscore) {
                break;                   //跳出接收审判吧
            }

         
            var text = $(".ipo-MainMarkets")[i].innerHTML;
            var findnumber = countSubstr(text, 'ipo-MainMarketRenderer_BlankParticipant', true);

            log("找到的大小："+findnumber);
            
            if( findnumber == 5 || findnumber == 2 ){
                log("检测到的数据大小为:"+findnumber )
                if( findnumber == 2 ){
                    click_where += 3;                           //胜负盘加三做偏移
                }

                if( type == "bigball" ){
                    if (dirtion === "大于") {
                        click_where += 2;
                    }else if (dirtion === "小于") {
                        click_where += 3;
                    }
                }else if( type == "rangqiu" ){
                    log("让球方向："+dirtion);
                    if (dirtion === "主队") {
                        click_where += 0;                          //让球的主队
                    }else if (dirtion === "客队") {
                        click_where += 1;                          //让球的客队
                    }
                }
                log("这里点完的位置："+click_where);

            }else{
                log("不符合------自己为空》");
                break;
            }
            
         


            log("点击的位置："+click_where);
            var str = $(".gll-ParticipantCentered")[click_where].innerHTML;;
  

            var now_odds = str.match(/\d+(\.\d+)?/g);
            var now_pankou;
            if (now_odds.length === 3) {
                now_pankou = (parseFloat(now_odds[0]) + parseFloat(now_odds[1])) / 2;
            }
            else {
                now_pankou = now_odds[0];
            }

            //alert(i+" ;"+now_odds[now_odds.length-1] +"  "+odds  +"和"+now_pankou+" "+pankou);
            log("盘口绝对值前："+now_pankou+" "+"绝对值后"+Math.abs(now_pankou));
            if (parseFloat(now_odds[now_odds.length - 1]) >= odds && parseFloat(Math.abs(now_pankou)) === parseFloat(Math.abs(pankou))) {
                log("不要问下就完事。");
                // 更新赔率
                battleodds = parseFloat(now_odds[now_odds.length - 1]);
                betin(click_where, money);
                return;
            } else {
                /* 赔率和盘口不符合 */
                
                break; //跳出接收审判吧
            }
        }
        else {
            var text = $(".ipo-MainMarkets")[i].innerHTML;
            var findnumber = countSubstr(text, 'ipo-MainMarketRenderer_BlankParticipant', true);
            //alert(findnumber+" 怕"+click_where)
            if (findnumber > 2) {
                click_where += 9 - findnumber;
            }
            else {
                click_where += 7;
            }
        }
    }

    OddsWrong("bigball", hostname, guestname);
    resetBet(true);                    //置为可投注

}

/* 大小球 - End */
setInterval(checkInitWholeBet, 60*1000);
function checkInitWholeBet(){
    var nowtext = $(".hm-Balance").text();
    if(nowtext != undefined && onceLogin){
        onceLogin = false;
        sendJsonObj("ocrSucess","识别成功");
    }
}

/* 大小球防多下(为比赛打上标记防止多下) -Start */
setInterval(checkOddsFinsh, 500);
function checkOddsFinsh() {
    var bTrueOdds = false;
    var betmark = $.trim($(".mbr-OpenBetParticipantRhs_MarketText")[0].innerHTML);
	log("半场的名字是"+betmark);
    if( betmark == "上半场亚洲让分盘" || betmark == "上半场大小盘" && betting){
        $(".mbr-OpenBetParticipantRhs_MarketText")[0].append("Mark");
        bTrueOdds = true;

        /* 下注成功后由qml先收到消息后更新可下注的标记 */
    }
    betmark = null;

    var nowtext = $(".hm-Balance").text();
    nowtext = nowtext.substr(1,nowtext.length);
    log("现在的钱"+nowtext);
    if(betting){
        log("<<<<<正在投注！！！>>>>>");
    }else{
        log("<<<<<pppppp正在投注！！！777777>>>>>");
    }

    /*获取到了现在的金额*/
    if( nowtext != undefined && !bTrueOdds && betting){
        var nowMoney = parseFloat(nowtext);         //提取出字符串中的float
        log("现在的钱:"+nowMoney+" 之前的钱："+lastMoney);
        /* 投注前的钱减去现在的钱*/
        if( lastMoney - nowMoney == money ){
            lastMoney = 9999999;
            bTrueOdds = true;
        }
    }

    /*获取到已下注直接检测通过*/
    var bOddsFinish = $(".qb-QuickBetReceipt_ButtonText").text();
    if( bOddsFinish != undefined && !bTrueOdds && bOddsFinish == "已下注" && betting){
        log("检测页面上的小窗口"+bOddsFinish);
        $(".qb-QuickBetReceipt_Close").click();
        bTrueOdds = true;
    }


    if( bTrueOdds ){
        log("下注成功7777777777777！！！！");
        if( hostname == null || guestname == null || mark == null )
        {
            return;
        }
        var json = {};
        json.type = "betsuccess";
        var data = {};
        data.battlename = hostname+guestname+mark;
        data.hostname = hostname;
        data.guestname = guestname;
        data.hostscore = hostscore;
        data.guestscore = guestscore;
        data.odds = battleodds;
        if(type == "bigball"){
            data.battletype = "大小球";
        }else{
            data.battletype = "让球";
        }
        if( hostorguest === "大于" || hostorguest === "主队"  ){
            data.direction = true;
        }else{
            data.direction = false;
        }
        data.number = position;
        json.data = data;            //返回的值
        ws_bigball.send(JSON.stringify(json));
        betting = false;
    }
}

/* 大小球防多下 -End*/

/* 检测是否赔率发生变化 -Start */
setInterval(oddsChange, 500);
function oddsChange() {
    // 正在下注betting 
    if( betting  ){
        var check = $(".qb-QuickBetFooter").html();
        var rex = "qb-QuickBetFooter_PlaceButtonContent-hidden";
        if( check.length >  rex.length){
            if( check.search(rex) != -1 ){
                $(".qb-QuickBetFooter_PlaceButtonContent").click();
                $(".qb-QuickBetFooter_PlaceButtonContent").click();
                $(".qb-QuickBetFooter_PlaceButtonContent").click();
            }else{
                log("赔率为改变");
            }
        }
        check = null;
    }
}
/* 检测是否赔率发生变化 -End*/


/* 检查子串个数 */
function getPlaceholderCount(str, rex) {
    //统计字符串中包含{}或{xxXX}的个数
    var ncount = 0;
    while (str.length >= rex.length) {
        var go = str.search(rex);
        if (go != -1) {
            ncount++;
            str = str.substr(go + rex.length, str.length);
        } else {
            /* 找不到了跳出去 */
            break;
        }
    }
    return ncount;
}