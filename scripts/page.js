if($('#ymlInfo').length==0)
{
  $('body').prepend("<div id='ymlInfo'>网页监听助手准备运行，正在读取配置数据</div>");
}
else{
  $('#ymlInfo').html("网页监听助手准备运行，正在读取配置数据");
}
  
var timer=null;

var content="网页监听助手准备运行";
var isRunning=false;


init();

function stopTimer(){
  isRunning=false;
  window.onbeforeunload='';
  location.reload();
}


//根据xpath查询获取当节点
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
      rules.forEach(item=>{ // 给添加规则元素绑定监听事件
        let node = x(item.selector);
        node.addEventListener('change', function(event) {
          console.log('changechange',event,item)
          chedkNodeRule(node,item)
      })
      });

    });

  });

  //stopTimer();
  //location.reload();
}

// 根据节点和规则检查符合情况
function chedkNodeRule(node,rule){
  let content = '';
  if(rule.contentCondition==='include'){
    const index = node.value.indexOf(rule.conditionValue)
    if(index ===-1){
      node.style.setProperty('border', 'solid 2px #ff0000');
      content = '输入信息必须包含：'+rule.conditionValue;
      chrome.extension.sendMessage({message:'PageChangedEvent',url:location.href,content});
    }else {
      node.style.setProperty('border', 'solid 0px #ff0000');
    }
  }
  if(rule.contentCondition === 'regex'){
    var reg = eval(rule.conditionValue);// 将正则表达式字符串转为正则表示
    const isTrue = reg.test(node.value)
    if(!isTrue){
      node.style.setProperty('border', 'solid 2px #ff0000');
      content = '输入信息必须符合正则规则：'+rule.conditionValue;
      chrome.extension.sendMessage({message:'PageChangedEvent',url:location.href,content});
    }else {
      node.style.setProperty('border', 'solid 0px #ff0000');
    }
  }
}


