// options.js

chrome.storage.sync.get(["isRemoveSuggested", "isRemoveFbclid", "suggestedText"], function(items)
{
	var isRemoveSuggested = items["isRemoveSuggested"] ?? true;
	var isRemoveFbclid = items["isRemoveFbclid"] ?? true;
	var suggestedText = items["suggestedText"] ?? "";

	$("#isRemoveSuggested").prop("checked", isRemoveSuggested);
	$("#isRemoveFbclid").prop("checked", isRemoveFbclid);
	$("#suggestedText").val(suggestedText);
});

$("button").click(function ()
{
	var isRemoveSuggested = $("#isRemoveSuggested").is(":checked");
	var isRemoveFbclid = $("#isRemoveFbclid").is(":checked");
	var suggestedText = $("#suggestedText").val();

	//  Save data to storage across their browsers...
	chrome.storage.sync.set({
		"isRemoveSuggested": isRemoveSuggested,
		"isRemoveFbclid": isRemoveFbclid,
		"suggestedText": suggestedText
	},
	function()
	{
		console.log("saved");
	});
})