let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [];
let teams = [];
let work_items = [];
var global_project = null;
var global_team = null;
var global_token = null;

const getWorkItemsBtn = document.getElementById("getworkitems-button");
if (getWorkItemsBtn) {
	getWorkItemsBtn.onclick = function() {
		chrome.runtime.sendMessage({cmd: "getWorkItems"}, function(response) {
			if(response.result && response.result.length > 0) {
				work_items = response.result;
			}
			console.log(work_items);
		});
	}
}