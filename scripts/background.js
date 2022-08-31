
var hasInject=false;


browser.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log('request',request);
    if(request.message=="btStart_click") {
        browser.tabs.insertCSS(null,{file:"css/page.css"});
        browser.tabs.executeScript(null,{file:"scripts/jquery-1.12.1.min.js"});
        browser.tabs.executeScript(null,{file:"scripts/page.js"});
      hasInject=true;
    }
    if(request.message=="btManualStart_click") {
        console.log('btManualStart_click');
          btManualStart_click();
    }
    if(request.message=="btStop_click") {
      stopTimer();
    }
    if(request.message=="btSelect_click") {
        selectElement();
    }
    if(request.message=="btFind_click") {
        findElement(request.xpath);
    }
      if(request.message=="PageChangedEvent") {
          playNotification(request.content);
      }
    if(request.message=="findElementEvent") {
        browser.storage.sync.set({
            //timeInterval: document.getElementById('timeInterval').value,
            //emailAddress: document.getElementById('emailAddress').value,
            xpath:request.xpath
        });
    }
      
 });

 function stopTimer(){
     console.log('stopTimer');
   if(hasInject) //如果之前未注入gs.js，会报错
       browser.tabs.executeScript(null,{code:"stopTimer();"});
 }
function btManualStart_click(){
    console.log('btManualStart_click');
    browser.tabs.insertCSS(null,{file:"css/page.css"});
    browser.tabs.executeScript(null,{file:"scripts/jquery-1.12.1.min.js"});
    browser.tabs.executeScript(null,{file:"scripts/page.js"}).then(res=>{
        console.log('res',res);
        hasInject=true;
        browser.tabs.executeScript(null,{code:"btManualStart_click();"});
    })
}

function selectElement(){
    console.log('selectElement');
    if(hasInject) //如果之前未注入gs.js，会报错
        browser.tabs.executeScript(null,{code:"selectElement();"}).then(res=>{
            console.log('selectElement res',res)
        });
}

function findElement(xpath){
    console.log('selectElement',xpath);
   // browser.executeScript('findElement(`' + xpath + '`)');
    if(hasInject) //如果之前未注入gs.js，会报错
        browser.tabs.executeScript(null,{code:'findElement(`' + xpath + '`)'}).then(res=>{
            console.log('selectElement res',res)
        });
}

 function playNotification(content){
   /* if(this.audio==null){
      this.audio=new Audio('files/attention.mp3');
      this.audio.loop=true;
      this.audio.play();
    }*/
    var options={ 
          lang: "utf-8",
          icon: "images/eye72.png",
          body: content || "您监控的网页内容发生了改变！"
      };
    var n = new Notification("网页监控助手Demo！", options);
    // n.onclose=function(d){
    //   if(window.audio!=null)
    //   {
    //     window.audio.pause();
    //     window.audio=null;
    //   }
    // };
 }
 
/*
 function sendMail(receiver,subject,message){
   $.post('http://mail.liyumeng.me/SendMail','token=7F830C40B1594B05901779C1D24E2940&receivers='+receiver+'&subject='+subject+'&message='+message,function(dat){console.log(dat);});
 }
*/
function getTest(){
    $.get('https://hm.baidu.com/hm.gif?cc=1&ck=1&cl=24-bit&ds=1366x768&vl=281&ep=%E9%A6%96%E9%A1%B5*99_%E9%A6%96%E9%A1%B5%E9%A1%B5%E9%9D%A2_%E9%80%9A%E7%94%A8%E9%A2%86%E5%9F%9F%E9%A2%86%E5%9F%9F%E5%8F%91%E8%B5%B7%E7%BF%BB%E8%AF%91%E6%AC%A1%E6%95%B0&et=4&ja=0&ln=zh&lo=0&lt=1661839998&rnd=3717740&si=64ecd82404c51e03dc91cb9e8c025574&v=1.2.97&lv=3&api=8_0&sn=8339&r=0&ww=1366&u=https%3A%2F%2Ffanyi.baidu.com%2F%3Faldtype%3D16047%23zh%2Fen%2F%25E9%25AA%258C%25E8%25AF%2581',(res)=>{
        console.log('getTest',res)
    });
}

/*
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('background storage');
    for (key in changes) {
        var storageChange = changes[key];
        console.log('存储键“%s”（位于“%s”命名空间中）已更改。' +
            '原来的值为“%s”，新的值为“%s”。',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});*/
