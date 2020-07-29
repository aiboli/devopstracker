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

const getProjectsBtn = document.getElementById("getprojects");
if (getProjectsBtn) {
	getProjectsBtn.onclick = function() {
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
			console.log(projects);
			for(i = 0; i < projects.length; i++) {
				let name = projects[i].name;
				// create project button
				$('#project-list').append(createProjectOption(projects[i]));
			}
          }).fail(function(err){
            alert("Try again champ!");
            return;
          });
		}
		var ul = document.getElementById("list");

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

$('#project-list').on('change', function() {
	let projectId = $(this).val();
	console.log(projectId);
	getTermsByProject(projectId, function(res) {
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

// create button component
function createProjectOption(project) {
	let option = `<option value="${project.id}">${project.name}</option>`;
	return option;
}

function createTeamOption(team) {
	let option = `<option value="${team.id}">${team.name}</option>`;
	return option;
}

function getTermsByProject(project, callback) {
	$.ajax({
		  type: 'GET',
		  url: `https://dev.azure.com/microsoft/_apis/projects/${project}/teams?api-version=6.0-preview.3`,
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

const tokenInput = document.getElementById("token");
const setTokenBtn = document.getElementById("settoken");
if (setTokenBtn) {
	setTokenBtn.onclick = function() {
		access_token = tokenInput.value;
		chrome.runtime.sendMessage({cmd: "setToken", token: access_token}, function(response) {
			console.log(response);
		});
		tokenInput.value = '';
	}
}