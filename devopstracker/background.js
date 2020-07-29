let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [];
let teams = [];
let work_items = {};
let user_name = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.cmd) {
      case "getName":
        sendResponse({ result: user_name });
        break;
      case "setName":
        user_name = request.name;
        sendResponse({ result: "set user name ok"});
        break;
      case "setToken":
        access_token = request.token;
        sendResponse({ result: "set token ok" });
        break;
      case "getToken":
        sendResponse({ result: access_token });
        break;
      case "setProjects":
        projects = request.projects;
        sendResponse({result: "set projects ok"});
        break;
      case "getProjects":
        if (access_token === "") {
          sendResponse({ result: "error", message: "PAT required" });
        }
        if(projects.length === 0) {
          sendResponse({ result: "error", message: "Projects arr not set yet" });
        }
        sendResponse({ result: projects });
        break;
      case "getTeams":
        sendResponse({ result: teams });
        break;
      case "setWorkItems":
        work_items = request.workitems;
        sendResponse({result: "set work items ok"});
        break;
      case "getWorkItems":
        sendResponse({ result: work_items });
        break;
      default:
        sendResponse({ result: "error", message: "Invalid or missing 'cmd'" });
        break;
    }


    //return true;
  }
);

// get the teams information
function getMyTeams(callback) {
	$.ajax({
		type: 'GET',
		url: 'https://dev.azure.com/microsoft/_apis/teams?api-version=6.0-preview.3&$mine=true',
		headers: {
			"Content-Type":"application/json; charset=utf-8;",
			"Authorization": "Basic " + btoa('Basic' + ":" + 'rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya')
		}
	}).done(function(res) {
		return callback(res);
	}).fail(function(err) {
		return callback(err, null);
	});
}
