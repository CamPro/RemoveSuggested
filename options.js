// options.js

chrome.storage.sync.get(["isRemoveSuggested", "isRemoveFbclid", "isRemoveAds", "suggestedText"], function(items)
{
	var isRemoveSuggested = items["isRemoveSuggested"] ?? true;
	var isRemoveFbclid = items["isRemoveFbclid"] ?? true;
	var isRemoveAds = items["isRemoveAds"] ?? true;
	var suggestedText = items["suggestedText"] ?? "";

	$("#isRemoveSuggested").prop("checked", isRemoveSuggested);
	$("#isRemoveFbclid").prop("checked", isRemoveFbclid);
	$("#isRemoveAds").prop("checked", isRemoveAds);
	$("#suggestedText").val(suggestedText);
});

$("button").click(function ()
{
	var isRemoveSuggested = $("#isRemoveSuggested").is(":checked");
	var isRemoveFbclid = $("#isRemoveFbclid").is(":checked");
	var isRemoveAds = $("#isRemoveAds").is(":checked");
	var suggestedText = $("#suggestedText").val();

	//  Save data to storage across their browsers...
	chrome.storage.sync.set({
		"isRemoveSuggested": isRemoveSuggested,
		"isRemoveFbclid": isRemoveFbclid,
		"isRemoveAds": isRemoveAds,
		"suggestedText": suggestedText
	},
	function()
	{
		console.log("saved");
	});
})
