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

//停止
function stopTimer(){
  console.log('stopTimerstopTimerstopTimer')
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

$(window).click(function(event) {
  console.log("Click event: ", event);
});

function mouse_down(event){
  var x = event.clientX, y = event.clientY
  var element = document.elementFromPoint(x, y)
  if (!element) {
    console.log("error: no element")
  }
  console.log(readXPath(element))
}
//获取xpath
function readXPath(element) {
  if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    return '//*[@id=\"' + element.id + '\"]';
  }
  //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  if (element == document.body) {//递归到body处，结束递归
    return '/html/' + element.tagName.toLowerCase();
  }
  var ix = 1,//在nodelist中的位置，且每次点击初始化
      siblings = element.parentNode.childNodes;//同级的子元素
  for (var i = 0, l = siblings.length; i < l; i++) {
    var sibling = siblings[i];
    //如果这个元素是siblings数组中的元素，则执行递归操作
    if (sibling == element) {
      return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
      //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
    } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
      ix++;
    }
  }
};

document.onmousedown = mouse_down

