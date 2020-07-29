//const sendMessageId = document.getElementById("sendmessageid");
// if (sendMessageId) {
//   sendMessageId.onclick = function() {
//     console.log("hello");
//   };
// }

var access_token = "";

const getProjectsBtn = document.getElementById("getprojects");
if (getProjectsBtn) {
	getProjectsBtn.onclick = function() {
		if (access_token === "") return;

		var ul = document.getElementById("list");

		$.ajax({
			type: 'GET',
			url: 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1',
			headers: {
				"Content-Type":"application/json; charset=utf-8;",
				"Authorization": "Basic " + btoa('Basic' + ":" + access_token)
			}
		}).done(function(res) {
			// returned json file
			//console.log(res);
			let data = res;
			var projects = data.value;
		    for(i = 0; i < projects.length; i++) {
		    	var name = projects[i].name;
		    	var href = "";

		    	$.ajax({
		    		type: 'GET',
		    		url: projects[i].url,
					headers: {
						"Content-Type":"application/json; charset=utf-8;",
						"Authorization": "Basic " + btoa('Basic' + ":" + access_token)
					}
		    	}).done(function(res2) {
		    		console.log(res2);
		    		href = res2["_links"]["web"]["href"];
		    	}).fail(function(err2){
		    		alert("couldn't get URL");
		    	});

		    	var a = document.createElement("a");
				a.setAttribute('href', "https://dev.azure.com/microsoft/Base");
				a.setAttribute('target', "_blank");
		    	var li = document.createElement("li");
		    	li.setAttribute('id', name);
		    	li.appendChild(document.createTextNode(name));
		    	a.appendChild(li);
		    	ul.appendChild(a);
		    }
		}).fail(function(err){
			alert("Try again champ!");
		});


	};
}

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

const tokenInput = document.getElementById("token");
const setTokenBtn = document.getElementById("settoken");
if (setTokenBtn) {
	setTokenBtn.onclick = function() {
		access_token = tokenInput.value;
		tokenInput.value = '';
	}
}