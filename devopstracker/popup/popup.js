//const sendMessageId = document.getElementById("sendmessageid");
// if (sendMessageId) {
//   sendMessageId.onclick = function() {
//     console.log("hello");
//   };
// }

let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [];
let teams = [];
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

const getProjectsBtn = document.getElementById("getprojects");
if (getProjectsBtn) {
	getProjectsBtn.onclick = function() {
		if (projects.length > 0) return;

		chrome.runtime.sendMessage({cmd: "getProjects"}, function(response) {
			if(response.result && response.result.length > 0) {
				projects = response.result;
				fillProjectsDropdown();
				return;
			}
		})

		if (access_token === "") {
			chrome.runtime.sendMessage({cmd: "getToken"}, function(response) {
				console.log(response);
				var token = response.result;
				if (token === "") return;
				access_token = token;
			});
		}

		if(!projects.length) {
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
			// sort projects
			projects.sort(function(a, b) {
				let a_name = a.name.toUpperCase();
				let b_name = b.name.toUpperCase();
				if (a_name > b_name) {
					return 1;
				} else if (a_name < b_name) {
					return -1;
				} else {
					return 0;
				}
			});

			chrome.runtime.sendMessage({ cmd: "setProjects", projects: projects }, function(response) {
				console.log(response);
			});

			fillProjectsDropdown();

          }).fail(function(err){
            alert("Try again champ!");
            return;
          });
		}
		//var ul = document.getElementById("list");

		// $.ajax({
		// 	type: 'GET',
		// 	url: 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1',
		// 	headers: {
		// 		"Content-Type":"application/json; charset=utf-8;",
		// 		"Authorization": "Basic " + btoa('Basic' + ":" + access_token)
		// 	}
		// }).done(function(res) {

		// });
		// if (access_token === "") {
		// 	chrome.runtime.sendMessage({cmd: "getToken"}, function(response) {
		// 		console.log(response);
		// 		var token = response.result;
		// 		if (token === "") return;
		// 		access_token = token;
		// 	});
		// }

		// var projects = [];

		// chrome.runtime.sendMessage({cmd: "getProjects"}, function(response) {
		// 	console.log(response);
		// 	if(!response.result || response.result === "error") return;
		// 	projects = response.result;
		// });

		// for(i = 0; i < projects.length; i++) {
	    // 	let name = projects[i].name;
		// 	var ul = document.getElementById("list");
		// 	var li = document.createElement("li");
		// 	li.setAttribute('id', name);
		// 	li.appendChild(document.createTextNode(name));
		// 	ul.appendChild(li);
	    // }
	};
}
// listeners

// const projectsDropdown = document.getElementById("project-list");
// if (projectsDropdown) {
// 	projectsDropdown.onchange = function() {

// 	}
// }

$('#project-list').on('change', function() {
	let projectId = $(this).val();//$("#project-list").find(':selected').attr('id');
	$('#selected-project').html($('#project-list option:selected').html());
	console.log("project id: " + projectId);
	getTeamsByProject(projectId, function(res) {
		let data = res;
		teams = data.value;
		// sort projects
		teams.sort(function(a, b) {
			let a_name = a.name.toUpperCase();
			let b_name = b.name.toUpperCase();
			if (a_name > b_name) {
				return 1;
			} else if (a_name < b_name) {
				return -1;
			} else {
				return 0;
			}
		});
		$('#team-list').empty();
		for(i = 0; i < teams.length; i++) {
			$('#team-list').append(createTeamOption(teams[i]));
		}
	});
});

$('#team-list').on('change', function() {
	$('#selected-team').html($('#team-list option:selected').html());
});

// get work items button
$('#launchtracker').on('click', function() {
	let projectId = global_project ? global_project : $('#project-list').val();
	let teamId = global_team ? global_team : $('#team-list').val();
	let projectName = $('#selected-project').html() ? $('#selected-project').html() : $('#project-list option:selected').html();
	let teamName = $('#selected-team').html() ? $('#selected-team').html() : $('#team-list option:selected').html();
	getWorkItems(projectId, teamId, function(data, error) {
		// if success
		if (data) {
			// cache the data, using chrome local storage
			chrome.storage.sync.set({projectId: projectId}, function() {
				console.log('project is set to ' + projectId);
			});
			chrome.storage.sync.set({teamId: teamId}, function() {
				console.log('teamId is set to ' + teamId);
			});
			chrome.storage.sync.set({token: access_token}, function() {
				console.log('token is set to ' + access_token);
			});
			chrome.storage.sync.set({projectName: projectName}, function() {
				console.log('projectName is set to ' + projectId);
			});
			chrome.storage.sync.set({teamName: teamName}, function() {
				console.log('teamName is set to ' + teamName);
			});
			global_project = projectId;
			global_team = teamId;
			global_token = access_token;
			console.log(data);
			// go to new page
			chrome.tabs.create({url: 'tracker/tracker.html'})
		} else {
			console.log(error);
		}
	});
});

//clear storage button
$('#clearsetting').on('click', function() {
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
	$('#project-list').show();
	$('#team-list').show();
	$('#selected-project').html('');
	$('#selected-team').html('');
	$('#selected-project').hide();
	$('#selected-team').hide();
	$('.settoken-button').attr('disabled', false);
	$('.getprojects-button').attr('disabled', false);
});

function createTeamOption(team) {
	let option = `<option value="${team.id}">${team.name}</option>`;
	return option;
}

function getTeamsByProject(projectId, callback) {
  $.ajax({
		type: 'GET',
		url: `https://dev.azure.com/microsoft/_apis/projects/${projectId}/teams?api-version=6.0-preview.3`,
		headers: {
			"Content-Type":"application/json; charset=utf-8;",
			"Authorization": "Basic " + btoa('Basic' + ":" + 'rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya')
		}
	}).done(function(res) {
		return callback(res);
	}).fail(function(err) {
		return callback(null, err);
	});
}

function getWorkItems(projectid, teamid, callback) {
	// send request to query all the work items
	$.ajax({
		type: 'POST',
		url: `https://dev.azure.com/microsoft/${projectid}/${teamid}/_apis/wit/wiql?api-version=5.1`,
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
			return callback(null, err);
		})
	}).fail(function(err) {
		console.log(err);
		return callback(null, err);
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

function fillProjectsDropdown() {
	for(i = 0; i < projects.length; i++) {
		let name = projects[i].name;
		// create project button
		let option = `<option value="${projects[i].id}">${name}</option>`;
		$('#project-list').append(option);
	}
}

const tokenInput = document.getElementById("token");
const setTokenBtn = document.getElementById("settoken");
if (setTokenBtn) {
	setTokenBtn.onclick = function() {
		let pat = tokenInput.value;
		if (pat === "") return;
		access_token = pat;
		chrome.runtime.sendMessage({cmd: "setToken", token: access_token}, function(response) {
			console.log(response);
		});
		tokenInput.value = '';
	}
}