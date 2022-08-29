
window.onload = function () {
  /* chrome.storage.sync.get('emailAddress', function (data) {
       document.getElementById('emailAddress').value = data.emailAddress;
   });

   chrome.storage.sync.get('timeInterval', function (data) {
       if (data == undefined || data == null)
           data = '';
       document.getElementById('timeInterval').value = data.timeInterval;
   });*/

  chrome.storage.sync.get('rules', function (data) {
    console.log('rules',data);
    if (data == undefined || data == null)
      data = '';
    document.getElementById('selector').value = data.rules[0].selector ||'';
    document.getElementById('condition-value').value = data.rules[0].conditionValue||'';
    document.getElementById("content-condition").value = data.rules[0].contentCondition||'';

    document.getElementById('selector2').value = data.rules[1].selector;
    document.getElementById('condition-value2').value = data.rules[1].conditionValue||'';
    document.getElementById("content-condition2").value = data.rules[1].contentCondition||'';
  });

  document.getElementById('save').onclick = function () {

    // 设置xpath路径
    var selector = document.getElementById("selector").value;
    // 设置匹配条件
    var contentCondition = document.getElementById("content-condition").value
    // 设置规则值
    var conditionValue = document.getElementById("condition-value").value;

    // 设置xpath路径
    var selector2 = document.getElementById("selector2").value;
    // 设置匹配条件
    var contentCondition2 = document.getElementById("content-condition2").value
    // 设置规则值
    var conditionValue2 = document.getElementById("condition-value2").value;


    let rules = [{
      contentCondition,
      conditionValue,
      selector
    },{
      contentCondition:contentCondition2,
      conditionValue:conditionValue2,
      selector:selector2
    }]

    chrome.storage.sync.set({
      //timeInterval: document.getElementById('timeInterval').value,
      //emailAddress: document.getElementById('emailAddress').value,
      rules
    }, function (res) {
      console.log('resresres', res);
      chrome.extension.sendMessage({message: 'btStart_click'});
    });

  };

  document.getElementById('cancle').onclick = function () {
    console.log('cancle');
  };

  /* function fcheckMail(myemail) {
       var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
       var check = reg.test(myemail);
       return check;
   }*/
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('options storage');
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
