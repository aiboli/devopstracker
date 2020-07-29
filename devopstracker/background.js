let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [];
let teams = [];
let work_items = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.cmd) {
      case "setToken":
        access_token = request.token;
        sendResponse({ result: "ok" });
        break;
      case "getToken":
        sendResponse({ result: access_token });
        break;
      case "getProjects":
        if (access_token === "") {
          sendResponse({ result: "error", message: "PAT required" });
        }
        if (projects.length === 0) {
          console.log("calling API: /projects");
          $.ajax({
            type: 'GET',
            url: 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1',
            headers: {
              "Content-Type":"application/json; charset=utf-8;",
              "Authorization": "Basic " + btoa('Basic' + ":" + access_token)
            }
          }).done(function(res) {
            let data = res;
            projects = data.value;
            console.log({ result: projects });
            sendResponse({ result: projects });
          }).fail(function(err){
            alert("Try again champ!");
            sendResponse({ result: "error", message: "Could not get projects" });
          });
        } else {
          sendResponse({ result: projects });
        }
        break;
      case "getTeams":
        sendResponse({ result: teams });
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

// get the teams information
function getWorkItems(callback) {
	// send request to query all the work items
	$.ajax({
		type: 'POST',
		url: 'https://dev.azure.com/microsoft/ecc7381a-6947-453a-89d7-00907ab894b4/61a6bd9d-6dd4-425b-be60-c4d71b5fd3a8/_apis/wit/wiql?api-version=5.1',
		headers: {
			"Content-Type":"application/json",
			"Authorization": "Basic " + btoa('Basic' + ":" + 'rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya')
		},
		data: JSON.stringify({
			"query": "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.State] <> 'Completed' AND [System.State] <> 'Closed' AND [System.AssignedTo] = @me"
		})
	}).done(function(res) {
		let ids = getWorkItemsList(res);
		// getting work items details
		$.ajax({
			type: 'GET',
			url: `https://dev.azure.com/microsoft/_apis/wit/workitems?ids=${ids.toString()}&api-version=6.0-preview.3`,
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Basic " + btoa('Basic' + ":" + 'rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya')
			},
		}).done(function(res) {
			return callback(res);
		}).fail(function(err){
			console.log(err);
			return callback(err, null);
		})
	}).fail(function(err) {
		console.log(err);
		return callback(err, null);
	});
}

// get all the work items
function getWorkItemsList(data) {
	let workItems = data.workItems;
	let ids = [];
	for (let i = 0; i < workItems.length; i++) {
		ids.push(workItems[i].id);
	}
	return ids;
}