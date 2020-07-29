let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [];
let teams = [];
let user_name = "";
let work_items = [];
var global_project = null;
var global_team = null;
var global_token = null;

// check if there is cache
chrome.storage.sync.get(['projectId', 'teamId', 'token','projectName', 'teamName'], function(result) {
	console.log(result);
	// if it is cached
	if (result.projectId && result.teamId && result.token) {
		// disable buttons and hide input fields
		$('#project-list').hide();
		$('#team-list').hide();
		$('#selected-project').html(result.projectName);
		$('#selected-team').html(result.teamName);
		$('#selected-project').show();
		$('#selected-team').show();
		$('.settoken-button').attr('disabled', true);
		$('.getprojects-button').attr('disabled', true);
		global_project = result.projectId;
		global_team = result.teamId;
		global_token = result.token;
	} else {
		chrome.storage.sync.set({projectId: null}, function() {
			console.log('project is set to ' + null);
		});
		chrome.storage.sync.set({teamId: null}, function() {
			console.log('teamId is set to ' + null);
		});
		chrome.storage.sync.set({token: null}, function() {
			console.log('token is set to ' + null);
		});
		chrome.storage.sync.set({teamName: null}, function() {
			console.log('teamId is set to ' + null);
		});
		chrome.storage.sync.set({projectName: null}, function() {
			console.log('token is set to ' + null);
		});
		global_project = null;
		global_team = null;
		global_token = null;
	}
});

chrome.runtime.sendMessage({cmd: "getName"}, function(response) {
	console.log("called getName");
	if(!response.result || response.result.length === 0) return;
	console.log("got response");
	user_name = response.result;
	const helloText = document.getElementById("hello");
	helloText.innerHTML = "Hello, " + user_name[0];
})

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