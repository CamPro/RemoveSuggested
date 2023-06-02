// content script
//console.log("Load content script rsuggested.js");
/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message)
	return true
});
*/
var isRemoveSuggested = true;
var isRemoveFbclid = true;
var isRemoveAds = true;
var suggestedText = "";

var suggestedTexts = ["Suggested for you", "Suggested Post", "Gợi ý cho bạn", "Sponsored", "Được tài trợ", "Bài viết gợi ý từ nhóm công khai", "Dựa trên hoạt động gần đây của bạn"];

var feedSelector = "div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z";

var timer = setTimeout(function () { removeOptions() }, 0);
let timer_sleep = 500;

chrome.storage.sync.get(["isRemoveSuggested", "isRemoveFbclid", "isRemoveAds", "suggestedText"], function(items)
{
	isRemoveSuggested = items["isRemoveSuggested"] ?? true;
	isRemoveFbclid = items["isRemoveFbclid"] ?? true;
	isRemoveAds = items["isRemoveAds"] ?? true;
	suggestedText = items["suggestedText"] ?? "";

	if (suggestedText.length > 0)
		suggestedTexts.push(suggestedText);
	//console.log(suggestedTexts);
});

function nodeInsertedCallback(event)
{
	clearTimeout(timer);
	timer = setTimeout(function() {
		removeOptions();
	}, timer_sleep);
};

document.addEventListener("DOMNodeInserted", nodeInsertedCallback);

// FUNCTION REMOVE ADS

function removeOptions()
{
	if (isRemoveSuggested) {
		suggestedTexts.forEach(function (text)
		{
			removeSuggested(text);
		})
	}
	if (isRemoveFbclid) {
		removeFbclidLinkHref();
	}
	if (isRemoveAds) {
		removeAds();
	}
}
function removeSuggested(text)
{
	let xpath = "//*[text()='" + text + "']";
	let query = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (let i = 0, length = query.snapshotLength; i < length; ++i) {
		var suggested = query.snapshotItem(i);
		$(suggested).parents(feedSelector).remove();
	}
}
function removeFbclidLinkHref()
{
	document.querySelectorAll("a[href*='fbclid']").forEach(function (elem)
	{
		var href = decodeURIComponent(elem.href);
		href = href.replace("https://l.facebook.com/l.php?u=", "");
		//console.log(href);
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
function removeAds()
{
	// type ads 1
	var adsUseIds = [];
	document.querySelectorAll("div.__fb-light-mode text[id][y]").forEach(function (elem)
	{
		var suggested = elem;
		var text = suggested.textContent;
		if (suggestedTexts.includes(text))
		{
			adsUseIds.push('<use xlink:href="#'+suggested.id+'"');
		}
	})
	document.querySelectorAll(feedSelector).forEach(function (elem) {
		var suggested = elem;
		adsUseIds.forEach(function (xlinkhref) {
			if (suggested.innerHTML.includes(xlinkhref)) {
				suggested.remove();
			}
		})
	})
	// type ads 2
	document.querySelectorAll("a[href*='ads/about']").forEach(function (elem)
	{
		var suggested = elem;
		$(suggested).parents(feedSelector).remove();
	})
}
function removeTextAsImage()
{
	document.querySelectorAll("div.x1cy8zhl.x78zum5.x1nhvcw1.x1n2onr6.xh8yej3[style*='background-image']").forEach(function (elem)
	{
		var suggested = elem;
		$(suggested).parents(feedSelector).remove();
	})
}

