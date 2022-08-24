if($('#ymlInfo').length==0)
{
  $('body').prepend("<div id='ymlInfo'>网页监听助手准备运行，正在读取配置数据</div>");
}
else{
  $('#ymlInfo').html("网页监听助手准备运行，正在读取配置数据");
}
  
var timer=null;

var timeInterval=600;//刷新的时间间隔
var second=0; //当前经历的秒数
var content="网页监听助手准备运行";
var source='';  //初始网页的内容
var timerCount=0; //目前的抓取次数
var isRunning=false;
var startHour=0;
var stopHour=0;
var extInfo='';

chrome.storage.sync.get('timeInterval',function(data){
  timeInterval=data.timeInterval;
  init();
  //startTimer();
});

function timeTick(){
  var time;
  if(second<60){
    time=second+"秒";
  }
  else if(second>=60 && second<3600){
    time=(parseInt)(second/60)+"分"+second%60+"秒";
  }else if(second>=3600){
    time=(parseInt)(second/3600)+"时"+(parseInt)((second%3600)/60)+"分"+(second%3600)%60+"秒";
  }
  content="网页监听助手已运行"+time+",共刷新"+timerCount+"次,每"+timeInterval+"秒刷新一次。"+extInfo;

  
  if(second%timeInterval==0)
  {
    var hour=(new Date()).getHours();
    if(hour<stopHour||hour>=startHour)
    {
      $.get(location.href,function(data){
        console.log('data',data);
        let tmp = data;

        data=data.replace(/<!--[\s\S]+?-->/g,'');

        if(source==''){
          source=data;
        }else if(source.localeCompare(data)!=0){
          let res = x("//*[@id='kw']")
          console.log('resresresres',res);

          res.bind('input propertychange', function(event) {
            console.log('input propertychangeinput propertychangeinput propertychange',event)
            $('.msg').html($(this).val().length + ' characters');
          });

          chrome.extension.sendMessage({message:'PageChangedEvent',url:location.href,source,tmp});
          //stopTimer();
          //location.reload();
        }
        timerCount++;
      });
      extInfo='';
    }else{
      extInfo="目前正处于休息时间，将于"+startHour+"点重新开始工作。";
    }
  }
  second++;
  $('#ymlInfo').html(content);
}
function startTimer(){
  isRunning=true;
  window.onbeforeunload = function(event){   
      return '当前正在监听网页，确认立即退出？'; 
  };
  timer=setInterval(timeTick,1000); //读取时间配置数据
  window.scrollTo(0,0);
}
function stopTimer(){
  clearInterval(timer);
  isRunning=false;
  window.onbeforeunload='';
}

function x(xpath) {
  var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  return result.iterateNext()
}

function init(){
  $.get(location.href,function(data){
    content="网页监听Demo已运行";
    $('#ymlInfo').html(content);
    chrome.storage.sync.get('rules', function (data) {
      console.log('rules.rules',data.rules);
      if (data == undefined || data == null)
       return;
      let rules = data.rules;
      let res = x(rules.selector);
      console.log('changechange',event,rules)
      let content = '';
      res.addEventListener('change', function(event) {
        if(rules.contentCondition==='include'){
           const index = res.value.indexOf(rules.conditionValue)
          if(index ===-1){
            res.style.setProperty('border', 'solid 2px #ff0000');
            content = res.value+'必须包含'+rules.conditionValue;
            chrome.extension.sendMessage({message:'PageChangedEvent',url:location.href,content});
          }else {
            res.style.setProperty('border', 'solid 0px #ff0000');
          }
        }
        if(rules.contentCondition === 'regex'){
          const index = res.value.indexOf(rules.conditionValue)
          if(index ===-1){
            content = res.value+'必须包含'+rules.conditionValue;
            chrome.extension.sendMessage({message:'PageChangedEvent',url:location.href,content});
          }
        }

      });

    });

  });

  //stopTimer();
  //location.reload();
}


