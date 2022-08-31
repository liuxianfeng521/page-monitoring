let content="网页监听助手准备运行";
let isRunning=false;
let targetSelector ;
if($('#ymlInfo').length==0) {
  $('body').prepend("<div id='ymlInfo'>网页监听助手准备运行，正在读取配置数据</div>");

}else{
  $('#ymlInfo').html("网页监听助手准备运行，正在读取配置数据");
}


init();

function init(){
  console.log('init');
  $.get(location.href,function(data){
    content="网页监听Demo已运行";
    $('#ymlInfo').html(content);
    chrome.storage.sync.get('rules', function (data) {
      console.log('rules.rules',data.rules);
      if (data == undefined || data == null)
       return;
      let rules = data.rules;
      rules.forEach(item=>{ // 给添加规则元素绑定监听事件
        let node = xpathToNode(item.selector);
        if(node){
          node.addEventListener('change', function(event) {
            console.log('changechange',event,item)
            chedkNodeRule(node,item)
          })
        }
      });

    });

  });

  //stopTimer();
  //location.reload();
}

//停止
function stopTimer(){
  console.log('stopTimerstopTimerstopTimer')
  isRunning=false;
  window.onbeforeunload='';
  location.reload();
}
//手动开始
function btManualStart_click(){
  console.log('btManualStart_click');
  content="网页监听手动Demo已运行";
  if($('#manualCartInfo').length==0)
  {
    $('body').prepend("<div id='manualCartInfo'><div class='button-container'>" +
        +"wwwwwwww"+
        "</div></div>");

  }
  else{
    $('#manualCartInfo').html("网页监听助手准备运行，正在读取配置数据");
  }
  return 'tees'

}


//根据xpath查询获取当节点
function xpathToNode(xpath) {
  var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  return result.iterateNext()
};

// 根据节点和规则检查符合情况
function chedkNodeRule(node,rule){
  let content = '';
  if(rule.contentCondition==='include'){
    const index = node.value.indexOf(rule.conditionValue)
    if(index ===-1){
      node.style.setProperty('border', 'solid 2px #ff0000');
      content = '输入信息必须包含：'+rule.conditionValue;
      browser.extension.sendMessage({message:'PageChangedEvent',url:location.href,content});
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
      browser.extension.sendMessage({message:'PageChangedEvent',url:location.href,content});
    }else {
      node.style.setProperty('border', 'solid 0px #ff0000');
    }
  }
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
}

// 选择元素
function  selectElement(){
  targetSelector = new TargetSelector( (element, win)=> {
    console.log('element',element,win);
    if (element && win) {
      const target = readXPath(element);
      console.log('target',target);
      browser.storage.sync.set({
        //timeInterval: document.getElementById('timeInterval').value,
        //emailAddress: document.getElementById('emailAddress').value,
        xpath:target
      })
    }
    targetSelector = null;
  },  () =>{
    console.log('cleanupCallback')
    targetSelector = null;
  });
}

//验证元素
function findElement(xpath){
  const  element = xpathToNode(xpath);
  showElement(element);
}

// 显示验证元素效果
function showElement(element){
  try{
    const highlightElement = document.createElement("div");
    highlightElement.id = "selenium-highlight";
    document.body.appendChild(highlightElement);
    const bodyRects = document.documentElement.getBoundingClientRect();
    const elementRects = element.getBoundingClientRect();
    highlightElement.style.left = parseInt(elementRects.left - bodyRects.left) + "px";
    highlightElement.style.top = parseInt(elementRects.top - bodyRects.top) + "px";
    highlightElement.style.width = parseInt(elementRects.width) + "px";
    highlightElement.style.height = parseInt(elementRects.height) + "px";
    highlightElement.style.position = "absolute";
    highlightElement.style.zIndex = "100";
    highlightElement.style.display = "block";
    highlightElement.style.pointerEvents = "none";
    highlightElement.className = "active-selenium-highlight";
    setTimeout(() => {
      document.body.removeChild(highlightElement);
    }, 500);
    return "element found";
  } catch (e) {
    return "element not found";
  }
};

function TargetSelector(callback, cleanupCallback) {
  this.callback = callback;
  this.cleanupCallback = cleanupCallback;

  // This is for XPCOM/XUL addon and can't be used
  //var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  //this.win = wm.getMostRecentWindow('navigator:browser').getBrowser().contentWindow;

  // Instead, we simply assign global content window to this.win
  this.win = window;
  const doc = this.win.document;
  const div = doc.createElement("div");
  div.setAttribute("style", "display: none;");
  doc.body.insertBefore(div, doc.body.firstChild);
  this.div = div;
  this.e = null;
  this.r = null;
  doc.addEventListener("mousemove", this, true);
  doc.addEventListener("click", this, true);
}

TargetSelector.prototype.cleanup =  function () {
  try {
    if (this.div) {
      if (this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
      }
      this.div = null;
    }
    if (this.win) {
      const doc = this.win.document;
      doc.removeEventListener("mousemove", this, true);
      doc.removeEventListener("click", this, true);
    }
  } catch (e) {
    if (e != "TypeError: can't access dead object") {
      throw e;
    }
  }
  this.win = null;
  if (this.cleanupCallback) {
    this.cleanupCallback();
  }
}

TargetSelector.prototype.handleEvent =  function (evt) {
  evt.preventDefault();
  evt.stopPropagation();
  switch (evt.type) {
    case "mousemove":
      this.highlight(evt.target.ownerDocument, evt.clientX, evt.clientY);
      break;
    case "click":
      console.log('click');
      if (evt.button == 0 && this.e && this.callback) {
        this.callback(this.e, this.win);
      } //Right click would cancel the select
      evt.preventDefault();
      evt.stopPropagation();
      this.cleanup();
      break;
  }
}

TargetSelector.prototype.highlight =  function (doc, x, y) {
  if (doc) {
    const e = doc.elementFromPoint(x, y);
    if (e && e != this.e) {
      this.highlightElement(e);
    }
  }
}

TargetSelector.prototype.highlightElement =  function (element) {
  if (element && element != this.e) {
    this.e = element;
  } else {
    return;
  }
  const r = element.getBoundingClientRect();
  const or = this.r;
  if (r.left >= 0 && r.top >= 0 && r.width > 0 && r.height > 0) {
    if (or && r.top == or.top && r.left == or.left && r.width == or.width && r.height == or.height) {
      return;
    }
    this.r = r;
    const style = "pointer-events: none; position: absolute; background-color: rgb(78, 171, 230); opacity: 0.4; border: 1px solid #0e0e0e; z-index: 100;";
    const pos = "top:" + (r.top + this.win.scrollY) + "px; left:" + (r.left + this.win.scrollX) + "px; width:" + r.width + "px; height:" + r.height + "px;";
    this.div.setAttribute("style", style + pos);
  } else if (or) {
    this.div.setAttribute("style", "display: none;");
  }
}


