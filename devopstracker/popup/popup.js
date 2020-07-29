//const sendMessageId = document.getElementById("sendmessageid");
// if (sendMessageId) {
//   sendMessageId.onclick = function() {
//     console.log("hello");
//   };
// }

var access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";

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

		var projects = [];

		chrome.runtime.sendMessage({cmd: "getProjects"}, function(response) {
			console.log(response);
			if(!response.result || response.result === "error") return;
			projects = response.result;
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
				$('#list').append(createProjectOption(projects[i]));


				// $.ajax({
				// 	type: 'GET',
				// 	url: projects[i].url,
				// 	headers: {
				// 		"Content-Type":"application/json; charset=utf-8;",
				// 		"Authorization": "Basic " + btoa('Basic' + ":" + access_token)
				// 	}
				// }).done(function(res2) {
					//console.log(res2["_links"]["web"]["href"]);
					//https://dev.azure.com/microsoft/Base
					//res2["_links"]["web"]["href"]

					// var a = document.createElement("a");
					// a.setAttribute('href', res2["_links"]["web"]["href"]);
					// a.setAttribute('target', "_blank");
					// var li = document.createElement("li");
					// li.setAttribute('id', name);
					// li.appendChild(document.createTextNode(name));
					// a.appendChild(li);
					// ul.appendChild(a);
				// }).fail(function(err2){
				// 	alert("couldn't get URL");
				// });
			}
		});

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

// create button component
function createProjectOption(project) {
	let button = `<option value="${project.id}">${project.name}</option>`;
	return button;
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