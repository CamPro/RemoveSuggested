// content script
console.log("Load content script rsuggested.js");
/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    return true
});
*/
var localize_text = "Gợi ý cho bạn";

var timer = setTimeout(function () { removeSuggested(localize_text); }, 0);
let timer_sleep = 250;

function nodeInsertedCallback(event)
{
    clearTimeout(timer);
    timer = setTimeout(function() {
        removeSuggested(localize_text);
    }, timer_sleep);
};

function removeSuggested(text)
{
    console.log("Suggested remove ...");

    let xpath = "//*[text()='" + text + "']";

    let query = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        var suggested = query.snapshotItem(i);
        $(suggested).parents('div.x1lliihq, div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z').remove();
    }
}

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);
