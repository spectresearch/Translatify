/**
 * @fileoverview Content script
 * @author csalazar@spect.cl (Claudio Salazar)
 */
/*
 * Make the translation
 * @param {e} the event
 */
function translate(e) {
    //Get selected text
    var selection = window.getSelection();
    var text = selection.toString();
    
    //Workaround for click calls and prevent auto-translation again.
    if (text != '' && text != localStorage['text']) {
        //Show notification if text length is more than 5000 chars
        if (text.length >= 5000) {
            $.sticky(chrome.i18n.getMessage('max_gt_text_length'));
            $('.sticky').delay(5000).slideUp('fast');
        }
        else {
            //Get translation
            chrome.extension.sendRequest({service: 'google', text: text}, function(res) {
                //Show translation
                if (text != res.tt) {
                    $.sticky(chrome.i18n.getMessage('tt_start')+res.tt);
                    localStorage['text'] = text;
                    
                    //Hide notification when text is deselected
                    $(document.body).mouseup(function(e) {
                        $('.sticky').delay(1000).slideUp('fast');
                    });
                }
            });
        }
    }
}

//Retrieve extension status
chrome.extension.sendRequest({service: 'status'}, function(res) {
    //Continue if the extension is enabled
    if (res.status == 'enabled') {
        chrome.extension.sendRequest({service: 'hotkey'}, function(res) {
            //Add handler to hotkey
            if (res.hotkey != '')
                $(document.body).bind('keydown', res.hotkey, translate);
            else
                $(document.body).mouseup(translate);
        });
    }
});