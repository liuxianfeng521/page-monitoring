window.onload = function () {
    console.log('popup load')
    browser.storage.sync.get('xpath').then(data=>{
        document.getElementById('textarea').value = data.xpath||'';
    });
    document.getElementById('btStart').onclick = function () {
        browser.storage.sync.get('rules').then(data=>{
            console.log('rules',data);
            browser.extension.sendMessage({message: 'btStart_click'});
        });
    };

    document.getElementById('btStop').onclick = function () {
        browser.extension.sendMessage({message: 'btStop_click'});
    };
    document.getElementById('btSelect').onclick = function () {
        browser.extension.sendMessage({message: 'btSelect_click'});
    };
    document.getElementById('btFind').onclick = function () {
        let xpath = document.getElementById('textarea').value;
        browser.extension.sendMessage({message: 'btFind_click',xpath});
    };
    document.getElementById('btManualStart').onclick = function () {
        browser.extension.sendMessage({message: 'btManualStart_click'});
    };

    document.getElementById('settings').onclick = function () {
        browser.tabs.create({ url: '/options.html' });
    };

   /* function fcheckMail(myemail) {
        var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        var check = reg.test(myemail);
        return check;
    }*/
};
