let rule
window.onload = function () {
    chrome.storage.sync.get('emailAddress', function (data) {
        document.getElementById('emailAddress').value = data.emailAddress;
    });

    chrome.storage.sync.get('timeInterval', function (data) {
        if (data == undefined || data == null)
            data = '';
        document.getElementById('timeInterval').value = data.timeInterval;
    });

    chrome.storage.sync.get('rules', function (data) {
        console.log('rules',data);
        if (data == undefined || data == null)
            data = '';
        document.getElementById('selector').value = data.rules.selector;
        document.getElementById('condition-value').value = data.rules.conditionValue;
        document.getElementById("content-condition").value = data.rules.contentCondition;
    });

    document.getElementById('btStart').onclick = function () {
        // 设置匹配条件
        var myselect = document.getElementById("content-condition");

        var selectedValue = myselect.value
        // 设置规则值
        var conditionValue = document.getElementById("condition-value").value;

        // 设置xpath路径
        var selector = document.getElementById("selector").value;
        let rules = {
            "contentCondition": selectedValue,
            conditionValue:conditionValue,
            selector
        }

        chrome.storage.sync.set({
            timeInterval: document.getElementById('timeInterval').value,
            emailAddress: document.getElementById('emailAddress').value,
            rules
        }, function (res) {
            console.log('resresres', res);
            chrome.extension.sendMessage({message: 'btStart_click'});
        });

    };

    document.getElementById('btStop').onclick = function () {
        chrome.extension.sendMessage({message: 'btStop_click'});
    };

    function fcheckMail(myemail) {
        var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        var check = reg.test(myemail);
        return check;
    }
};
