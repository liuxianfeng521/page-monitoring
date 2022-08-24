
var hasInject=false;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log('request',request);
    if(request.message=="btStart_click")
    {
      stopTimer();
      chrome.tabs.insertCSS(null,{file:"css/page.css"});
      chrome.tabs.executeScript(null,{file:"scripts/jquery-1.12.1.min.js"});
      chrome.tabs.executeScript(null,{file:"scripts/page.js"});
      hasInject=true;
    }
    
    if(request.message=="PageChangedEvent")
    {
      playNotification(request.content);
    }
    
    if(request.message=="btStop_click")
    {
      stopTimer();
    }
      
 });
 
 function stopTimer(){
   if(hasInject) //如果之前未注入gs.js，会报错
        chrome.tabs.executeScript(null,{code:"stopTimer();"}); 
 }
 
 this.audio = null;
 function playNotification(content){
    if(this.audio==null){
      this.audio=new Audio('files/attention.mp3');
      this.audio.loop=true;
      this.audio.play();
    }
    
    var options={ 
          lang: "utf-8",
          icon: "images/eye.png",
          body: content || "您监控的网页内容发生了改变！"
      };
    var n = new Notification("网页监控助手Demo！", options);
    n.onclose=function(d){
      if(window.audio!=null)
      {
        window.audio.pause();
        window.audio=null;
      }
    };
 }
 
 function sendMail(receiver,subject,message){
   $.post('http://mail.liyumeng.me/SendMail','token=7F830C40B1594B05901779C1D24E2940&receivers='+receiver+'&subject='+subject+'&message='+message,function(dat){console.log(dat);});
 }

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('存储键“%s”（位于“%s”命名空间中）已更改。' +
            '原来的值为“%s”，新的值为“%s”。',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});