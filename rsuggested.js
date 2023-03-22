// content script
console.log("Load content script rsuggested.js");
/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message)
	return true
});
*/
var isRemoveSuggested = true;
var isRemoveFbclid = true;
var suggestedText = "";
var suggested_texts = ["Gợi ý cho bạn", "Suggested for you"];

var timer = setTimeout(function () { removeFbAds() }, 0);
let timer_sleep = 500;

chrome.storage.sync.get(["removeSuggested", "removeFbclid", "suggestedText"], function(items)
{
	isRemoveSuggested = items["removeSuggested"] ?? true;
	isRemoveFbclid = items["removeFbclid"] ?? true;
	suggestedText = items["suggestedText"] ?? "";

	if (suggestedText.length > 0)
		suggested_texts.push(suggestedText);
	//console.log(suggested_texts);
});

function nodeInsertedCallback(event)
{
	clearTimeout(timer);
	timer = setTimeout(function() {
		removeFbAds();
	}, timer_sleep);
};

document.addEventListener("DOMNodeInserted", nodeInsertedCallback);




// FUNCTION REMOVE ADS

function removeFbAds()
{
	if (isRemoveSuggested)
	{
		//console.log("Remove suggestion");
		suggested_texts.forEach(function (text)
		{
			removeSuggested(text);
		})
	}
	if (isRemoveFbclid)
	{
		//console.log("Remove fbclid");
		removeFbclidLinkHref();
	}
}
function removeSuggested(text)
{
	let xpath = "//*[text()='" + text + "']";
	let query = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (let i = 0, length = query.snapshotLength; i < length; ++i) {
		var suggested = query.snapshotItem(i);
		$(suggested).parents("div.x1lliihq, div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z").remove();
	}
}
function removeFbclidLinkHref()
{
	document.querySelectorAll("a[href*='fbclid']").forEach(function (elem)
	{
		var href = decodeURIComponent(elem.href);
		href = href.replace("https://l.facebook.com/l.php?u=", "");
		console.log(href);
		var url = new URL(href);
		var params = new URLSearchParams(url.search);
		params.delete("fbclid");
		params.delete("h");
		params.delete("__tn__");
		params.delete("c[0]");
		href = url.origin + url.pathname + "?" + params.toString();
		// create element
		var link = document.createElement("a");
		link.href = href;
		link.innerText = elem.innerText;
		link.target = "_blank";
		$(elem).replaceWith(link);
	})
}
