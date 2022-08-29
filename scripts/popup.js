window.onload = function () {
    console.log('popup load')
    chrome.storage.sync.get('xpath', function (data) {
        document.getElementById('textarea').value = data.xpath;
    });

    document.getElementById('btStart').onclick = function () {
        chrome.storage.sync.get('rules', function (data) {
            console.log('rules',data);
            chrome.extension.sendMessage({message: 'btStart_click'});
        });
    };

    document.getElementById('btStop').onclick = function () {
        chrome.extension.sendMessage({message: 'btStop_click'});
    };
    document.getElementById('btFind').onclick = function () {
        chrome.extension.sendMessage({message: 'btFind_click'});
    };

    document.getElementById('settings').onclick = function () {
        chrome.tabs.create({ url: '/options.html' });
    };

   /* function fcheckMail(myemail) {
        var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        var check = reg.test(myemail);
        return check;
    }*/
};
