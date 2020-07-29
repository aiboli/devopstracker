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
		});

		for(i = 0; i < projects.length; i++) {
	    	let name = projects[i].name;
			var ul = document.getElementById("list");
			var li = document.createElement("li");
			li.setAttribute('id', name);
			li.appendChild(document.createTextNode(name));
			ul.appendChild(li);
	    }
	};
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